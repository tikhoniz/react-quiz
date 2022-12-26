import React, { Component } from "react";
import classes from "./Quiz.module.css";
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";
import Loader from "../../components/UI/Loader/Loader";
import { connect } from "react-redux";
import {
	fetchQuizById,
	quizAnswerClick,
	retryQuiz
} from "../../store/actions/quiz";

class Quiz extends Component {
	//retryHandler = () => {
	//@ возвращаем state в исходное состояние
	//this.setState({
	//	results: {}, //@ два состояния succes  или error
	//	isFinished: false,
	//	activeQuestion: 0,
	//	answerState: null
	//});
	//};

	componentDidMount() {
		this.props.fetchQuizById(this.props.match.params.id);
	}
	//^ жизненный цикл вызывается когда компонент закрывается(уничтожается) здесь используется для того чтобы в случае перехода со страницы теста на другую страницу тест обновлялся начинался сначала
	componentWillUnmount() {
		this.props.retryQuiz();
	}

	render() {
		// console.log(this.props.quiz);
		return (
			<div className={classes.Quiz}>
				<div className={classes.QuizWrapper}>
					<h1>Ответьте на все вопросы</h1>
					{this.props.loading || !this.props.quiz ? (
						<Loader />
					) : this.props.isFinished ? (
						<FinishedQuiz
							results={this.props.results}
							quiz={this.props.quiz}
							onRetry={this.props.retryQuiz}
						/>
					) : (
						<ActiveQuiz
							answers={this.props.quiz[this.props.activeQuestion].answers}
							question={this.props.quiz[this.props.activeQuestion].question}
							onAnswerClick={this.props.quizAnswerClick} // вызывается в случае клика на ответ
							quizLength={this.props.quiz.length}
							answerNumber={this.props.activeQuestion + 1} //добавляем 1, что бы счет начинался с 1
							state={this.props.answerState}
						/>
					)}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		results: state.quiz.results, // два состояния succes  или error
		isFinished: state.quiz.isFinished,
		activeQuestion: state.quiz.activeQuestion,
		answerState: state.quiz.answerState, // объекте будет храниться информацию о текущем клике пользователя { [id]: 'success' 'error' }
		quiz: state.quiz.quiz,
		loading: state.quiz.loading
	};
}

function mapDispatchToProps(dispatch) {
	return {
		fetchQuizById: id => dispatch(fetchQuizById(id)),
		quizAnswerClick: answerId => dispatch(quizAnswerClick(answerId)),
		retryQuiz: () => dispatch(retryQuiz())
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
