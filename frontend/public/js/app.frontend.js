'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SimonApp = function (_React$Component) {
	_inherits(SimonApp, _React$Component);

	function SimonApp(props) {
		_classCallCheck(this, SimonApp);

		var _this = _possibleConstructorReturn(this, (SimonApp.__proto__ || Object.getPrototypeOf(SimonApp)).call(this, props));

		_this.state = {
			currentPage: 'title'
		};

		_this.goToGame = _this.goToGame.bind(_this);
		_this.goToTitle = _this.goToTitle.bind(_this);
		return _this;
	}

	_createClass(SimonApp, [{
		key: 'goToGame',
		value: function goToGame() {
			this.setState(function () {
				return { currentPage: 'game' };
			});
		}
	}, {
		key: 'goToTitle',
		value: function goToTitle() {
			this.setState(function () {
				return { currentPage: 'title' };
			});
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				null,
				this.state.currentPage === 'title' && React.createElement(TitleScreen, { goToGame: this.goToGame }),
				this.state.currentPage === 'game' && React.createElement(GameScreen, { goToTitle: this.goToTitle })
			);
		}
	}]);

	return SimonApp;
}(React.Component);

var TitleScreen = function (_React$Component2) {
	_inherits(TitleScreen, _React$Component2);

	function TitleScreen() {
		_classCallCheck(this, TitleScreen);

		return _possibleConstructorReturn(this, (TitleScreen.__proto__ || Object.getPrototypeOf(TitleScreen)).apply(this, arguments));
	}

	_createClass(TitleScreen, [{
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ className: 'title-screen' },
				React.createElement(
					'div',
					{ className: 'play' },
					React.createElement(
						'h1',
						{ className: 'game-title' },
						'Simon'
					),
					React.createElement(
						'div',
						{ className: 'btn btn-green btn-play', onClick: this.props.goToGame },
						'Play Now'
					)
				),
				React.createElement(ScoreBoard, null)
			);
		}
	}]);

	return TitleScreen;
}(React.Component);

var ScoreBoard = function (_React$Component3) {
	_inherits(ScoreBoard, _React$Component3);

	function ScoreBoard(props) {
		_classCallCheck(this, ScoreBoard);

		var _this3 = _possibleConstructorReturn(this, (ScoreBoard.__proto__ || Object.getPrototypeOf(ScoreBoard)).call(this, props));

		_this3.state = { data: [] };

		_this3.createTableData = _this3.createTableData.bind(_this3);
		return _this3;
	}

	_createClass(ScoreBoard, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.createTableData(this.finishTableData);
		}
	}, {
		key: 'createTableData',
		value: function createTableData(callback) {
			var _this4 = this;

			fetch('/score').then(function (scoresJSON) {
				return scoresJSON.json();
			}).then(function (scores) {
				return callback(scores);
			}).then(function (scoresHTML) {
				_this4.setState(function () {
					return { data: scoresHTML };
				});
			});
		}
	}, {
		key: 'finishTableData',
		value: function finishTableData(scores) {
			scores.sort(function (a, b) {
				return b.score - a.score;
			});
			var jsxExpressions = [];
			for (var i = 0; i < (scores.length > 20 ? 20 : scores.length - 1); i++) {
				jsxExpressions.push(React.createElement(
					'tr',
					{ key: i },
					React.createElement(
						'td',
						null,
						scores[i].user
					),
					React.createElement(
						'td',
						null,
						scores[i].score
					)
				));
			}

			return jsxExpressions;
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ className: 'scoreboard-container' },
				React.createElement(
					'div',
					{ className: 'scoreboard' },
					React.createElement(
						'table',
						null,
						React.createElement(
							'thead',
							null,
							React.createElement(
								'tr',
								null,
								React.createElement(
									'td',
									{ colSpan: 2 },
									'Scoreboard'
								)
							)
						),
						React.createElement(
							'tbody',
							null,
							this.state.data
						)
					)
				)
			);
		}
	}]);

	return ScoreBoard;
}(React.Component);

var GameScreen = function (_React$Component4) {
	_inherits(GameScreen, _React$Component4);

	function GameScreen(props) {
		_classCallCheck(this, GameScreen);

		var _this5 = _possibleConstructorReturn(this, (GameScreen.__proto__ || Object.getPrototypeOf(GameScreen)).call(this, props));

		_this5.state = {
			score: 0,
			selectionArray: [],
			selectionsDup: [],
			readyButton: true,
			canPressButton: false,
			loginModal: false,
			error: ''
		};

		_this5.playerButtonPressed = _this5.playerButtonPressed.bind(_this5);
		_this5.addRandomColor = _this5.addRandomColor.bind(_this5);
		_this5.playSequence = _this5.playSequence.bind(_this5);
		_this5.createTriggers = _this5.createTriggers.bind(_this5);
		_this5.resetGame = _this5.resetGame.bind(_this5);
		_this5.saveScore = _this5.saveScore.bind(_this5);
		return _this5;
	}

	_createClass(GameScreen, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.createTriggers();
			this.resetGame();
		}

		//Resets the state for when the game is mounted.

	}, {
		key: 'resetGame',
		value: function resetGame() {
			this.setState(function () {
				return {
					score: 0,
					selectionArray: [],
					selectionsDup: [],
					readyButton: true,
					canPressButton: false,
					loginModal: false,
					error: ''
				};
			});
		}

		// Creates all triggers for buttons when the dom is loaded

	}, {
		key: 'createTriggers',
		value: function createTriggers() {
			var colors = Object.keys(this.props.beep);
			colors.forEach(function (color) {
				var element = document.getElementById(color + '-game-button');

				//Makes the lightup effect happen by adding a class, and once the transition is finished removing it.
				element.addEventListener('transitionend', function () {
					//checks if the transition is starting or finishing
					if (element.classList.contains(color + '-active')) {
						element.classList.toggle(color + '-active');
					}
				});
			});
		}

		// Generate a random color and add it to selectionArray state

	}, {
		key: 'addRandomColor',
		value: function addRandomColor() {
			// Generate an array based on all the colors of props.beep
			var colors = Object.keys(this.props.beep);

			// Generates a random number for the selection
			var selection = Math.floor(Math.random() * colors.length);

			// Makes the selection and stores it to a variable so it can be added to the state.
			var selections = this.state.selectionArray;
			selections.push(colors[selection]);
			this.setState(function () {
				return { selectionArray: selections };
			});
		}

		// Plays the sequence for the player to memorize and adds a color to selectionArray using this.addRandomColor()

	}, {
		key: 'playSequence',
		value: function playSequence() {
			var _this6 = this;

			this.setState(function () {
				return { canPressButton: false };
			});

			this.addRandomColor();
			var selectionsDupTemp = [];
			this.state.selectionArray.forEach(function (item) {
				return selectionsDupTemp.push(item);
			});
			this.setState(function (prevState) {
				return { selectionsDup: selectionsDupTemp, readyButton: false };
			});

			var sequence = this.state.selectionArray;
			this.pressButton(sequence[0]);

			var i = 1;
			var interval = setInterval(function () {
				if (i === sequence.length) {
					_this6.setState(function () {
						return { canPressButton: true };
					});
					return clearInterval(interval);
				}
				var color = sequence[i];
				_this6.pressButton(color);
				i++;
			}, 1000);
		}
	}, {
		key: 'pressButton',
		value: function pressButton(color) {
			var element = document.getElementById(color + '-game-button');

			// Plays audio sound
			var audio = this.props.beep[color];
			audio.play();

			element.classList.toggle(color + '-active');
		}

		// Handles the logic for when a player presses a button

	}, {
		key: 'playerButtonPressed',
		value: function playerButtonPressed(color) {
			var _this7 = this;

			this.setState(function () {
				return { canPressButton: false };
			});

			var selections = this.state.selectionsDup;
			if (!(color === selections[0])) {
				return this.setState(function () {
					return { loginModal: true };
				});
			}
			this.pressButton(color);
			selections.shift();

			if (selections.length === 0) {
				this.setState(function (prevState) {
					return { readyButton: true, score: prevState.score + 1, canPressButton: false };
				});
			} else {
				setTimeout(function () {
					_this7.setState(function () {
						return {
							canPressButton: true
						};
					});
				}, 275);
			}
		}
	}, {
		key: 'saveScore',
		value: function saveScore(e) {
			var _this8 = this;

			e.preventDefault();
			fetch('/score', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify({ user: document.getElementById('username').value, score: this.state.score })
			}).then(function (userReq) {
				return userReq.json();
			}).then(function (user) {
				if (user._id) {
					_this8.props.goToTitle();
				} else {
					document.getElementById('username').value = '';
					switch (user.errors.user.kind) {
						case 'maxlength':
							_this8.setState(function () {
								return { error: 'Username must be shorter than 16 characters' };
							});
							break;
						case 'required':
							_this8.setState(function () {
								return { error: 'Username must be added' };
							});
					}
				}
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _this9 = this;

			return React.createElement(
				'div',
				{ className: 'game-screen' },
				React.createElement(
					'div',
					{ className: 'game-container' },
					React.createElement(
						'div',
						{ className: 'info' },
						React.createElement(
							'h1',
							{ className: 'game-title' },
							'Simon'
						),
						React.createElement(
							'p',
							null,
							'Score: ',
							this.state.score
						)
					),
					this.state.canPressButton ? React.createElement(
						'div',
						{ className: 'game' },
						React.createElement(GameButton, { playerButtonPressed: this.playerButtonPressed, color: 'yellow' }),
						React.createElement(GameButton, { playerButtonPressed: this.playerButtonPressed, color: 'blue' }),
						React.createElement(GameButton, { playerButtonPressed: this.playerButtonPressed, color: 'red' }),
						React.createElement(GameButton, { playerButtonPressed: this.playerButtonPressed, color: 'green' })
					) : React.createElement(
						'div',
						{ className: 'game no-button-presses' },
						React.createElement(GameButton, { playerButtonPressed: this.playerButtonPressed, color: 'yellow' }),
						React.createElement(GameButton, { playerButtonPressed: this.playerButtonPressed, color: 'blue' }),
						React.createElement(GameButton, { playerButtonPressed: this.playerButtonPressed, color: 'red' }),
						React.createElement(GameButton, { playerButtonPressed: this.playerButtonPressed, color: 'green' })
					),
					this.state.readyButton ? React.createElement(
						'div',
						{ className: 'btn btn-ghost', onClick: function onClick() {
								return _this9.playSequence();
							} },
						'Ready!'
					) : React.createElement(
						'div',
						{ className: 'btn btn-ghost btn-disabled', onClick: this.addRandomColor },
						'Ready!'
					)
				),
				this.state.loginModal && React.createElement(LoginModal, { saveScore: this.saveScore, score: this.state.score, error: this.state.error })
			);
		}
	}]);

	return GameScreen;
}(React.Component);

var beepDirPath = 'audio/beep/';

GameScreen.defaultProps = {
	beep: {
		blue: new Audio(beepDirPath + 'blue.wav'),
		green: new Audio(beepDirPath + 'green.wav'),
		red: new Audio(beepDirPath + 'red.wav'),
		yellow: new Audio(beepDirPath + 'yellow.wav')
	}
};

var LoginModal = function LoginModal(props) {
	return React.createElement(
		'div',
		{ className: 'modal login-modal' },
		React.createElement(
			'form',
			null,
			React.createElement(
				'div',
				null,
				React.createElement(
					'h1',
					{ className: 'center' },
					'Game Over!'
				),
				React.createElement(
					'p',
					{ className: 'center' },
					'Score: ',
					props.score
				),
				React.createElement(
					'label',
					{ htmlFor: 'username' },
					'Name: '
				),
				React.createElement('input', { type: 'text', name: 'username', id: 'username' })
			),
			React.createElement(
				'p',
				{ className: 'center' },
				props.error
			),
			React.createElement(
				'button',
				{ onClick: function onClick(e) {
						return props.saveScore(e);
					} },
				'Save'
			)
		)
	);
};

var GameButton = function GameButton(props) {
	return React.createElement('div', {
		className: 'game-btn',
		id: props.color + '-game-button',
		onClick: function onClick() {
			return props.playerButtonPressed(props.color);
		}
	});
};

ReactDOM.render(React.createElement(SimonApp, null), document.getElementById('app'));
