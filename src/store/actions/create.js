import { CREATE_QUIZ_QUESTION, RESET_QUIZ_CREATION } from "./actionTypes";
import axios from "../../axios/axios-quiz";

//- метод вызывается в QuizCreator.js и принимает в себя вопрос из формы логика описана в reducer/create.js
export function createQuizQuestion(item) {
	return { type: CREATE_QUIZ_QUESTION, item };
}

export function resetQuizCreation() {
	return {
		type: RESET_QUIZ_CREATION
	};
}

export function finishCreateQuiz() {
	return async (dispatch, getState) => {
		await axios.post(
			"/quizes.json", //  "https://react-quiz-f6edc.firebaseio.com/quizes.json",//^ url можно сократить
			getState().create.quiz
		);
		dispatch(resetQuizCreation());
	};
}
