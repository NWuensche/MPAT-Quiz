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
      timeStamps: [], // [Start1, End1, Start2,...] of Questions in ms
      lastStampIndex: -1 // e.g. 1 -> Between End1 and Start2
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
        timeStamps: [...prevState.timeStamps, question.start_tms * 1000, question.end_tms * 1000],
      }))
     ));
      // Start Timer
      setInterval(() => {
       this.setState(prevState => ({
         ...prevState,
         playbackTime: prevState.playbackTime + 1000, //in ms
       }));
      }, 1000);

      // TODO Noch vorher 1x ausführen, da erst bei 1 sec erstes mal ausgeführt?
      //Check if behind new time
      setInterval(() => {
          const lastStampIndex = this.state.lastStampIndex;
          const timeStamps = this.state.timeStamps;
          const positionVideo = this.state.playbackTime;
          const currStampIndex = getCurrTimeStamp(positionVideo, timeStamps);

          // When Stamp jumped to far, the viewer changed the time of the video
          // So reset possibly given answer and proceed
         if (lastStampIndex !== currStampIndex && lastStampIndex + 1 !== currStampIndex) {
                if (insideQuestion(currStampIndex)) { // Jumped into a question
                    const currQuestionIndex = Math.ceil(currStampIndex/2);
                    const currQuestion = this.props.questions[currQuestionIndex];
                    this.setState(prevState => ({
                      ...prevState,
                      selectedButton: 0, // Start at A again
                      enteredButton: -1, // Delete curr answer
                      timeEnterOver: false, // Unlock Buttons for new Question
                      correct: currQuestion.correct_answer,
                      currQuestion: currQuestionIndex,
                      lastStampIndex: currStampIndex,
                    }));
                }
                 else { // Not jumped into a question
                    const currQuestionIndex = Math.ceil(currStampIndex/2) - 1;
                    this.setState(prevState => ({
                      ...prevState,
                      enteredButton: -1, // Delete curr answer
                      timeEnterOver: true, // Can't enter a button anymore
                      currQuestion: currQuestionIndex,
                      lastStampIndex: currStampIndex,
                    }));
        }
         }
    else {
         if (lastStampIndex !== timeStamps.length - 1) {//Last Question isn't over
             if (positionVideo >= timeStamps[lastStampIndex + 1]){ // Next Question started or last ended
                 if (!insideQuestion(lastStampIndex)) { // Next Question started
                     const nextQuestionIndex = Math.floor(lastStampIndex/2) + 1;
                     const nextQuestion = this.props.questions[nextQuestionIndex];
                     this.setState(prevState => ({
                       ...prevState,
                       selectedButton: 0, // Start at A again
                       enteredButton: -1, // Unlock Buttons for new Question
                       timeEnterOver: false, // Unlock Buttons for new Question
                       correct: nextQuestion.correct_answer,
                       currQuestion: prevState.currQuestion + 1,
                       lastStampIndex: prevState.lastStampIndex + 1,
                     }));
                 }
                 else { // curr Question ended
                     const nextQuestionIndex = Math.floor(lastStampIndex/2) + 1;
                     const nextQuestion = this.props.questions[nextQuestionIndex];
                     this.setState(prevState => ({
                       ...prevState,
                       timeEnterOver: true, // Can't enter a button anymore
                       lastStampIndex: prevState.lastStampIndex + 1,
                     }));
                  if (this.state.correct == this.state.enteredButton) { // Right Button was entered
                    this.setState({score: this.state.score + 1});
                  }
                 }
           }
         }
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

componentLoader.registerComponent('quiz', {view: QuizContent}, {
  isStylable: true
});

