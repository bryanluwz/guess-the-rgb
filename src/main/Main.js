import { Component } from "react";
import { ContentDisplay } from "../components/others/";

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentRGBValue: null,
			currentCSSColor: null
		};
	}

	componentDidMount() {
		const { r, g, b } = this.createRandomRGB();
		this.setState({
			currentRGBValue: { r: r, g: g, b: b },
			currentCSSColor: this.createCSSColorStringFromRGBValue(r, g, b)
		});
	}

	createRandomRGB = () => {
		const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
		const r = randomBetween(0, 255);
		const g = randomBetween(0, 255);
		const b = randomBetween(0, 255);
		return { r, g, b };
	};

	createCSSColorStringFromRGBValue = (r, g, b) => {
		return `rgb(${r},${g},${b})`;
	};

	render() {
		return (
			<ContentDisplay
				backButtonRedirect={"https://bryanluwz.github.io/#/fun-stuff"}
				displayName={Main.displayName}
				displayClearHistory={false}
				faIcon={"fa-trash"}
				contentBodyAdditionalClasses={["cat-gpt-content-wrapper"]}
				router={this.props.router}
				handleHeaderTitleClick={() => { console.log("please do not the cat"); }}
			>
				<div className="gtr-wrapper">
					<div className="gtr-container">
						<div className="gtr-display-container">
							<div
								style={{ backgroundColor: this.state.currentCSSColor }}
								className="gtr-display">
							</div>
						</div>
						<div className="gtr-ui-container">
							<div className="gtr-ui-buttons">
								<button>new game</button>
								<button>change input method</button>
							</div>
							<div className="gtr-ui-input-container">
								<div className="gtr-ui-input" >
									<i className="fa fa-sort-up" />
									<input />
									<i className="fa fa-sort-down" />
								</div>
								<div className="gtr-ui-input" >
									<i className="fa fa-sort-up" />
									<input />
									<i className="fa fa-sort-down" />
								</div>
								<div className="gtr-ui-input" >
									<i className="fa fa-sort-up" />
									<input />
									<i className="fa fa-sort-down" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</ContentDisplay>
		);
	}
}

Main.displayName = "Guess the RGB";
