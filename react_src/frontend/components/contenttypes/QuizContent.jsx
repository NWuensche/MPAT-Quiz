/**
 *
 * Copyright (c) 2017 MPAT Consortium , All rights reserved.
 * Fraunhofer FOKUS, Fincons Group, Telecom ParisTech, IRT, Lancaster University, Leadin, RBB, Mediaset
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * AUTHORS:
 * Carolin Stolpe
 * Niklas Wünsche
 * Felix Bammel
 *
 **/

import React from 'react';
import {createHandler, handlersWithTag} from '../../utils';
import {registerHandlers, unregisterHandlers} from '../../RemoteBinding';
import {componentLoader} from '../../../ComponentLoader';


class QuizContent extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedButton: 0,
      enteredButton: -1, // -1 = nothing entered, i = Button i selected
      enteredBeforeGuest: false, // extra points when doing so
      timeEnterOver: false,
      score: 0,
      correct: -1,
      currQuestion: -1,
      playbackTime: 0,
      timeStamps: [], // [Start1, Guest1, End1, Start2,...] of Questions in s
      lastStampIndex: -1, // e.g. 1 -> Between Guest1 and End1
    };
  }

  componentDidMount() {
    // Register Key Handlers
    registerHandlers(this, handlersWithTag('active', [
      createHandler(KeyEvent.VK_UP, this.up.bind(this)),
      createHandler(KeyEvent.VK_RIGHT, this.up.bind(this)),
      createHandler(KeyEvent.VK_LEFT, this.down.bind(this)),
      // Add shortcuts to answer questions fast
      createHandler(KeyEvent.VK_1, this.shortcutEnter.bind(this, 0)),
      createHandler(KeyEvent.VK_2, this.shortcutEnter.bind(this, 1)),
      createHandler(KeyEvent.VK_3, this.shortcutEnter.bind(this, 2)),
      createHandler(KeyEvent.VK_4, this.shortcutEnter.bind(this, 3)),
      createHandler(KeyEvent.VK_DOWN, this.down.bind(this)),
      createHandler(KeyEvent.VK_ENTER, this.enter.bind(this))
    ]));

    const questions = this.props.questions;
    questions.map(question => (
      this.setState(prevState => ({
        ...prevState,
        timeStamps: [...prevState.timeStamps, question.start_tms, question.guest_tms, question.end_tms],
      }))
    ));
    // Start Timer for Video
    setInterval(() => {
      this.setState(prevState => ({
        ...prevState,
        playbackTime: prevState.playbackTime + 1,
      }));
    }, 1000);

    //Check if jump inside video or input was given
    handleTimesAndInputs.call(this);
    setInterval(handleTimesAndInputs.bind(this), 1000);
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
    if (answeredBeforeGuests(this.state.lastStampIndex)) {
      this.setState(prevState => ({
        ...prevState,
        enteredBeforeGuest: true,
      }));
    }
    this.setState(prevState => ({
      ...prevState,
      enteredButton: prevState.selectedButton,
    }));
  }

  // For example first answer shortcut -> entered = 0
  shortcutEnter(entered) {
    // Not allowed to enter button when time's up or before 1st question
    if (this.state.timeEnterOver || this.state.currQuestion === -1) {
      return;
    }

    //Don't shortcut enter answer if the quiz doesn't have so many choices
    const numAnswers = this.props.answers.length;
    if (numAnswers < entered + 1) {
      return;
    }

    if (answeredBeforeGuests(this.state.lastStampIndex)) {
      this.setState(prevState => ({
        ...prevState,
        enteredBeforeGuest: true,
      }));
    }
    this.setState(prevState => ({
      ...prevState,
      enteredButton: entered
    }));
  }

  render() {
    const answers = this.props.answers;
    return (
      <div style={{position: 'relative'}}>
        <div className="quiz-score">
          <p>Frage {this.state.currQuestion + 1 }</p>
          <p style={{align: 'right'}}>Score: {this.state.score}</p>
          <p>Time: {this.state.playbackTime}</p>
        </div>
        <div>
          {answers.map((answer, i) => (
            <QuizButton
              item={answer}
              isSelected={i === this.state.selectedButton}
              isEntered={i === this.state.enteredButton}
              dontSelect={this.state.timeEnterOver || this.state.enteredButton !== -1 || this.state.currQuestion === -1} // Time's up or a button already entered or before first question
              updateScore={this.updateScore}
              isRight={i == this.state.correct && this.state.timeEnterOver}
              enteredWrong={i != this.state.correct && this.state.timeEnterOver && i === this.state.enteredButton }
              odd={ i !== 0 && i % 2 !== 0 }
            />
          ))
          }
        </div>
      </div>
    );
  }
}

// When you watch the video in a linear fashion, two things can happen with the indices from the last second and the current second
// Case 1: Indices are the same; Case 2: currIndex is one bigger than lastIndex because new Question started/ended
// If none of these cases applies, the viewer jumped inside the video
function jumpedInVideo(lastIndex, currIndex) {
  return ((lastIndex !== currIndex) && (lastIndex + 1 !== currIndex))
}

function answeredBeforeGuests(lastStampIndex) {
  if (newMod(lastStampIndex, 3) === 0) {
    return true;
  }
  return false;
}

function QuizButton({item, isSelected = false, isEntered = false, dontSelect = false, isRight = false, enteredWrong = false, odd = false}) {
  let css = {
    border: '2px #fff solid'
  }
  if (isRight) {
    css.border = '2px #0f0 solid';
  } else if (enteredWrong) {
    css.border = '2px #f00 solid';
  } else if (isEntered) {
    css.border = '2px #ffa500 solid';
  } else if (dontSelect) {
    css.border = '2px #ddd solid';
  } else if (isSelected) {
    css.border = '2px #00f solid';
  } else {
    css.border = '2px #fff solid';
  }

  return (
    <button className="quiz-button" style={css}>{item.label}</button>
  );
}

// Fix that -1 % 4 == -1 , newMod(-1,4) == 3
function newMod(m, n) {
  return ((m % n) + n) % n;
}

// Returns true if given stamp is between start and end time stamp of a question
// which is equivalent to index of stamp is odd
function insideQuestion(stampIndex) {
  if (newMod(stampIndex, 3) === 0 || newMod(stampIndex, 3) === 1) {
    return true;
  }
  return false;
}

// Return the last timeStamp which the current time passed. Could change when playing a video.
function getCurrTimeStamp(currTime, timeStamps) {
  var i;
  for (i = 0; i < timeStamps.length; i++) {
    if (timeStamps[i] > currTime) {
      break;
    }
  }
  return i - 1; // Decrease stamp because first stamp is 0, not 1
}

// When viewer jumped in video, free all buttons
function freeButtons(prevState) {
  const newState = {
    ...prevState,
    enteredButton: -1,
  };
  return newState;

}
// Change the state when a new question started or I jumped into another question
function setStateEnteredQuestion(lastStampIndex, currStampIndex, prevState, questions) {
  const currQuestionIndex = Math.floor(currStampIndex / 3);
  const currQuestion = questions[currQuestionIndex];
  if (newMod(currStampIndex, 3) === 1 && !jumpedInVideo(lastStampIndex, currStampIndex)) {
    return prevState;
  } // Don't need to change State if we're switched from before guests to after guests
  const newState = {
    ...prevState,
    selectedButton: 0, // Start at A again
    enteredButton: -1, // Delete current answer
    enteredBeforeGuest: false, // Hasn't entered yet
    timeEnterOver: false, // Unlock Buttons for new Question
    correct: currQuestion.correct_answer,
    currQuestion: currQuestionIndex,
  };
  return newState;
}

// Question was left since we lasted changed
function setStateLeftQuestion(currStampIndex, prevState, questions) {
  const currQuestionIndex = Math.floor(currStampIndex / 3);
  const newState = {
    ...prevState,
    enteredBeforeGuest: false,
    timeEnterOver: true, // Can't enter a button anymore
    currQuestion: currQuestionIndex, // Could change when jumping
  };
  return newState;
}

function handleTimesAndInputs() {
  const lastStampIndex = this.state.lastStampIndex;
  const timeStamps = this.state.timeStamps;
  const positionVideo = this.state.playbackTime;
  const currStampIndex = getCurrTimeStamp(positionVideo, timeStamps);
  const questions = this.props.questions;

  if (currStampIndex !== lastStampIndex) {
    // When Stamp jumped to far, then the viewer changed the time of the video
    // So reset possibly given answer and proceed
    if (jumpedInVideo(lastStampIndex, currStampIndex)) {
      const newState = freeButtons(this.state);
      this.setState(newState);
    }

    if (insideQuestion(currStampIndex)) {
      const newState = setStateEnteredQuestion(lastStampIndex, currStampIndex, this.state, questions);
      this.setState(newState);
    }
    else { // Left Question
      // First Check if answer is right
      if (this.state.correct == this.state.enteredButton && this.state.correct !== -1) { // Right Button was entered and we are not in build up state
        if (this.state.enteredBeforeGuest) {
          this.setState({score: this.state.score + 2}); // Extra points for answering before guests
        }
        else {
          this.setState({score: this.state.score + 1});
        }
      }

      const newState = setStateLeftQuestion(currStampIndex, this.state, questions);
      this.setState(newState);
    }

    this.setState(prevState => ({
      ...prevState,
      lastStampIndex: currStampIndex,
    }));
  }
}

componentLoader.registerComponent('quiz', {view: QuizContent}, {
  isStylable: true
});

