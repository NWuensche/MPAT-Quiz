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
    end_tms: Types.bool,
    id: Types.string,
    label: Types.string,
    correct_answer: Types.string
  });

function createDefaultQuestion() {
  return {
    start_tms: null,
    end_tms: null,
    label: 'no label',
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
    this.state = {};
  }

  render() {
    return (
      <div className="answer" style={{ display: 'table-cell' }}>
        Label<input
          type="text"
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
    this.state = {
      start_tms: null,
      end_tms: null
    };
  }


  render() {
    const radioButtons = [];

    for (let i = 0; i < this.props.answers.length; i++) {
      radioButtons.push(
        <div style={{ display: 'table-cell' }}>
          <label htmlFor={this.props.answers[i].id}>{this.props.answers[i].label}</label>
          <input
            type="radio"
            name={this.props.id}
            id={this.props.answers[i].id}
            value={i}
            onChange={e => this.props.setContent(this.props.id, 'correct_answer', e.target.value)}
          />
        </div>
      );
    }
    return (
      <div className="question">
        Question<input
          type="text"
          onChange={e => this.props.setContent(this.props.id, 'label', e.target.value)}
        />
        <div>
          Start Timestamp: <input
            type="number"
            onChange={e => this.props.setContent(this.props.id, 'start_tms', e.target.value)}
          /> sec
          End Timestamp <input
            type="number"
            onChange={e => this.props.setContent(this.props.id, 'end_tms', e.target.value)}
          /> sec
        </div>
        <div>
          <p>Choose the correct answer:</p>
          <div style={{ display: 'table' }}>
            {radioButtons}
          </div>
        </div>
      </div>
    );
  }
}

class Quiz extends React.Component {

  static propTypes = {
    id: Types.string.isRequired,
    questions: Types.arrayOf(questionType),
    answers: Types.arrayOf(answerType),
    changeAreaContent: Types.func.isRequired,
  };

  static defaultProps = {
    answers: [createDefaultAnswer()],
    questions: []
  };

  constructor() {
    super();
    autobind(this);
    this.state = {
      questions: [],
      answers: []
    };
  }

  setContent(itemId, key, value) {
    let { questions } = this.state;
    const idx = questions.findIndex(({ id }) => id === itemId);
    questions = questions.concat();
    questions[idx][key] = value;
    this.setState(state => ({ questions }));
    this.props.changeAreaContent({ questions });
  }


  // setContentAnswers(questionId, answerId, key, value) {
  //   let { questions } = this.state;
  //   const idx = questions.findIndex(({ id }) => id === questionId);
  //   questions = questions.concat();
  //   const idxAnswer = questions[idx].answers.findIndex(({ id }) => id === answerId);
  //   questions[idx].answers[idxAnswer][key] = value;
  //   this.setState(state => ({ questions }));
  //   this.props.changeAreaContent({ questions });
  // }

  addAnswer(e) {
    e.preventDefault();
    const answers = this.state.answers;
    answers.push(createDefaultAnswer());
    this.setState({
      answers
    });
    this.props.changeAreaContent({ answers });
  }

  addQuestion(e) {
    e.preventDefault();
    const questions = this.state.questions;
    questions.push(createDefaultQuestion());
    this.setState(state => ({ questions }));
    this.addContent();
  }

  addContent() {
    const { questions } = this.state;
    this.props.changeAreaContent({ questions });
  }

  setCorrectAnswer() {

  }

  changeAnswerLabel(itemId, key, value) {
    let { answers } = this.state;
    const idx = answers.findIndex(({ id }) => id === itemId);
    answers = answers.concat();
    answers[idx][key] = value;
    this.setState(state => ({ answers }));
    this.props.changeAreaContent({ answers });
  }

  render() {
    const questions = [];
    const answer_options = [];

    for (let i = 0; i < this.state.questions.length; i++) {
      questions.push(<Question
        id={this.state.questions[i].id}
        setContent={this.setContent}
        answers={this.state.answers}
      />);
    }

    for (let i = 0; i < this.state.answers.length; i++) {
      answer_options.push(<Answer
        id={this.state.answers[i].id}
        changeAnswerLabel={this.changeAnswerLabel}
      />);
    }


    return (
      <div className="component editHeader">
        {/* <h2>{Constants.locstr.list.listSettings}</h2>*/}
        <h2>Quiz Settings</h2>
        Answers:
        <button onClick={e => this.addAnswer(e)}>Add answer option</button>
        <div style={{ display: 'table' }}>
          {answer_options}
        </div>
        <button type="button" onClick={e => this.addQuestion(e)}>Add Question</button>
        <div>
          {questions}
        </div>
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
