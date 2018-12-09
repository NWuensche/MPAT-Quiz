import React from 'react';
import autobind from 'class-autobind';

import {createHandler, handlersWithTag} from '../../utils';
import {registerHandlers, unregisterHandlers} from '../../RemoteBinding';
import {trackAction} from '../../analytics';
import {componentLoader} from '../../../ComponentLoader';


class QuizContent extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedButton: 0,
      enteredButton: -1, // -1 = nothing entered, i = Button i selected
      timeEnterOver: false,
      score: 0,
      correct: -1,
      currQuestion: -1,
    };
  }

  componentDidMount() {
    // Register Key Handlers
    registerHandlers(this, handlersWithTag('active', [
      createHandler(KeyEvent.VK_UP, this.up.bind(this)),
      createHandler(KeyEvent.VK_DOWN, this.down.bind(this)),
      createHandler(KeyEvent.VK_ENTER, this.enter.bind(this))
    ]));

    const questions = this.props.questions;
    // New Question Starts
    questions.map((question, i) => (
      setTimeout(() => {
        this.setState(prevState => ({
          ...prevState,
          selectedButton: 0, // Start at A again
          enteredButton: -1, // Unlock Buttons for new Question
          timeEnterOver: false, // Unlock Buttons for new Question
          correct: question.correct_answer,
          currQuestion: this.state.currQuestion + 1,
        }));
      }, question.start_tms * 1000)
    ));
    // Question Over
    questions.map((question, i) => (
      setTimeout(() => {
        this.setState(prevState => ({
          ...prevState,
          timeEnterOver: true, // Can't enter a button anymore
        }));
		if (this.state.correct == this.state.enteredButton) {
			this.setState({score: this.state.score + 1});
		}
      }, question.end_tms * 1000)
    ));
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }
/*  
  updateScore() {
    let {score} = this.state;
    if (this.state.correct === this.state.enteredButton) {
      ++score;
    }
    this.setState({score});
  }
  

  updateScore() {
	if (this.state.correct == this.state.enteredButton) {
      this.setState({score: this.state.score + 1});
    }
  }
  
  */
  
  // Fix that -1 % 4 == -1 , newMod(-1,4) == 3
  newMod(m, n) {
    return ((m % n) + n) % n;
  }

  up() {
    // Not allowed to change Button anymore after entering an answer, time's up or before 1st question
    if (this.state.enteredButton !== -1 || this.state.timeEnterOver || this.state.currQuestion === -1) {
        return;
    }

    const numAnswers = this.props.answers.length;
    this.setState(prevState => ({
      ...prevState,
      selectedButton: this.newMod((prevState.selectedButton - 1), numAnswers)
    }));
  }

  down() {
    // Not allowed to change Button anymore after entering an answer, time's up or before 1st question
    if (this.state.enteredButton !== -1 || this.state.timeEnterOver || this.state.currQuestion === -1) {
        return;
    }

    const numAnswers = this.props.answers.length;
    this.setState(prevState => ({
      ...prevState,
      selectedButton: this.newMod((prevState.selectedButton + 1), numAnswers)
    }));
  }

  enter() {
    // Not allowed to enter button when time's up or before 1st question
    if (this.state.timeEnterOver || this.state.currQuestion === -1) {
        return;
    }
    this.setState(prevState => ({
      ...prevState,
      enteredButton: prevState.selectedButton
    }));
  }

  checkAnswer() {

  }

  render() {
    const answers = this.props.answers;
    return (
      <div>
        {/* <QuizScoreContent*/}
        {/* checkAnswer={this.checkAnswer}*/}
        {/* />*/}
        Score: {this.state.score}
        <div>
          {answers.map((answer, i) => (
            <QuizButton
              item={answer}
              isSelected={i === this.state.selectedButton}
              isEntered={i === this.state.enteredButton}
              dontSelect={this.state.timeEnterOver || this.state.enteredButton !== -1 || this.state.currQuestion === -1} // Time's up or a button already entered or before first question
              updateScore={this.updateScore}
            />
          ))}
          entered: {this.state.enteredButton}
		  correct: {this.state.correct}
		  <p>Hello</p>
            { 
                <OverText
                    lastQuestionOver = {this.props.questions.length === this.state.currQuestion +1 && this.state.timeEnterOver}
                />
            } 
        </div>
      </div>
    );
  }
}

// Show hint that quiz is over when last question is over and time to Enter is also over
function OverText({lastQuestionOver}) {
    let text = "";
    if (lastQuestionOver) {
        text = "Quiz is Over!"
    }
    return( <div>
                {text}
            </div>
    );
}

function QuizButton({item, isSelected = false, isEntered = false, dontSelect = false}) {
  let css;
  if (isEntered) {
    css = {border: '2px #ffa500 solid', margin: '10px', padding: '10x'};
  } else if (dontSelect) {
    css = {border: '2px #000 solid', margin: '10px', padding: '10x'};
  } else if (isSelected) {
    css = {border: '2px #ff0 solid', margin: '10px', padding: '10x'};
  } else {
    css = {border: '2px #ddd solid', margin: '10px', padding: '10x'};
  }
  return (
    <div style={css}>
      <button>{item.label}</button>
    </div>
  );
}

class QuizScoreContent extends React.Component {
  constructor() {
    super();
    this.state = {
      score: 0
    };
  }

  render() {
    return (
      <div>Score: {this.state.score}</div>
    );
  }
}

componentLoader.registerComponent('quiz', {view: QuizContent}, {
  isStylable: true
});

