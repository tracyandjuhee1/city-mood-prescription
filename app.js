const cityTypes = [
	{
		name: "수변 회복형",
		interpretation: "속도를 잠시 늦추고 물가에 머물며, 복잡했던 마음을 가볍게 비워보세요.",
		character: "강이나 하천을 따라 시야가 트이고, 걷다 쉬어갈 자리가 이어지는 길이 잘 어울려요.",
		places: ["서울숲 보행가교", "망원한강공원", "양재천 산책로"],
		scores: {
			energy: { "낮음": 3, "보통": 2, "높음": 0 },
			companion: { "혼자": 2, "함께": 1 },
			time: { "1시간 이내": 1, "2~3시간": 2, "반나절": 2 },
			mood: { "조용함": 3, "활기": 0, "자연": 3, "문화": 0 },
			weather: { "맑음": 2, "흐림": 0, "비": 0 }
		}
	},
	{
		name: "나무 그늘형",
		interpretation: "큰 나무 아래에서 속도를 늦추고, 계절이 바뀌는 모습을 가까이 느껴보세요.",
		character: "오래된 나무 그늘 곁 벤치에서 쉬고, 벤치와 나무 사이로 난 길을 천천히 걸을 수 있는 공간이 잘 어울려요.",
		places: ["남산공원 북측순환로", "삼청공원 산책로", "서울숲 은행나무길"],
		scores: {
			energy: { "낮음": 3, "보통": 2, "높음": 1 },
			companion: { "혼자": 1, "함께": 2 },
			time: { "1시간 이내": 1, "2~3시간": 2, "반나절": 3 },
			mood: { "조용함": 2, "활기": 1, "자연": 3, "문화": 0 },
			weather: { "맑음": 2, "흐림": 2, "비": 0 }
		}
	},
	{
		name: "골목 탐색형",
		interpretation: "익숙한 하루에 작은 발견을 더해보세요. 걷다가 마음에 드는 곳에 들어가도 좋아요.",
		character: "작은 가게와 오래된 건물, 느긋하게 둘러볼 만한 골목이 이어지는 동네가 잘 맞아요.",
		places: ["서촌 골목", "익선동 한옥거리", "연남동 경의선숲길"],
		scores: {
			energy: { "낮음": 0, "보통": 2, "높음": 3 },
			companion: { "혼자": 2, "함께": 2 },
			time: { "1시간 이내": 1, "2~3시간": 3, "반나절": 2 },
			mood: { "조용함": 0, "활기": 3, "자연": 0, "문화": 2 },
			weather: { "맑음": 2, "흐림": 0, "비": 0 }
		}
	},
	{
		name: "실내 문화형",
		interpretation: "날씨나 걸음에 구애받지 않고 새로운 장면을 만나보세요. 감각을 환기하기 좋은 시간이에요.",
		character: "전시 공간이나 서점, 공연장이 모여 있어 실내에서 천천히 머물 수 있는 곳을 추천해요.",
		places: ["국립현대미술관 서울", "서울시립미술관 서소문본관", "아모레퍼시픽미술관"],
		scores: {
			energy: { "낮음": 2, "보통": 2, "높음": 0 },
			companion: { "혼자": 2, "함께": 1 },
			time: { "1시간 이내": 2, "2~3시간": 3, "반나절": 3 },
			mood: { "조용함": 1, "활기": 1, "자연": 0, "문화": 3 },
			weather: { "맑음": 0, "흐림": 2, "비": 7 }
		}
	}
];

const form = document.querySelector("#prescription-form");
const resultSection = document.querySelector("#result");
const resultHeading = document.querySelector("#result-heading");
const resultInterpretation = document.querySelector("#result-interpretation");
const resultMemo = document.querySelector("#result-memo");
const resultCharacter = document.querySelector("#result-character");
const placeList = document.querySelector("#place-list");
const resetButton = document.querySelector("#reset-button");

// 함수는 다섯 가지 답변을 도시 유형별 점수와 비교해 가장 잘 맞는 처방을 고릅니다.
function recommendCityExperience(answers) {
	let bestMatch = cityTypes[0];
	let highestScore = -1;

	// 반복문은 모든 도시 유형과 다섯 답변(날씨 포함)을 차례로 점수에 반영합니다.
	for (const cityType of cityTypes) {
		let score = 0;

		// 날씨 점수도 합산하며, 비가 오면 실내 문화형이 우선되도록 가중합니다.
		for (const [question, answer] of Object.entries(answers)) {
			score += cityType.scores[question][answer];
		}

		// 조건문은 현재 유형이 지금까지의 최고 점수보다 높을 때 추천을 갱신합니다.
		if (score > highestScore) {
			highestScore = score;
			bestMatch = cityType;
		}
	}

	return bestMatch;
}

function renderPrescription(cityType, memo) {
	resultHeading.textContent = cityType.name;
	resultInterpretation.textContent = cityType.interpretation;
	resultMemo.hidden = !memo;
	resultMemo.textContent = memo ? `오늘의 메모: ${memo}` : "";
	resultCharacter.textContent = cityType.character;
	placeList.replaceChildren();

	for (const [index, place] of cityType.places.entries()) {
		const item = document.createElement("li");
		const number = document.createElement("span");
		const name = document.createElement("span");

		number.className = "place-number";
		number.textContent = String(index + 1).padStart(2, "0");
		name.className = "place-name";
		name.textContent = place;
		item.append(number, name);
		placeList.append(item);
	}

	resultSection.hidden = false;
	resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", (event) => {
	event.preventDefault();
	const formData = new FormData(form);
	const answers = {
		energy: formData.get("energy"),
		companion: formData.get("companion"),
		time: formData.get("time"),
		mood: formData.get("mood"),
		weather: formData.get("weather")
	};
	const memo = formData.get("memo").trim();

	renderPrescription(recommendCityExperience(answers), memo);
});

resetButton.addEventListener("click", () => {
	form.reset();
	resultSection.hidden = true;
	form.scrollIntoView({ behavior: "smooth", block: "start" });
});
