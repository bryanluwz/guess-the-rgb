import { Component } from "react";
import { ContentDisplay } from "../components/others/";

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			targetRGBValue: null,
			targetCSSColor: null,
			currentInputType: "RGB",
			// Current
			currentRGBValue: {
				r: "",
				g: "",
				b: "",
			},
			currentCSSColor: null,
			// The displayed RGB Value
			r: "",
			g: "",
			b: "",
		};
	}

	componentDidMount() {
		const { r, g, b } = this.createRandomRGB();
		this.setState({
			targetRGBValue: { r: r, g: g, b: b },
			targetCSSColor: this.createCSSColorStringFromRGBValue(r, g, b)
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

	// Handle change input button
	handleChangeInputButton = () => {
		const { currentInputType } = this.state;
		var nextInputType = null;
		if (currentInputType === 'RGB') nextInputType = "Hex";
		else if (currentInputType === 'Hex') nextInputType = "RGB";

		const { r, g, b } = this.state;

		this.setState({
			currentInputType: nextInputType,
			r: this.decToHex(r),
			g: this.decToHex(g),
			b: this.decToHex(b),
		});
	};

	// Handle set RGB
	setRGBValue = (evt, color) => {
		const inputValue = evt.target.value;

		if (this.state.currentInputType === "RGB") {
			const rgbInputValue = parseInt(inputValue);
			const { currentRGBValue } = this.state;

			if (inputValue === "") {
				this.setState({ [color]: "" });
				currentRGBValue[color] = "";
			} else if (this.checkRGBInRange(rgbInputValue)) {
				this.setState({ [color]: rgbInputValue });
				currentRGBValue[color] = rgbInputValue;
			}

			const { r, g, b } = currentRGBValue;

			this.setState({
				currentRGBValue: currentRGBValue,
				currentCSSColor: this.createCSSColorStringFromRGBValue(r, g, b)
			});
		}

		else if (this.state.currentInputType === "Hex") {
			const rgbInputValue = this.hexToDec(inputValue); // It is in hex now
			const { currentRGBValue } = this.state;

			if (inputValue === "") {
				this.setState({ [color]: "" });
				currentRGBValue[color] = "";
			} else if (this.checkRGBInRange(rgbInputValue)) {
				this.setState({ [color]: this.decToHex(rgbInputValue) });
				currentRGBValue[color] = rgbInputValue;
			}

			const { r, g, b } = currentRGBValue;

			this.setState({
				currentRGBValue: currentRGBValue,
				currentCSSColor: this.createCSSColorStringFromRGBValue(r, g, b)
			});
		}
	};

	checkRGBInRange(val, min = 0, max = 255) {
		return !isNaN(val) && min <= val && val <= max;
	}

	hexToDec = (hex) => {
		return parseInt(hex, 16);
	};

	decToHex = (dec) => {
		return dec.toString(16).toUpperCase();
	};

	render() {
		console.log(this.state.currentRGBValue);
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
								style={{ backgroundColor: this.state.targetCSSColor }}
								className="gtr-display">
							</div>
						</div>
						<div className="gtr-ui-container">
							<div className="gtr-ui-buttons">
								<button>New Game</button>
								<button onClick={this.handleChangeInputButton}>{this.state.currentInputType}</button>
							</div>
							<RGBInput setRGBValue={this.setRGBValue} r={this.state.r} g={this.state.g} b={this.state.b} />
						</div>
					</div>
				</div>
			</ContentDisplay>
		);
	}
}

Main.displayName = "Guess the RGB";

class RGBInput extends Component {
	render() {
		return (
			<div className="gtr-ui-input-container">
				<div className="gtr-ui-input" >
					<i className="fa fa-sort-up" />
					<input
						value={this.props.r}
						onChange={(evt) => { this.props.setRGBValue(evt, "r"); }}
					/>
					<i className="fa fa-sort-down" />
				</div>
				<div className="gtr-ui-input" >
					<i className="fa fa-sort-up" />
					<input
						value={this.props.g}
						onChange={(evt) => { this.props.setRGBValue(evt, "g"); }}
					/>
					<i className="fa fa-sort-down" />
				</div>
				<div className="gtr-ui-input" >
					<i className="fa fa-sort-up" />
					<input
						value={this.props.b}
						onChange={(evt) => { this.props.setRGBValue(evt, "b"); }}
					/>
					<i className="fa fa-sort-down" />
				</div>
			</div>
		);
	}
}