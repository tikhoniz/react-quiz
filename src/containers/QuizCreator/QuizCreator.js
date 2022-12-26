import React, { Component } from "react";
import classes from "./QuizCreator.module.css";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import Select from "../../components/UI/Select/Select";
import {
	createControl,
	validate,
	validateForm
} from "../../form/formFramework";
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
//import axios from "../../axios/axios-quiz"; //^ забираем часть  URL из инстанса axios
import { connect } from "react-redux";
import {
	createQuizQuestion,
	finishCreateQuiz
} from "../../store/actions/create";

function createOptionControl(number) {
	//-функция для создания поля ввода
	return createControl(
		{
			label: `Вариант ${number}`,
			errorMessage: "Значение не может быть пустым",
			id: number
		},
		{ required: true }
	);
}

function createFormControls() {
	return {
		question: createControl(
			{
				label: "Введите вопрос",
				errorMessage: "Вопрос не может быть пустым"
			},
			{ required: true }
		),
		options1: createOptionControl(1),
		options2: createOptionControl(2),
		options3: createOptionControl(3),
		options4: createOptionControl(4)
	};
}

class QuizCreator extends Component {
	state = {
		isFormValid: false,
		rightAnswerId: 1,
		formControls: createFormControls()
	};

	submitHandler = event => {
		event.preventDefault();
	};
	//- метод добавления вопроса с вариантами ответа
	addQuestionHandler = event => {
		event.preventDefault();

		const {
			question,
			option1,
			option2,
			option3,
			option4
		} = this.state.formControls; //^деструктуризация для дальнейшего обращения

		const questionItem = {
			//question: this.state.formControls.question.value,
			//^вместо такого обращения можно написать
			question: question.value,
			//^ поскольку выше выполнена деструктуризация
			id: this.props.quiz.length + 1,
			rightAnswerId: this.state.rightAnswerId,
			answers: [
				{
					//@ text: this.state.formControls.options1.value,
					//@ id: this.state.formControls.options1.id
					text: option1.value,
					id: option1.id

					//^вместо такого обращения можно написать поскольку выше выполнена деструктуризация
				},
				{ text: option2.value, id: option2.id },
				{ text: option3.value, id: option3.id },
				{ text: option4.value, id: option4.id }
			]
		};

		this.props.createQuizQuestion(questionItem); //^ метод записан в store/actions/create.js

		//^поменять стейт
		this.setState({
			isFormValid: false, //^очищает форму для ввода данных
			rightAnswerId: 1,
			formControls: createFormControls()
		});
	};

	//^первый вариант работы с сервером
	//  createQuizHandler = event => {
	//    event.preventDefault();

	// axios
	//   .post(
	//     "https://react-quiz-f6edc.firebaseio.com/quizes.json",
	//     this.state.quiz
	//   )
	//   .then(response => {
	//     console.log(response);
	//   })
	//   .catch(error => {
	//     console.log(error);
	//   });
	//  };

	//^второй вариант работы с сервером через async away
	createQuizHandler = event => {
		event.preventDefault();

		//^в случае успешного ответа обнуляем state
		this.setState({
			isFormValid: false, //-очищает форму для ввода данных
			rightAnswerId: 1,
			formControls: createFormControls()
		});
		this.props.finishCreateQuiz();
	};

	changeHandler = (value, controlName) => {
		const formControls = { ...this.state.formControls }; // - используется spread оператор для копирования стейта
		const control = { ...formControls[controlName] }; //- получения текущего контролла

		console.log(control);

		control.touched = true;
		control.value = value;
		control.valid = validate(control.value, control.validation);
		formControls[controlName] = control;
		this.setState({
			formControls,
			isFormValid: validateForm(formControls) //^ меняет значение либо на true либо false разблокирует кнопку добавления вопроса
		});
	};

	renderControls() {
		return Object.keys(this.state.formControls).map((controlName, index) => {
			const control = this.state.formControls[controlName];

			return (
				<Auxiliary key={controlName + index}>
					<Input
						label={control.label}
						value={control.value}
						valid={control.valid}
						shouldValidate={!!control.validation}
						touched={control.touched}
						errorMessage={control.errorMessage}
						onChange={event =>
							this.changeHandler(event.target.value, controlName)
						}
					/>
					{index === 0 ? <hr /> : null}
				</Auxiliary>
			);
		});
	}
	selectChangeHandler = event => {
		this.setState({
			rightAnswerId: +event.target.value //- '+' приводит к числу
		});
	};

	render() {
		const select = (
			<Select
				label="Выберите правильный ответ"
				value={this.state.rightAnswerId}
				onChange={this.selectChangeHandler}
				options={[
					{ text: 1, value: 1 },
					{ text: 2, value: 2 },
					{ text: 3, value: 3 },
					{ text: 4, value: 4 }
				]}
			/>
		);
		return (
			<section className={classes.QuizCreator}>
				<div>
					<h1>Создание теста</h1>
					<form onSubmit={this.submitHandler}>
						{this.renderControls()}

						{select}

						<Button
							type="primary"
							onClick={this.addQuestionHandler} //^ кнопка добавления вопроса
							disabled={!this.state.isFormValid} //^ если значение isFormValid не true кнопка заблокирована
						>
							Добавить вопрос
						</Button>
						<Button
							type="success"
							onClick={this.createQuizHandler}
							disabled={this.props.quiz.length === 0}
						>
							Создать тест
						</Button>
					</form>
				</div>
			</section>
		);
	}
}

function mapStateToProps(state) {
	return {
		quiz: state.create.quiz
	};
}

function mapDispatchToProps(dispatch) {
	return {
		createQuizQuestion: item => dispatch(createQuizQuestion(item)),
		finishCreateQuiz: () => dispatch(finishCreateQuiz())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizCreator);
