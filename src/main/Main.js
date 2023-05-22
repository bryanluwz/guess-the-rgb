import { Component, createRef } from "react";
import { ContentDisplay } from "../components/others/";
import { setCookieValue, getCookieValue } from "../components/utils/cookieMonster";

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
			},

			mode: "Normal"
		};

		this.mehArrowColor = "red";
		this.closeArrowColor = "green";
		this.cookieName = "guessTheRGB";

		this.inputRefs = {
			r: createRef(),
			g: createRef(),
			b: createRef(),
			submitButton: createRef()
		};
	}

	componentDidMount() {
		const guessTheRGBData = getCookieValue(this.cookieName);
		if (guessTheRGBData) {
			if (guessTheRGBData.targetRGBValue) {
				const { r, g, b } = guessTheRGBData.targetRGBValue;
				this.setState({
					targetRGBValue: { r: r, g: g, b: b },
					targetCSSColor: this.createCSSColorStringFromRGBValue(r, g, b)
				});
			}

			if (guessTheRGBData.mode) {
				this.setState({ mode: guessTheRGBData.mode });
			}

			if (guessTheRGBData.currentInputType) {
				this.setState({ currentInputType: guessTheRGBData.currentInputType });
			}

			if (guessTheRGBData.currentRGBValue) {
				// Need to set input to match also
				var { r, g, b } = guessTheRGBData.currentRGBValue;
				this.setState({ currentRGBValue: guessTheRGBData.currentRGBValue });

				if (guessTheRGBData.currentInputType) {
					if (guessTheRGBData.currentInputType === 'RGB') {
						;
					}
					else if (guessTheRGBData.currentInputType === "Hex") {
						r = this.decToHex(r);
						g = this.decToHex(g);
						b = this.decToHex(b);
					}

					var cssColor = "";
					if (!(r === g && g === b && b === ""))
						cssColor = this.createCSSColorStringFromRGBValue(r, g, b);

					this.setState({
						currentRGBValue: guessTheRGBData.currentRGBValue,
						currentCSSColor: cssColor,
						r: r,
						g: g,
						b: b
					});
				}
			}
		}
		else {
			const { r, g, b } = this.createRandomRGB();
			this.setState({
				targetRGBValue: { r: r, g: g, b: b },
				targetCSSColor: this.createCSSColorStringFromRGBValue(r, g, b)
			});
			this.setThisCookieValue("targetRGBValue", { r: r, g: g, b: b });
		}
	}

	// Set cookies value
	setThisCookieValue = (key, value) => {
		const data = getCookieValue(this.cookieName);
		if (data) {
			data[key] = value;
			setCookieValue(this.cookieName, data);
		}
		else {
			setCookieValue(this.cookieName, { [key]: value });
		}
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevState.currentCSSColor !== this.state.currentCSSColor) {
			this.setThisCookieValue("currentRGBValue", this.state.currentRGBValue);
			if (this.state.mode === 'Normal')
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

		this.setThisCookieValue("targetRGBValue", { r: r, g: g, b: b });
	};

	// Handle change mode
	handleChangeModeButton = () => {
		const { mode } = this.state;
		var nextMode = "foo";
		if (mode.toLocaleLowerCase() === 'normal') {
			nextMode = "Hard";
		}
		else {
			nextMode = "Normal";
		}

		this.setState({ mode: nextMode });
		this.setThisCookieValue("mode", nextMode);
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

			this.setThisCookieValue("currentInputType", "Hex");
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

			this.setThisCookieValue("currentInputType", "RGB");
		}
	};

	// Handle set RGB
	setRGBValue = (evt, color, options = "none") => {
		const inputValue = evt.target.value;

		if (this.state.currentInputType === "RGB") {
			const rgbInputValue = parseInt(inputValue) + (options === "inc" ? 1 : options === "dec" ? -1 : 0);
			const { currentRGBValue } = this.state;

			if (!this.checkRGBInRange(rgbInputValue) && inputValue !== "") evt.preventDefault();

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

			this.setThisCookieValue("currentRGBValue", this.state.currentRGBValue);
		}

		else if (this.state.currentInputType === "Hex") {
			const rgbInputValue = this.hexToDec(inputValue) + (options === "inc" ? 1 : options === "dec" ? -1 : 0); // It is in hex now
			const { currentRGBValue } = this.state;

			if (!this.checkRGBInRange(rgbInputValue) && inputValue !== "") evt.preventDefault();

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

			this.setThisCookieValue("currentRGBValue", this.state.currentRGBValue);
		}
	};

	checkRGBInRange(val, min = 0, max = 255) {
		return !isNaN(val) && (min <= val) && (val <= max);
	}

	hexToDec = (hex) => {
		var ret = parseInt(hex, 16);
		return !isNaN(ret) ? ret : "";
	};

	decToHex = (dec) => {
		var ret = dec.toString(16).toUpperCase();
		return ret;
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

		if (result.deltaR === "unset") {
			;
		} else if (result.deltaR >= mehThreshold) {
			rArrowUp.color = this.mehArrowColor;
			rArrowUp.visibility = "unset";
		} else if (result.deltaR <= -veryGoodThreshold) {
			rArrowDown.color = this.mehArrowColor;
			rArrowDown.visibility = "unset";
		}

		if (result.deltaG === "unset") {
			;
		} else if (result.deltaG >= mehThreshold) {
			gArrowUp.color = this.mehArrowColor;
			gArrowUp.visibility = "unset";
		} else if (result.deltaG <= -mehThreshold) {
			gArrowDown.color = this.mehArrowColor;
			gArrowDown.visibility = "unset";
		}

		if (result.deltaB === "unset") {
			;
		} else if (result.deltaB >= mehThreshold) {
			bArrowUp.color = this.mehArrowColor;
			bArrowUp.visibility = "unset";
		} else if (result.deltaB <= -mehThreshold) {
			bArrowDown.color = this.mehArrowColor;
			bArrowDown.visibility = "unset";
		}

		// Handles user message and success bool
		var userMessage = "";
		var success = false;


		if (result === "fantastic") {
			userMessage = "😲 perfect 🥴";
			success = true;
		}
		else if (result === "wonderful") {
			userMessage = "🤩 wonderfully close";
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

		if (rDiff === 0 && gDiff === 0 && bDiff === 0) {
			return "fantastic";
		}

		else if (rDiff <= veryGoodThreshold && gDiff <= veryGoodThreshold && bDiff <= veryGoodThreshold) {
			return "wonderful";
		}

		else if (rDiff <= mehThreshold && gDiff <= mehThreshold && bDiff <= mehThreshold) {
			return "meh";
		}

		else {
			return {
				deltaR: currentRGB.r === "" ? "unset" : targetRGB.r - currentRGB.r,
				deltaG: currentRGB.g === "" ? "unset" : targetRGB.g - currentRGB.g,
				deltaB: currentRGB.b === "" ? "unset" : targetRGB.b - currentRGB.b
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
								<button onClick={this.handleChangeModeButton}>{this.state.mode}</button>
								<button onClick={this.handleChangeInputButton}>{this.state.currentInputType === "RGB" ? "to Hex" : "to RGB"}</button>
							</div>
							<RGBInput
								inputRefs={this.inputRefs}
								setRGBValue={this.setRGBValue}
								r={this.state.r}
								g={this.state.g}
								b={this.state.b}
								RGBArrowsStyle={this.state.RGBArrowsStyle}
								inputType={this.state.currentInputType}
							/>
							<div className="gtr-ui-buttons gtr-ui-buttons-vertical">
								{this.state.mode === 'Hard' && <button ref={this.inputRefs.submitButton} onClick={this.handleSubmission} >Submit</button>}
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
	constructor(props) {
		super(props);
		this.inputRefs = this.props.inputRefs;
	}

	render() {
		const { rArrowUp, rArrowDown, gArrowUp, gArrowDown, bArrowUp, bArrowDown } = this.props.RGBArrowsStyle;

		return (
			<div className="gtr-ui-input-container">
				<div className="gtr-ui-input" >
					<i className="fa fa-sort-up" style={rArrowUp} />
					<input
						ref={this.inputRefs.r}
						value={this.props.r}
						onKeyDown={
							(evt) => {
								if (evt.key === "Enter") {
									evt.preventDefault();
									if (evt.shiftKey)
										this.inputRefs.b.current.focus();
									else
										this.inputRefs.g.current.focus();
								}
								if (evt.key === "ArrowUp") {
									evt.preventDefault();
									this.props.setRGBValue(evt, "r", "inc");
								}
								if (evt.key === "ArrowDown") {
									evt.preventDefault();
									this.props.setRGBValue(evt, "r", "dec");
								}
							}
						}
						onChange={(evt) => { this.props.setRGBValue(evt, "r"); }}
					/>
					<i className="fa fa-sort-down" style={rArrowDown} />
				</div>
				<div className="gtr-ui-input" >
					<i className="fa fa-sort-up" style={gArrowUp} />
					<input
						ref={this.inputRefs.g}
						value={this.props.g}
						onKeyDown={
							(evt) => {
								if (evt.key === "Enter") {
									evt.preventDefault();
									if (evt.shiftKey)
										this.inputRefs.r.current.focus();
									else
										this.inputRefs.b.current.focus();
								}
								if (evt.key === "ArrowUp") {
									evt.preventDefault();
									this.props.setRGBValue(evt, "g", "inc");
								}
								if (evt.key === "ArrowDown") {
									evt.preventDefault();
									this.props.setRGBValue(evt, "g", "dec");
								}
							}
						}
						onChange={(evt) => { this.props.setRGBValue(evt, "g"); }}
					/>
					<i className="fa fa-sort-down" style={gArrowDown} />
				</div>
				<div className="gtr-ui-input" >
					<i className="fa fa-sort-up" style={bArrowUp} />
					<input
						ref={this.inputRefs.b}
						value={this.props.b}
						onKeyDown={
							(evt) => {
								if (evt.key === "Enter") {
									evt.preventDefault();
									if (evt.shiftKey)
										this.inputRefs.g.current.focus();
									else
										this.inputRefs.submitButton.current.click();
								}
								if (evt.key === "ArrowUp") {
									evt.preventDefault();
									this.props.setRGBValue(evt, "b", "inc");
								}
								if (evt.key === "ArrowDown") {
									evt.preventDefault();
									this.props.setRGBValue(evt, "b", "dec");
								}
							}
						}
						onChange={(evt) => { this.props.setRGBValue(evt, "b"); }}
					/>
					<i className="fa fa-sort-down" style={bArrowDown} />
				</div>
			</div>
		);
	}
}