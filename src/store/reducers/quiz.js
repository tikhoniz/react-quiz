import {
	FETCH_QUIZES_START,
	FETCH_QUIZES_SUCCESS,
	FETCH_QUIZES_ERROR,
	FETCH_QUIZ_SUCCESS,
	QUIZ_SET_STATE,
	FINISH_QUIZ,
	NEXT_QUIZ_QUESTION,
	QUIZ_RETRY
} from "../actions/actionTypes";

//^ state с которого начинается приложение
const initialState = {
	quizes: [],
	loading: false,
	error: null,
	results: {}, // два состояния succes  или error
	isFinished: false,
	activeQuestion: 0,
	answerState: null, // объекте будет храниться информацию о текущем клике пользователя { [id]: 'success' 'error' }
	quiz: null
};

export default function quizReducer(state = initialState, action) {
	switch (action.type) {
		case FETCH_QUIZES_START:
			return { ...state, loading: true }; //spread оператор возвращает весь стейт и изменяет только   параметр loading
		case FETCH_QUIZES_SUCCESS:
			return { ...state, loading: false, quizes: action.quizes };
		case FETCH_QUIZES_ERROR:
			return {
				...state,
				loading: false,
				error: action.error
			};
		case FETCH_QUIZ_SUCCESS:
			return {
				...state,
				loading: false,
				quiz: action.quiz
			};
		case QUIZ_SET_STATE:
			return {
				...state,
				answerState: action.answerState,
				results: action.results
			};
		case FINISH_QUIZ:
			return { ...state, isFinished: true };
		case NEXT_QUIZ_QUESTION: {
			return {
				...state,
				answerState: null,
				activeQuestion: action.number
			};
		}
		case QUIZ_RETRY: {
			return {
				...state,
				results: {}, //^ два состояния succes  или error
				isFinished: false,
				activeQuestion: 0,
				answerState: null
			};
		}
		default:
			return state;
	}
}
