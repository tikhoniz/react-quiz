import React, { Component } from "react";
import classes from "./Drawer.module.css";
import { NavLink } from "react-router-dom";
import Backdrop from "../../UI/Backdrop/Backdrop";

class Drawer extends Component {
	clickHandler = () => {
		this.props.onClose();
	};

	//-создание пунктов меню
	renderLinks(links) {
		return links.map((link, index) => {
			return (
				<li key={index}>
					<NavLink
						to={link.to}
						exact={link.exact}
						activeClassName={classes.active}
						onClick={this.clickHandler}
					>
						{link.label}
					</NavLink>
				</li>
			);
		});
	}
	render() {
		const cls = [classes.Drawer];

		if (!this.props.isOpen) {
			cls.push(classes.close);
		}
		//-массив пунктов меню
		const links = [{ to: "/", label: "Cписок", exact: true }];
		//-если пользователь авторизирован, то добавить пункты меню
		if (this.props.isAuthenticated) {
			links.push({ to: "/quiz-creator", label: "Создать тест", exact: false });
			links.push({ to: "/logout", label: "Выйти", exact: false });
		} else {
			//-если нет, то добавить следующие пункты
			links.push({ to: "/auth", label: "Авторизация", exact: false });
		}

		return (
			<>
				<nav className={cls.join(" ")}>
					<ul>{this.renderLinks(links)}</ul>
				</nav>
				{this.props.isOpen ? <Backdrop onClick={this.props.onClose} /> : null}
			</>
		);
	}
}

export default Drawer;
