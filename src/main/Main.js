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

			success: false,
			userMessage: "",

			RGBArrowsStyle: {
				rArrowUp: { color: "bla", visibility: "hidden" },
				rArrowDown: { color: "bla", visibility: "hidden" },
				gArrowUp: { color: "bla", visibility: "hidden" },
				gArrowDown: { color: "bla", visibility: "hidden" },
				bArrowUp: { color: "bla", visibility: "hidden" },
				bArrowDown: { color: "bla", visibility: "hidden" },
			}
		};

		this.arrowColor = "red";
	}

	componentDidMount() {
		const { r, g, b } = this.createRandomRGB();
		this.setState({
			targetRGBValue: { r: r, g: g, b: b },
			targetCSSColor: this.createCSSColorStringFromRGBValue(r, g, b)
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.currentCSSColor !== this.state.currentCSSColor) {
			this.handleSubmission();
		}
	}

	createRandomRGB = () => {
		const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
		const r = randomBetween(0, 255);
		const g = randomBetween(0, 255);
		const b = randomBetween(0, 255);
		return { r, g, b };
	};

	createCSSColorStringFromRGBValue = (r, g, b) => {
		if (r === g && g === b && b === 0) return `rgb(${r},${g},${b})`;
		if (r === "") r = 0;
		if (g === "") g = 0;
		if (b === "") b = 0;
		return `rgb(${r},${g},${b})`;
	};

	// Handle new game
	handleNewGameButton = () => {
		this.setState({
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

			success: false,
			userMessage: "",

			RGBArrowsStyle: {
				rArrowUp: { color: "bla", visibility: "hidden" },
				rArrowDown: { color: "bla", visibility: "hidden" },
				gArrowUp: { color: "bla", visibility: "hidden" },
				gArrowDown: { color: "bla", visibility: "hidden" },
				bArrowUp: { color: "bla", visibility: "hidden" },
				bArrowDown: { color: "bla", visibility: "hidden" },
			}
		});

		const { r, g, b } = this.createRandomRGB();
		this.setState({
			targetRGBValue: { r: r, g: g, b: b },
			targetCSSColor: this.createCSSColorStringFromRGBValue(r, g, b)
		});
	};

	// Handle change input button
	handleChangeInputButton = () => {
		const { currentInputType } = this.state;
		var nextInputType = null;
		if (currentInputType === 'RGB') {
			nextInputType = "Hex";

			const { r, g, b } = this.state;

			this.setState({
				currentInputType: nextInputType,
				r: this.decToHex(r),
				g: this.decToHex(g),
				b: this.decToHex(b),
			});
		}
		else if (currentInputType === 'Hex') {
			nextInputType = "RGB";
			const { r, g, b } = this.state;

			this.setState({
				currentInputType: nextInputType,
				r: this.hexToDec(r),
				g: this.hexToDec(g),
				b: this.hexToDec(b),
			});
		}
	};

	// Handle set RGB
	setRGBValue = (evt, color) => {
		const inputValue = evt.target.value;

		if (this.state.currentInputType === "RGB") {
			const rgbInputValue = parseInt(inputValue);
			const { currentRGBValue } = this.state;

			if (!this.checkRGBInRange(rgbInputValue) && inputValue !== "") return;

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

			if (!this.checkRGBInRange(rgbInputValue) && inputValue !== "") return;

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

	// Handle submission
	handleSubmission = () => {
		const { currentRGBValue, targetRGBValue } = this.state;

		const result = this.compareRGBValue(targetRGBValue, currentRGBValue);

		this.handlePostSubmission(result);
	};

	handlePostSubmission = (result, veryGoodThreshold = 5, mehThreshold = 10) => {
		// Handles RGB arrows
		const RGBArrowsStyle = {
			rArrowUp: { color: "bla", visibility: "hidden" },
			rArrowDown: { color: "bla", visibility: "hidden" },
			gArrowUp: { color: "bla", visibility: "hidden" },
			gArrowDown: { color: "bla", visibility: "hidden" },
			bArrowUp: { color: "bla", visibility: "hidden" },
			bArrowDown: { color: "bla", visibility: "hidden" },
		};

		const { rArrowUp, rArrowDown, gArrowUp, gArrowDown, bArrowUp, bArrowDown } = RGBArrowsStyle;

		if (result.deltaR >= mehThreshold) {
			rArrowUp.color = this.arrowColor;
			rArrowUp.visibility = "unset";
		} else if (result.deltaR <= -veryGoodThreshold) {
			rArrowDown.color = this.arrowColor;
			rArrowDown.visibility = "unset";
		}

		if (result.deltaG >= mehThreshold) {
			gArrowUp.color = this.arrowColor;
			gArrowUp.visibility = "unset";
		} else if (result.deltaG <= -mehThreshold) {
			gArrowDown.color = this.arrowColor;
			gArrowDown.visibility = "unset";
		}

		if (result.deltaB >= mehThreshold) {
			bArrowUp.color = this.arrowColor;
			bArrowUp.visibility = "unset";
		} else if (result.deltaB <= -mehThreshold) {
			bArrowDown.color = this.arrowColor;
			bArrowDown.visibility = "unset";
		}

		// Handles user message and success bool
		var userMessage = "";
		var success = false;
		if (result === "wonderful") {
			userMessage = "🤩 wonderful!!";
			success = true;
		}
		else if (result === "meh") {
			userMessage = "🫤 close enough i guess";
			success = true;
		}

		this.setState({ userMessage, success, RGBArrowsStyle });
	};

	// Compare RGB values
	compareRGBValue = (targetRGB, currentRGB, veryGoodThreshold = 5, mehThreshold = 10) => {
		const rDiff = Math.abs(targetRGB.r - currentRGB.r);
		const gDiff = Math.abs(targetRGB.g - currentRGB.g);
		const bDiff = Math.abs(targetRGB.b - currentRGB.b);

		if (rDiff <= veryGoodThreshold && gDiff <= veryGoodThreshold && bDiff <= veryGoodThreshold) {
			return "wonderful";
		}

		else if (rDiff <= mehThreshold && gDiff <= mehThreshold && bDiff <= mehThreshold) {
			return "meh";
		}

		else {
			return {
				deltaR: targetRGB.r - currentRGB.r,
				deltaG: targetRGB.g - currentRGB.g,
				deltaB: targetRGB.b - currentRGB.b
			};
		}
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
								style={{ backgroundColor: this.state.targetCSSColor }}
								className="gtr-display"
							/>
							<div
								style={{ backgroundColor: this.state.currentCSSColor }}
								className="gtr-display gtr-subdisplay"
							/>
						</div>
						<div className="gtr-ui-container">
							<div className="gtr-ui-buttons">
								<button onClick={this.handleNewGameButton}>New Game</button>
								<button onClick={this.handleChangeInputButton}>{this.state.currentInputType}</button>
							</div>
							<RGBInput
								setRGBValue={this.setRGBValue}
								r={this.state.r}
								g={this.state.g}
								b={this.state.b}
								RGBArrowsStyle={this.state.RGBArrowsStyle}
							/>
							<div className="gtr-ui-buttons">
								{this.state.userMessage}
							</div>
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
		const { rArrowUp, rArrowDown, gArrowUp, gArrowDown, bArrowUp, bArrowDown } = this.props.RGBArrowsStyle;

		return (
			<div className="gtr-ui-input-container">
				<div className="gtr-ui-input" >
					<i className="fa fa-sort-up" style={rArrowUp} />
					<input
						value={this.props.r}
						onChange={(evt) => { this.props.setRGBValue(evt, "r"); }}
					/>
					<i className="fa fa-sort-down" style={rArrowDown} />
				</div>
				<div className="gtr-ui-input" >
					<i className="fa fa-sort-up" style={gArrowUp} />
					<input
						value={this.props.g}
						onChange={(evt) => { this.props.setRGBValue(evt, "g"); }}
					/>
					<i className="fa fa-sort-down" style={gArrowDown} />
				</div>
				<div className="gtr-ui-input" >
					<i className="fa fa-sort-up" style={bArrowUp} />
					<input
						value={this.props.b}
						onChange={(evt) => { this.props.setRGBValue(evt, "b"); }}
					/>
					<i className="fa fa-sort-down" style={bArrowDown} />
				</div>
			</div>
		);
	}
}