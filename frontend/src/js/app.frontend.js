class SimonApp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentPage: 'title'
		};

		this.goToGame = this.goToGame.bind(this);
		this.goToTitle = this.goToTitle.bind(this);
	}

	goToGame() {
		this.setState(() => ({ currentPage: 'game' }));
	}

	goToTitle() {
		this.setState(() => ({ currentPage: 'title' }));
	}

	render() {
		return (
			<div>
				{this.state.currentPage === 'title' && <TitleScreen goToGame={this.goToGame} />}
				{this.state.currentPage === 'game' && <GameScreen goToTitle={this.goToTitle} />}
			</div>
		);
	}
}

class TitleScreen extends React.Component {
	render() {
		return (
			<div className="title-screen">
				<div className="play">
					<h1 className="game-title">Simon</h1>
					<div className="btn btn-green btn-play" onClick={this.props.goToGame}>
						Play Now
					</div>
				</div>
				<ScoreBoard />
			</div>
		);
	}
}

class ScoreBoard extends React.Component {
	constructor(props) {
		super(props);

		this.state = { data: [] };

		this.createTableData = this.createTableData.bind(this);
	}

	componentDidMount() {
		this.createTableData(this.finishTableData);
	}

	createTableData(callback) {
		fetch('/score')
			.then((scoresJSON) => scoresJSON.json())
			.then((scores) => callback(scores))
			.then((scoresHTML) => {
				this.setState(() => ({ data: scoresHTML }));
			});
	}

	finishTableData(scores) {
		scores.sort((a, b) => b.score - a.score);
		let jsxExpressions = [];
		for (let i = 0; i < (scores.length > 20 ? 20 : scores.length - 1); i++) {
			jsxExpressions.push(
				<tr key={i}>
					<td>{scores[i].user}</td>
					<td>{scores[i].score}</td>
				</tr>
			);
		}

		return jsxExpressions;
	}

	render() {
		return (
			<div className="scoreboard-container">
				<div className="scoreboard">
					<table>
						<thead>
							<tr>
								<td colSpan={2}>Scoreboard</td>
							</tr>
						</thead>
						<tbody>{this.state.data}</tbody>
					</table>
				</div>
			</div>
		);
	}
}

class GameScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			score: 0,
			selectionArray: [],
			selectionsDup: [],
			readyButton: true,
			canPressButton: false,
			loginModal: false,
			error: ''
		};

		this.playerButtonPressed = this.playerButtonPressed.bind(this);
		this.addRandomColor = this.addRandomColor.bind(this);
		this.playSequence = this.playSequence.bind(this);
		this.createTriggers = this.createTriggers.bind(this);
		this.resetGame = this.resetGame.bind(this);
		this.saveScore = this.saveScore.bind(this);
	}

	componentDidMount() {
		this.createTriggers();
		this.resetGame();
	}

	//Resets the state for when the game is mounted.
	resetGame() {
		this.setState(() => ({
			score: 0,
			selectionArray: [],
			selectionsDup: [],
			readyButton: true,
			canPressButton: false,
			loginModal: false,
			error: ''
		}));
	}

	// Creates all triggers for buttons when the dom is loaded
	createTriggers() {
		const colors = Object.keys(this.props.beep);
		colors.forEach((color) => {
			const element = document.getElementById(`${color}-game-button`);

			//Makes the lightup effect happen by adding a class, and once the transition is finished removing it.
			element.addEventListener('transitionend', () => {
				//checks if the transition is starting or finishing
				if (element.classList.contains(`${color}-active`)) {
					element.classList.toggle(`${color}-active`);
				}
			});
		});
	}

	// Generate a random color and add it to selectionArray state
	addRandomColor() {
		// Generate an array based on all the colors of props.beep
		const colors = Object.keys(this.props.beep);

		// Generates a random number for the selection
		const selection = Math.floor(Math.random() * colors.length);

		// Makes the selection and stores it to a variable so it can be added to the state.
		const selections = this.state.selectionArray;
		selections.push(colors[selection]);
		this.setState(() => ({ selectionArray: selections }));
	}

	// Plays the sequence for the player to memorize and adds a color to selectionArray using this.addRandomColor()
	playSequence() {
		this.setState(() => ({ canPressButton: false }));

		this.addRandomColor();
		let selectionsDupTemp = [];
		this.state.selectionArray.forEach((item) => selectionsDupTemp.push(item));
		this.setState((prevState) => ({ selectionsDup: selectionsDupTemp, readyButton: false }));

		const sequence = this.state.selectionArray;
		this.pressButton(sequence[0]);

		let i = 1;
		const interval = setInterval(() => {
			if (i === sequence.length) {
				this.setState(() => ({ canPressButton: true }));
				return clearInterval(interval);
			}
			let color = sequence[i];
			this.pressButton(color);
			i++;
		}, 1000);
	}

	pressButton(color) {
		const element = document.getElementById(`${color}-game-button`);

		// Plays audio sound
		let audio = this.props.beep[color];
		audio.play();

		element.classList.toggle(`${color}-active`);
	}

	// Handles the logic for when a player presses a button
	playerButtonPressed(color) {
		this.setState(() => ({ canPressButton: false }));

		const selections = this.state.selectionsDup;
		if (!(color === selections[0])) {
			return this.setState(() => ({ loginModal: true }));
		}
		this.pressButton(color);
		selections.shift();

		if (selections.length === 0) {
			this.setState((prevState) => ({ readyButton: true, score: prevState.score + 1, canPressButton: false }));
		}
		else {
			setTimeout(() => {
				this.setState(() => ({
					canPressButton: true
				}));
			}, 275);
		}
	}

	saveScore(e) {
		e.preventDefault();
		fetch('/score', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({ user: document.getElementById('username').value, score: this.state.score })
		})
			.then((userReq) => userReq.json())
			.then((user) => {
				if (user._id) {
					this.props.goToTitle();
				}
				else {
					document.getElementById('username').value = '';
					switch (user.errors.user.kind) {
						case 'maxlength':
							this.setState(() => ({ error: 'Username must be shorter than 16 characters' }));
							break;
						case 'required':
							this.setState(() => ({ error: 'Username must be added' }));
					}
				}
			});
	}

	render() {
		return (
			<div className="game-screen">
				<div className="game-container">
					<div className="info">
						<h1 className="game-title">Simon</h1>
						<p>Score: {this.state.score}</p>
					</div>
					{this.state.canPressButton ? (
						<div className="game">
							<GameButton playerButtonPressed={this.playerButtonPressed} color="yellow" />
							<GameButton playerButtonPressed={this.playerButtonPressed} color="blue" />
							<GameButton playerButtonPressed={this.playerButtonPressed} color="red" />
							<GameButton playerButtonPressed={this.playerButtonPressed} color="green" />
						</div>
					) : (
						<div className="game no-button-presses">
							<GameButton playerButtonPressed={this.playerButtonPressed} color="yellow" />
							<GameButton playerButtonPressed={this.playerButtonPressed} color="blue" />
							<GameButton playerButtonPressed={this.playerButtonPressed} color="red" />
							<GameButton playerButtonPressed={this.playerButtonPressed} color="green" />
						</div>
					)}
					{this.state.readyButton ? (
						<div className="btn btn-ghost" onClick={() => this.playSequence()}>
							Ready!
						</div>
					) : (
						<div className="btn btn-ghost btn-disabled" onClick={this.addRandomColor}>
							Ready!
						</div>
					)}
				</div>
				{this.state.loginModal && (
					<LoginModal saveScore={this.saveScore} score={this.state.score} error={this.state.error} />
				)}
			</div>
		);
	}
}

const beepDirPath = 'audio/beep/';

GameScreen.defaultProps = {
	beep: {
		blue: new Audio(beepDirPath + 'blue.wav'),
		green: new Audio(beepDirPath + 'green.wav'),
		red: new Audio(beepDirPath + 'red.wav'),
		yellow: new Audio(beepDirPath + 'yellow.wav')
	}
};

const LoginModal = (props) => {
	return (
		<div className="modal login-modal">
			<form>
				<div>
					<h1 className="center">Game Over!</h1>
					<p className="center">Score: {props.score}</p>
					<label htmlFor="username">Name: </label>

					<input type="text" name="username" id="username" />
				</div>
				<p className="center">{props.error}</p>

				<button onClick={(e) => props.saveScore(e)}>Save</button>
			</form>
		</div>
	);
};

const GameButton = (props) => {
	return (
		<div
			className="game-btn"
			id={props.color + '-game-button'}
			onClick={() => props.playerButtonPressed(props.color)}
		/>
	);
};

ReactDOM.render(<SimonApp />, document.getElementById('app'));