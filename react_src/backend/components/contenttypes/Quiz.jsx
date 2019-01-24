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
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 *
 **/
import React, {PropTypes as Types} from 'react';
import autobind from 'class-autobind';
import {componentLoader} from '../../../ComponentLoader';
import {noSubmitOnEnter} from '../../utils';
import {getTooltipped} from '../../tooltipper';
import Constants from '../../../constants';
import {generateId} from '../../../functions';


const i18n = Constants.locstr.quiz;

function edit(params) {
  const {id, data, changeAreaContent} = params;
  return (
    <Quiz
      id={id}
      {...(data === '' ? undefined : data)}
      changeAreaContent={changeAreaContent}
    />
  );
}

function preview() {
  const items = (content.data) ? content.data.questions : [];
  return (
    <div className="mpat-content-preview quizcontent-preview">
      <QuizOff />
    </div>
  );
}

function sharedProps() {
  return {
    // updateItem: this.updateItem,
    remoteKeys: [
      {key: '', label: 'Select Remote Button'},
      {key: 'VK_0', label: '0', disabled: false},
      {key: 'VK_1', label: '1', disabled: false},
      {key: 'VK_2', label: '2', disabled: false},
      {key: 'VK_3', label: '3', disabled: false},
      {key: 'VK_4', label: '4', disabled: false},
      {key: 'VK_5', label: '5', disabled: false},
      {key: 'VK_6', label: '6', disabled: false},
      {key: 'VK_7', label: '7', disabled: false},
      {key: 'VK_8', label: '8', disabled: false},
      {key: 'VK_9', label: '9', disabled: false},
      {key: 'VK_RED', label: 'red', disabled: false},
      {key: 'VK_YELLOW', label: 'yellow', disabled: false},
      {key: 'VK_GREEN', label: 'green', disabled: false},
      {key: 'VK_BLUE', label: 'blue', disabled: false},
      {key: 'VK_BACK', label: 'back', disabled: false},
      {key: 'VK_OK', label: 'ok', disabled: false}
    ]
  };
}

const answerType = Types.shape(
  {
    label: Types.string,
    id: Types.string
  });


function createDefaultAnswer() {
  return {
    label: '',
    id: generateId()
  };
}

const questionType = Types.shape(
  {
    start_tms: Types.string,
    guest_tms: Types.string,
    end_tms: Types.bool,
    start_error: Types.bool,
    guest_error: Types.bool,
    end_error: Types.bool,
    id: Types.string,
    label: Types.string,
    correct_answer: Types.string
  });

function createDefaultQuestion() {
  return {
    start_tms: null,
    guest_tms: null,
    end_tms: null,
    start_error: false,
    guest_error: false,
    end_error: false,
    label: '',
    id: generateId(),
    correct_answer: ''
  };
}

class Answer extends React.Component {

  static get defaultProps() {
    return {
      label: 'not defined'
    };
  }

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    return (
      <div className="answer" style={{display: 'table-cell'}}>
        Label<input
        type="text"
        value={this.props.label}
        onChange={e => this.props.changeAnswerLabel(this.props.id, 'label', e.target.value)}
      />
      </div>
    );
  }
}

class Question extends React.Component {

  static propTypes = {
    id: Types.string.isRequired,
    label: Types.string,
    correct_answer: Types.number,
    changeAreaContent: Types.func.isRequired
  };

  static defaultProps = {};


  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const options = [];

    for (let i = 0; i < this.props.answers.length; i++) {
      options.push(
        <option value={i}>{this.props.answers[i].label}</option>
      );
    }
    const selector = `select[name='${this.props.id}'] option[value='${this.props.correct_answer}']`;
    try {
      document.querySelector(selector).selected = true;
    } catch (e) {

    }

    return (
      <div>
        <div
          className="list-item"
          style={{
            border: '2px #ddd solid',
            background: '#eee',
            padding: '5px',
            margin: '5px',
            position: 'relative'
          }}
        >
          <table>
            <tr>
              <td>
                {i18n.title}
              </td>
              <td>
                <input
                  type="text"
                  value={this.props.label}
                  onChange={e => this.props.setContent(this.props.id, 'label', e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
                {i18n.start_tms}
              </td>
              <td>
                <input
                  type="number"
                  value={this.props.start_tms}
                  style={this.props.stampHasError(this.props.start_error)}
                  onChange={e => this.props.handleChangeTimeStamp(this.props.id, 'start', e)}
                /> {i18n.sec}
              </td>
            </tr>
            <tr>
              <td>
                {i18n.guest_tms}
              </td>
              <td>
                <input
                  type="number"
                  value={this.props.guest_tms}
                  style={this.props.stampHasError(this.props.guest_error)}
                  onChange={e => this.props.handleChangeTimeStamp(this.props.id, 'guest', e)}
                /> {i18n.sec}
              </td>
            </tr>
            <tr>
              <td>
                {i18n.end_tms}
              </td>
              <td>
                <input
                  type="number"
                  value={this.props.end_tms}
                  style={this.props.stampHasError(this.props.end_error)}
                  onChange={e => this.props.handleChangeTimeStamp(this.props.id, 'end', e)}
                /> {i18n.sec}
              </td>
            </tr>
            <tr>
              <td>
                {i18n.correct_answer}
              </td>
              <td>
                <select
                  id={this.props.id}
                  value={this.props.correct_answer}
                  onChange={e => this.props.setContent(this.props.id, 'correct_answer', e.target.value)}
                >
                  {options}
                </select>
              </td>
            </tr>
            <tr>
              <button
                type="button"
                onClick={() => this.props.deleteQuestion(this.props.id)}
                className="button white_blue img_left"
                style={{position: 'absolute', right: 10, bottom: 10}}
              >
                <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                  <path
                    d="M68.26,31.71h-35a1.78,1.78,0,0,0-1.78,1.94l3.78,44.48A1.78,1.78,0,0,0,37,79.76H64.49a1.78,1.78,0,0,0,1.78-1.63L70,33.65a1.78,1.78,0,0,0-1.78-1.94ZM62.85,76.19H38.64L35.17,35.28H66.32Z"
                  />
                  <path
                    d="M69.17,26.34H52.53V24.23a1.78,1.78,0,0,0-3.57,0v2.11H32.32a1.78,1.78,0,0,0,0,3.57H69.17a1.78,1.78,0,1,0,0-3.57Z"
                  />
                  <path
                    d="M41.31,72a1.78,1.78,0,0,0,1.78,1.63h.16a1.78,1.78,0,0,0,1.62-1.93L42.18,40.53a1.78,1.78,0,0,0-3.56.31Z"
                  />
                  <path
                    d="M58.24,73.67h.16A1.78,1.78,0,0,0,60.17,72l2.68-31.22a1.78,1.78,0,1,0-3.56-.31L56.62,71.74A1.78,1.78,0,0,0,58.24,73.67Z"
                  />
                  <path
                    d="M50.74,73.68a1.79,1.79,0,0,0,1.78-1.78V40.61a1.78,1.78,0,1,0-3.57,0V71.89A1.79,1.79,0,0,0,50.74,73.68Z"
                  />
                </svg>
                {i18n.delete_question}
              </button>
            </tr>
          </table>
        </div>
        {/* <div className="list-add-element">*/}
        {/* <span>*/}
        {/* <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">*/}
        {/* <path*/}
        {/* d="M50.49,22.85A28.25,28.25,0,1,0,78.74,51.1,28.29,28.29,0,0,0,50.49,22.85Zm0,52.94A24.69,24.69,0,1,1,75.17,51.1,24.71,24.71,0,0,1,50.49,75.79Z"*/}
        {/* />*/}
        {/* <path*/}
        {/* d="M64.47,49.31H52.27V37.12a1.78,1.78,0,1,0-3.57,0V49.31H36.51a1.78,1.78,0,0,0,0,3.57H48.7V65.08a1.78,1.78,0,0,0,3.57,0V52.88H64.47a1.78,1.78,0,0,0,0-3.57Z"*/}
        {/* />*/}
        {/* </svg>*/}
        {/* </span>*/}
        {/* </div>*/}
      </div>
    );
  }
}

class Quiz extends React.Component {

  static propTypes = {
    id: Types.string.isRequired,
    questions: Types.arrayOf(questionType),
    answers: Types.arrayOf(answerType),
    changeAreaContent: Types.func.isRequired
  };

  static defaultProps = {
    answers: [createDefaultAnswer()],
    questions: [createDefaultQuestion()]
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    this.props.changeAreaContent({
      questions: this.props.questions,
      answers: this.props.answers
    });
  }


  setContent(itemId, key, value) {
    let {questions} = this.props;
    const idx = questions.findIndex(({id}) => id === itemId);
    questions = questions.concat();
    questions[idx][key] = value;
    this.props.changeAreaContent({questions});
    console.log('hey')
  }

  addAnswer(e) {
    e.preventDefault();
    const {answers} = this.props;
    answers.push(createDefaultAnswer());
    this.props.changeAreaContent({answers});
  }


  deleteAnswer() {
    let {answers} = this.props;
    answers = answers.concat();
    this.checkIfAnswerWasUsedBefore(answers.length - 1, (alarm) => {
      answers.splice(-1, 1);
      this.props.changeAreaContent({answers});

      const {questions} = this.props;
      for (let i = 0; i < alarm.length; i++) {
        questions[alarm[i]].correct_answer = 0;
      }
      this.props.changeAreaContent({questions});
    });
  }


  checkIfAnswerWasUsedBefore(answer, callback) {
    let {questions} = this.props;
    questions = questions.concat();

    let {answers} = this.props;
    answers = answers.concat();

    const alarm = [];
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].correct_answer === answer.toString()) {
        alarm.push(i);
      }
    }
    if (alarm.length > 0) {
      const message = alarm.map(i => i + 1);
      alert(`Attention! You're about to delete an answer option that's already used in question(s) ${message.toString()}. Correct answer for this question will be set to ${answers[0].label} by default.`);
    }
    callback(alarm);
  }

  addQuestion(e) {
    e.preventDefault();
    const {questions} = this.props;
    questions.push(createDefaultQuestion());
    this.props.changeAreaContent({questions});
  }

  changeAnswerLabel(itemId, key, value) {
    let {answers} = this.props;
    const idx = answers.findIndex(({id}) => id === itemId);
    answers = answers.concat();
    answers[idx][key] = value;
    this.props.changeAreaContent({answers});
  }


  handleChangeTimeStamp(itemId, name, e) {
    const changedTime = parseInt(e.target.value);

    if (changedTime < 0) {
      return;
    }

    this.setContent(itemId, `${name}_tms`, changedTime);

    let {questions} = this.props;
    const idx = questions.findIndex(({id}) => id === itemId);
    questions = questions.concat();
    const currQuestion = questions[idx];

    // Look if still errors for times in the current question
    this.setContent(itemId, 'start_error', false);
    this.setContent(itemId, 'guest_error', false);
    this.setContent(itemId, 'end_error', false);


    // Case 1: Show error if one time stamp is smaller than a previous one in the same question
    this.lookForWrongOrderInsideQuestion(itemId, name, currQuestion, changedTime);

    // Case 2: Show error if one time stamp is smaller than any one in a previous question
    const prevQuestions = questions.slice(0, idx);
    this.lookForBiggerStampsInPrevQuestions(itemId, currQuestion, prevQuestions, changedTime);

    // Case 3: Show error if one time stamp is bigger than any one in a next question
    const nextQuestions = questions.slice(idx + 1);
    this.lookForSmallerStampsInNextQuestions(itemId, currQuestion, nextQuestions, changedTime);
  }

  getStampsCurrQuestion(name, changedTime, currQuestion) {
    let timeStart = currQuestion.start_tms;
    let timeGuest = currQuestion.guest_tms;
    let timeEnd = currQuestion.end_tms;

    switch (name) {
      case 'start':
        timeStart = changedTime;
        break;
      case 'guest':
        timeGuest = changedTime;
        break;
      case 'end':
        timeEnd = changedTime;
        break;
    }
    return {
      timeStart,
      timeGuest,
      timeEnd
    };
  }

  lookForWrongOrderInsideQuestion(itemId, name, currQuestion, changedTime) {
    const {timeStart, timeGuest, timeEnd} = this.getStampsCurrQuestion(name, changedTime, currQuestion);

    if (timeGuest != null && timeStart >= timeGuest) {
      this.setContent(itemId, 'start_error', true);
    } else if (timeEnd != null && timeStart >= timeEnd) {
      this.setContent(itemId, 'start_error', true);
    }

    if (timeGuest != null && timeEnd != null && timeGuest >= timeEnd) {
      this.setContent(itemId, 'guest_error', true);
    }
  }

  lookForBiggerStampsInPrevQuestions(itemId, currQuestion, prevQuestions, changedTime) {
    const {timeStart, timeGuest, timeEnd} = this.getStampsCurrQuestion(name, changedTime, currQuestion);

    prevQuestions.forEach((question) => {
      const questionStart = parseInt(question.start_tms);
      const questionGuest = parseInt(question.guest_tms);
      const questionEnd = parseInt(question.end_tms);

      if (timeStart != null && (questionStart >= timeStart || questionGuest >= timeStart || questionEnd >= timeStart)) {
        this.setContent(itemId, 'start_error', true);
      }
      if (timeGuest != null && (questionStart >= timeGuest || questionGuest >= timeGuest || questionEnd >= timeGuest)) {
        this.setContent(itemId, 'guest_error', true);
      }
      if (timeEnd != null && (questionStart >= timeEnd || questionGuest >= timeEnd || questionEnd >= timeEnd)) {
        this.setContent(itemId, 'end_error', true);
      }
    });
  }

  lookForSmallerStampsInNextQuestions(itemId, currQuestion, nextQuestions, changedTime) {
    const {timeStart, timeGuest, timeEnd} = this.getStampsCurrQuestion(name, changedTime, currQuestion);

    nextQuestions.forEach((question) => {
      const questionStart = parseInt(question.start_tms);
      const questionGuest = parseInt(question.guest_tms);
      const questionEnd = parseInt(question.end_tms);

      if (timeStart != null && (questionStart <= timeStart || questionGuest <= timeStart || questionEnd <= timeStart)) {
        this.setContent(itemId, 'start_error', true);
      }
      if (timeGuest != null && (questionStart <= timeGuest || questionGuest <= timeGuest || questionEnd <= timeGuest)) {
        this.setContent(itemId, 'guest_error', true);
      }
      if (timeEnd != null && (questionStart <= timeEnd || questionGuest <= timeEnd || questionEnd <= timeEnd)) {
        this.setContent(itemId, 'end_error', true);
      }
    });
  }

  stampHasError(error) {
    if (error) {
      return {
        boxShadow: '0 0 3px #ff0000'
      };
    }
    return {};
  }

  deleteQuestion(itemId) {
    let {questions} = this.props;
    const idx = questions.findIndex(({id}) => id === itemId);
    questions = questions.concat();
    questions.splice(idx, 1);
    this.props.changeAreaContent({questions});
  }

  render() {
    return (
      <div className="component editHeader">
        <h2>{i18n.settings}</h2>
        <table>
          <tbody>
          <tr>
            <td>
              <label>{i18n.answers}: </label>
            </td>
            <td>
              {this.props.answers.map((item, i) => (
                <Answer
                  id={item.id}
                  changeAnswerLabel={this.changeAnswerLabel}
                  label={item.label}
                />
              ))}
            </td>
          </tr>
          </tbody>
        </table>
        <div style={{marginTop: '10px'}}>
          <button
            type="button"
            onClick={e => this.addAnswer(e)}
            className="button white_blue"
            style={{marginRight: '10px', marginBottom: '30px', float: 'right'}}
          >{i18n.answer_btn}
          </button>
          <button
            type="button"
            onClick={() => this.deleteAnswer()}
            className="button white_blue img_left"
            style={{marginRight: '10px', float: 'right'}}
          >
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path
                d="M68.26,31.71h-35a1.78,1.78,0,0,0-1.78,1.94l3.78,44.48A1.78,1.78,0,0,0,37,79.76H64.49a1.78,1.78,0,0,0,1.78-1.63L70,33.65a1.78,1.78,0,0,0-1.78-1.94ZM62.85,76.19H38.64L35.17,35.28H66.32Z"
              />
              <path
                d="M69.17,26.34H52.53V24.23a1.78,1.78,0,0,0-3.57,0v2.11H32.32a1.78,1.78,0,0,0,0,3.57H69.17a1.78,1.78,0,1,0,0-3.57Z"
              />
              <path
                d="M41.31,72a1.78,1.78,0,0,0,1.78,1.63h.16a1.78,1.78,0,0,0,1.62-1.93L42.18,40.53a1.78,1.78,0,0,0-3.56.31Z"
              />
              <path
                d="M58.24,73.67h.16A1.78,1.78,0,0,0,60.17,72l2.68-31.22a1.78,1.78,0,1,0-3.56-.31L56.62,71.74A1.78,1.78,0,0,0,58.24,73.67Z"
              />
              <path
                d="M50.74,73.68a1.79,1.79,0,0,0,1.78-1.78V40.61a1.78,1.78,0,1,0-3.57,0V71.89A1.79,1.79,0,0,0,50.74,73.68Z"
              />
            </svg>
            {i18n.delete_answer}
          </button>
          <div style={{marginTop: '20px', clear: 'both'}}>
            <div className="list-add-element" onClick={e => this.addQuestion(e)}>
            <span>
              <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path
                  d="M50.49,22.85A28.25,28.25,0,1,0,78.74,51.1,28.29,28.29,0,0,0,50.49,22.85Zm0,52.94A24.69,24.69,0,1,1,75.17,51.1,24.71,24.71,0,0,1,50.49,75.79Z"/>
                <path
                  d="M64.47,49.31H52.27V37.12a1.78,1.78,0,1,0-3.57,0V49.31H36.51a1.78,1.78,0,0,0,0,3.57H48.7V65.08a1.78,1.78,0,0,0,3.57,0V52.88H64.47a1.78,1.78,0,0,0,0-3.57Z"/>
              </svg>
            </span>
              <p>{i18n.add_question}</p>
            </div>
            {this.props.questions.map((item, i) => (
              <Question
                id={item.id}
                label={item.label}
                start_tms={item.start_tms}
                guest_tms={item.guest_tms}
                end_tms={item.end_tms}
                start_error={item.start_error}
                guest_error={item.guest_error}
                end_error={item.end_error}
                correct_answer={item.correct_answer}
                setContent={this.setContent}
                answers={this.props.answers}
                handleChangeTimeStamp={this.handleChangeTimeStamp}
                stampHasError={this.stampHasError}
                deleteQuestion={this.deleteQuestion}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}


componentLoader.registerComponent(
  'quiz',
  {edit, preview},
  {
    isHotSpottable: true,
    isScrollable: false,
    hasNavigableGUI: true,
    isStylable: false
  },
  {
    navigable: false
  }
);
