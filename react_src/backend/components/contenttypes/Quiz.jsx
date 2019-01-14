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
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import { componentLoader } from '../../../ComponentLoader';
import { noSubmitOnEnter } from '../../utils';
import { getTooltipped } from '../../tooltipper';
import Constants from '../../../constants';
import { generateId } from '../../../functions';


const i18n = Constants.locstr.quiz;

function edit(params) {
  const { id, data, changeAreaContent } = params;
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
      { key: '', label: 'Select Remote Button' },
      { key: 'VK_0', label: '0', disabled: false },
      { key: 'VK_1', label: '1', disabled: false },
      { key: 'VK_2', label: '2', disabled: false },
      { key: 'VK_3', label: '3', disabled: false },
      { key: 'VK_4', label: '4', disabled: false },
      { key: 'VK_5', label: '5', disabled: false },
      { key: 'VK_6', label: '6', disabled: false },
      { key: 'VK_7', label: '7', disabled: false },
      { key: 'VK_8', label: '8', disabled: false },
      { key: 'VK_9', label: '9', disabled: false },
      { key: 'VK_RED', label: 'red', disabled: false },
      { key: 'VK_YELLOW', label: 'yellow', disabled: false },
      { key: 'VK_GREEN', label: 'green', disabled: false },
      { key: 'VK_BLUE', label: 'blue', disabled: false },
      { key: 'VK_BACK', label: 'back', disabled: false },
      { key: 'VK_OK', label: 'ok', disabled: false }
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
    number_question: Types.number,
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
    number_question: 0,
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
      <div className="answer" style={{ display: 'table-cell' }}>
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
                  style={this.props.hasError(this.props.start_error)}
                  onChange={e => this.props.handleTest(this.props.id, this.props.number_question, 'start', e)}
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
                  style={this.props.hasError(this.props.guest_error)}
                  onChange={e => this.props.handleTest(this.props.id, this.props.number_question, 'guest', e)}
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
                  style={this.props.hasError(this.props.end_error)}
                  onChange={e => this.props.handleTest(this.props.id, this.props.number_question, 'end', e)}
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
    let { questions } = this.props;
    const idx = questions.findIndex(({ id }) => id === itemId);
    questions = questions.concat();
    questions[idx][key] = value;
    this.props.changeAreaContent({ questions });
  }

  addAnswer(e) {
    e.preventDefault();
    const { answers } = this.props;
    answers.push(createDefaultAnswer());
    this.props.changeAreaContent({ answers });
  }

  addQuestion(e) {
    e.preventDefault();
    const { questions } = this.props;
    questions.push(createDefaultQuestion());
    this.props.changeAreaContent({ questions });
  }

  changeAnswerLabel(itemId, key, value) {
    let { answers } = this.props;
    const idx = answers.findIndex(({ id }) => id === itemId);
    answers = answers.concat();
    answers[idx][key] = value;
    this.props.changeAreaContent({ answers });
  }

  handleTest(itemId, number_question, name, e) {
    this.setContent(itemId, `${name}_tms`, e.target.value);

    let { questions } = this.props;
    const idx = questions.findIndex(({ id }) => id === itemId);
    questions = questions.concat();
    const currQuestion = questions[idx];

    // Handle if one time stamp is smaller than the last one
    let timeStart = currQuestion.start_tms;
    let timeGuest = currQuestion.guest_tms;
    let timeEnd = currQuestion.end_tms;

    const changedTime = parseInt(e.target.value);

    switch(name) {
      case 'start': timeStart = changedTime; break;
      case 'guest': timeGuest = changedTime; break;
      case 'end': timeEnd = changedTime; break;
    }

    if (timeStart >= timeGuest || timeStart >= timeEnd) {
        this.setContent(itemId, `start_error`, true);
    } else {
        this.setContent(itemId, `start_error`, false);
    }

    if (timeGuest >= timeEnd) {
        this.setContent(itemId, `guest_error`, true);
    } else {
        this.setContent(itemId, `guest_error`, false);
    }

    // Handle if time stamp is smaller than any the ones in previous questions

    let prevQuestions = []
    let i;
    for (i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (question.number_question < number_question) { //TODO number_question aus aktueller Frage, nicht als Param
      prevQuestions.push(questions[i]);
      }
    }

    //TODO, Was, wenn nächste kleiner?
    let hadError = false;
    for (i = 0; i < prevQuestions.length; i++) {
      const question = prevQuestions[i];
      if (question.end_tms > changedTime) { // Hier doch alle abfragen
        this.setContent(itemId, `${name}_error`, true);
        hadError = true;
        break;
      }
    }
    if (!hadError) {
        this.setContent(itemId, `${name}_error`, false);
    }

  }

  hasError(error) {
    if (error) {
      return {
        boxShadow: '0 0 3px #ff0000'
      };
    }
    return {};
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
                <button
                  onClick={e => this.addAnswer(e)}
                  style={{ position: 'absolute', right: '35', marginTop: '-50' }}
                >{i18n.answer_btn}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          className="list-add-element" onClick={e => this.addQuestion(e)}
          style={{ marginTop: '20px' }}
        >
          <span>
            <svg
              id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
            >
              <path
                d="M50.49,22.85A28.25,28.25,0,1,0,78.74,51.1,28.29,28.29,0,0,0,50.49,22.85Zm0,52.94A24.69,24.69,0,1,1,75.17,51.1,24.71,24.71,0,0,1,50.49,75.79Z"
              />
              <path
                d="M64.47,49.31H52.27V37.12a1.78,1.78,0,1,0-3.57,0V49.31H36.51a1.78,1.78,0,0,0,0,3.57H48.7V65.08a1.78,1.78,0,0,0,3.57,0V52.88H64.47a1.78,1.78,0,0,0,0-3.57Z"
              />
            </svg>
          </span>
          <p>{i18n.add_question}</p>
        </div>
        {this.props.questions.map((item, i) => (
          <Question
            id={item.id}
            number_question={i}
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
            handleTest={this.handleTest}
            hasError={this.hasError}
          />
        ))}
      </div>
    );
  }
}


componentLoader.registerComponent(
  'quiz',
  { edit, preview },
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
