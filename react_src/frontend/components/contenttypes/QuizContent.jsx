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
      playbackTime: 0,
      timeStamps: [], // [Start1, End1, Start2,...] of Questions in s
      lastStampIndex: -1, // e.g. 1 -> Between End1 and Start2
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

     questions.map(question => (
      this.setState(prevState => ({
        ...prevState,
        timeStamps: [...prevState.timeStamps, question.start_tms, question.end_tms],
      }))
     ));
      // Start Timer
      setInterval(() => {
        this.setState(prevState => ({
            ...prevState,
            playbackTime: prevState.playbackTime + 1,
         }));
      }, 1000);

      // TODO Noch vorher 1x ausführen, da erst bei 1 sec erstes mal ausgeführt?
      //Check if behind new time
      setInterval(() => {
          const lastStampIndex = this.state.lastStampIndex;
          const timeStamps = this.state.timeStamps;
          const positionVideo = this.state.playbackTime;
          const currStampIndex = getCurrTimeStamp(positionVideo, timeStamps);
          const questions = this.props.questions;

         if (currStampIndex !== lastStampIndex) {
              // When Stamp jumped to far, then the viewer changed the time of the video
              // So reset possibly given answer and proceed
             if (jumpedInsideVideo(lastStampIndex, currStampIndex)) {
                 const newState = freeButtons(this.state);
                 this.setState(newState);
             }

                  if(insideQuestion(currStampIndex)) {
                    const newState = setStateEnteredQuestion(currStampIndex, this.state, questions);
                    this.setState(newState);
                  }
             else { // Left Question
                 // First Check if answer is right
                  if (this.state.correct == this.state.enteredButton && this.state.correct !== -1) { // Right Button was entered and we are not in build up state
                    this.setState({score: this.state.score + 1});
                  }

                    const newState = setStateLeftQuestion(currStampIndex, this.state, questions);
                    this.setState(newState);
             }

                  this.setState(prevState => ({
                       ...prevState,
                      lastStampIndex: currStampIndex,
                  }));
         }
      }, 1000);

  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }



  up() {
    // Not allowed to change Button anymore after entering an answer, time's up or before 1st question
    if (this.state.enteredButton !== -1 || this.state.timeEnterOver || this.state.currQuestion === -1) {
      return;
    }

    const numAnswers = this.props.answers.length;
    this.setState(prevState => ({
      ...prevState,
      selectedButton: newMod((prevState.selectedButton - 1), numAnswers)
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
      selectedButton: newMod((prevState.selectedButton + 1), numAnswers)
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
        <p style={{
          fontSize: 'large',
          backgroundColor: '#090928',
          color: 'white'
        }}>
          Frage {this.state.currQuestion +1 }
        </p>
        <div style={{
          textAlign: 'right',
          fontSize: 'large',
          backgroundColor: '#090928',
          color: 'white'
        }}>
          Score: {this.state.score}</div>
          Time: {this.state.playbackTime}
        <div>
          {answers.map((answer, i) => (
            <QuizButton
              item={answer}
              isSelected={i === this.state.selectedButton}
              isEntered={i === this.state.enteredButton}
              dontSelect={this.state.timeEnterOver || this.state.enteredButton !== -1 || this.state.currQuestion === -1} // Time's up or a button already entered or before first question
              updateScore={this.updateScore}
            />
          ))
          }
          {/*entered: {this.state.enteredButton}*/
          }
          {/*correct: {this.state.correct}*/
          }
          {/*{*/}
            {/*<OverText*/}
              {/*lastQuestionOver={this.props.questions.length === this.state.currQuestion + 1 && this.state.timeEnterOver}*/}
            {/*/>*/}
          {/*}*/}
        </div>
      </div>
    );
  }
}

// When you watch the video in a linear fashion, two things can happen with the Indices from the last second and the current second
// Case 1: Indices are the same; Case 2: currIndex is one bigger than lastIndex because new Question started/ended
// If none of these cases applies, the viewer jumped inside the video
function jumpedInsideVideo(lastIndex, currIndex) {
    return ((lastIndex !== currIndex) && (lastIndex + 1 !== currIndex))
}

// Show hint that quiz is over when last question is over and time to Enter is also over
function OverText({lastQuestionOver}) {
  let text = "";
  if (lastQuestionOver) {
    text = "Quiz is Over!"
  }
  return ( <div>{text}</div>);
}

function QuizButton({item, isSelected = false, isEntered = false, dontSelect = false}) {
  let css = {
    fontSize: 'large',
    color: 'white',
    marginTop: '8px',
    border: '2px #ddd solid',
    width: '100%'
  }
  if (isEntered) {
    css.border = '2px #ffa500 solid';
  } else if (dontSelect) {
    css.border = '2px #000 solid';
  } else if (isSelected) {
    css.border = '2px #00f solid';
  } else {
    css.border = '2px #ddd solid';
  }
  return (
    <div>
      <button className="quiz-button" style={css}>{item.label}</button>
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

// Fix that -1 % 4 == -1 , newMod(-1,4) == 3
function newMod(m, n) {
    return ((m % n) + n) % n;
}

// returns true if given stamp is between start and end time stamp of a question
// which is equivalent to index of stamp is odd
function insideQuestion(stampIndex) {
    if (newMod(stampIndex, 2) === 0) {
        return true;
    }
    return false;
}
  // return the last timeStamp which the current time passed. Could change when playing a video.
function getCurrTimeStamp(currTime, timeStamps) {
    var i;
    for (i = 0; i < timeStamps.length; i++) {
        if (timeStamps[i] > currTime) {
            break;
        }
    }
    return i - 1; // decrease because first stamp is 0, not 1
}

// When viewer jumped in video, free all buttons
function freeButtons(prevState) {
    const newState = {
                      ...prevState,
                      enteredButton: -1,
                    };
    return newState;
 
}
//change the state when a new question started or I jumped into another question
function setStateEnteredQuestion(currStampIndex, prevState, questions) {
                   const currQuestionIndex = Math.ceil(currStampIndex/2);
                    const currQuestion = questions[currQuestionIndex];
                  const newState = {
                      ...prevState,
                      selectedButton: 0, // Start at A again
                      enteredButton: -1, // Delete curr answer
                      timeEnterOver: false, // Unlock Buttons for new Question
                      correct: currQuestion.correct_answer,
                      currQuestion: currQuestionIndex,
                    };
                 return newState;
}

function setStateLeftQuestion(currStampIndex, prevState, questions) {
                    const currQuestionIndex = Math.ceil(currStampIndex/2) - 1;
                    const newState = {
                      ...prevState,
                      timeEnterOver: true, // Can't enter a button anymore
                      currQuestion: currQuestionIndex, // Could change when jumping
                    };
    return newState;
}

componentLoader.registerComponent('quiz', {view: QuizContent}, {
  isStylable: true
});

