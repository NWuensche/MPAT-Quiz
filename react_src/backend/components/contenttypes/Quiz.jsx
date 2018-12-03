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

const itemType = Types.shape(
  {
    id: Types.string,
    label: Types.string,
    remoteKey: Types.string,
    correct: Types.bool
  });

//
// class QuizEdit extends React.PureComponent {
//
//   static get propTypes() {
//     return {
//       question_id: Types.string,
//       answer_options: Types.arrayOf(itemType),
//       changeAreaContent: Types.func.isRequired
//     }
//   };
//
//   static get defaultProps() {
//     return {
//       question_id: '99',
//       answer_options: []
//     }
//   };
//
//   constructor(props) {
//     super(props);
//     // autobind(this);
//     this.state = {numChildren: 0};
//   }
//
//   onAddChild() {
//     this.setState({
//       numChildren: this.state.numChildren + 1
//     });
//   }
//
//   setContent(key, value) {
//     this.setState({[key]: value});
//     this.props.changeAreaContent({ listArray });
//     console.log(this.state.question_id)
//   }
//
//   // setContent(key, value, itemId = false) {
//   //   if (itemId) {
//   //     const { answer_options } = this.props;
//   //     answer_options[key] = value;
//   //     this.props.changeAreaContent({ answer_options });
//   //   }
//   // }
//
//   // setPageCallbackFunction(itemId, selectedPage) {
//   //   if (this.props.listArray.find(d => d.id === itemId).descriptionEdited) {
//   //     this.updateItem(
//   //       {
//   //         appUrl: selectedPage.url,
//   //         id: itemId
//   //       });
//   //   } else {
//   //     this.updateItem(
//   //       {
//   //         appUrl: selectedPage.url,
//   //         description: selectedPage.title,
//   //         id: itemId
//   //       });
//   //   }
//   // }
//
//   // addItem() {
//   //   const {answer_options} = this.props;
//   //   const newOption = createDefaultItem();
//   //   answer_options.push(newOption);
//   //   this.props.changeAreaContent({answer_options});
//   // }
//   //
//   // deleteItem(itemId) {
//   //   let {listArray} = this.props;
//   //   const idx = listArray.findIndex(({id}) => id === itemId);
//   //   listArray = listArray.concat();
//   //   listArray.splice(idx, 1);
//   //   this.props.changeAreaContent({listArray});
//   // }
//
//   /* guess this just updates the state of the currently dragged item*/
//
//
//   // updateItem(item) {
//   //   const listArray = [...this.props.listArray];
//   //   const idx = listArray.findIndex(curItem => item.id === curItem.id);
//   //   listArray[idx] = Object.assign({}, listArray[idx], item);
//   //   this.props.changeAreaContent({listArray});
//   // }
//
//
//   render() {
//     const children = [];
//
//     for (let i = 0; i < this.state.numChildren; i += 1) {
//       children.push(<ChildComponent key={i} number={i}/>);
//     }
//
//     return (
//       <ParentComponent addChild={this.onAddChild.bind(this)}>
//         {children}
//       </ParentComponent>
//       // <Preview></Preview>
//     );
//   }
// }
//
//
//
//
// const ParentComponent = props => (
//   <div className="component editHeader">
//     <h2>Quiz Settings</h2>
//     <p>
//       Question Id: <input type="text" value={props.question_id} onChange={e => this.setContent('question_id', e.target.value)}/>
//       <button onClick={props.addChild} onKeyPress={noSubmitOnEnter}>Add answer option</button>
//     </p>
//
//     <div id="children-pane">
//       {props.children}
//     </div>
//   </div>
// );
// const ChildComponent = props => (
//   <div>
//     <p>Answer Option:
//       <input
//         type="text"
//         // type="text" value={props.children.label}
//         // onChange={e => childProps.setContent(props.children.id, 'label', e.target.value)}
//       />
//       <input type="radio" id="" name="question_xx" value="x"/>
//       Remote Key<select id="" name="question_xx" value="x">
//         {sharedProps().remoteKeys.map(i => (<option value={i.key}>{i.label}</option>))}
//       </select>
//       {/* {getTooltipped(*/}
//       {/* <button*/}
//       {/* type="button"*/}
//       {/* className="right white_blue button img_left"*/}
//       {/* // style={{ position: 'absolute', right: 10, bottom: 10 }}*/}
//       {/* // onClick={() => childProps.deleteItem(props.children.id)}*/}
//       {/* >*/}
//       {/* <svg*/}
//       {/* id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"*/}
//       {/* viewBox="0 0 100 100"*/}
//       {/* >*/}
//       {/* <path*/}
//       {/* className="cls-1"*/}
//       {/* d="M68.26,31.71h-35a1.78,1.78,0,0,0-1.78,1.94l3.78,44.48A1.78,1.78,0,0,0,37,79.76H64.49a1.78,1.78,0,0,0,1.78-1.63L70,33.65a1.78,1.78,0,0,0-1.78-1.94ZM62.85,76.19H38.64L35.17,35.28H66.32Z"*/}
//       {/* />*/}
//       {/* <path*/}
//       {/* className="cls-1"*/}
//       {/* d="M69.17,26.34H52.53V24.23a1.78,1.78,0,0,0-3.57,0v2.11H32.32a1.78,1.78,0,0,0,0,3.57H69.17a1.78,1.78,0,1,0,0-3.57Z"*/}
//       {/* />*/}
//       {/* <path*/}
//       {/* className="cls-1"*/}
//       {/* d="M41.31,72a1.78,1.78,0,0,0,1.78,1.63h.16a1.78,1.78,0,0,0,1.62-1.93L42.18,40.53a1.78,1.78,0,0,0-3.56.31Z"*/}
//       {/* />*/}
//       {/* <path*/}
//       {/* className="cls-1"*/}
//       {/* d="M58.24,73.67h.16A1.78,1.78,0,0,0,60.17,72l2.68-31.22a1.78,1.78,0,1,0-3.56-.31L56.62,71.74A1.78,1.78,0,0,0,58.24,73.67Z"*/}
//       {/* />*/}
//       {/* <path*/}
//       {/* className="cls-1"*/}
//       {/* d="M50.74,73.68a1.79,1.79,0,0,0,1.78-1.78V40.61a1.78,1.78,0,1,0-3.57,0V71.89A1.79,1.79,0,0,0,50.74,73.68Z"*/}
//       {/* />*/}
//       {/* </svg>*/}
//       {/* {i18n.deleteOption}*/}
//       {/* </button>*/}
//       {/* , Constants.locstr.list.ttdeleteOption)}*/}
//       <button>Delete Option</button>
//     </p>
//   </div>
// );
//

const answerType = Types.shape(
  {
    label: Types.string,
    correct: Types.bool,
    id: Types.string
  });


function createDefaultAnswer() {
  return {
    label: '',
    correct: false,
    id: generateId()
  };
}

const questionType = Types.shape(
  {
    start: Types.string,
    end: Types.bool,
    id: Types.string,
    label: Types.string
  });

function createDefaultQuestion() {
  return {
    start: null,
    end: null,
    label: 'no label',
    id: generateId()
  };
}

class Answer extends React.Component {

  static get defaultProps() {
    return {
      label: 'not defined',
      correct: false
    };
  }

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {};
  }

  setContent(key, value) {
    this.setState({ [key]: value });
    // this.props.changeAreaContent(99);
  }

  render() {
    const label = 'Answer:';
    return (
      <div className="answer">
        {label}
        <input
          type="text"
          onChange={e => this.setContent('label', e.target.value)}
        />{this.state.label}
      </div>
    );
  }
}

class Question extends React.Component {

  static propTypes = {
    id: Types.string.isRequired,
    label: Types.string,
    answers: Types.arrayOf(answerType),
    changeAreaContent: Types.func.isRequired
  };

  static defaultProps = {
    answers: [createDefaultAnswer()]
  };


  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      answers: [],
      start: null,
      end: null
    };
  }

  setContent(key, value) {
    this.setState({ [key]: value });
    // let { question_id } = this.props;
    // question_id = 99;
    // this.props.changeAreaContent({ question_id });
  }

  addAnswer(e) {
    e.preventDefault();
    const answers = this.state.answers;
    answers.push(null);
    this.setState({
      answers
    });
  }

  render() {
    const answers = [];

    for (let i = 0; i < this.state.answers.length; i++) {
      answers.push(<Answer id={i} />);
    }

    return (
      <div className="question">
        Question<input
          type="text"
          onChange={e => this.props.setContent(this.props.id, 'label', e.target.value)}
        />
        Start: <input type="text" />
        End: <input type="text" />
        <button onClick={(e) => this.addAnswer(e)}>Add answer option</button>
        <div className="new-answer">
          {answers}
        </div>
        id: {this.props.id}
      </div>
    );
  }
}

class Quiz extends React.Component {

  static propTypes = {
    id: Types.string.isRequired,
    questions: Types.arrayOf(questionType),
    changeAreaContent: Types.func.isRequired,
    test: Types.number
  };

  static defaultProps = {
    questions: [],
    test: 999999
  };

  constructor() {
    super();
    autobind(this);
    this.state = {
      questions: []
    };
  }

  setContent(itemId, key, value) {
    let { questions } = this.state;
    const idx = questions.findIndex(({ id }) => id === itemId);
    questions = questions.concat();
    questions[idx][key] = value;
    this.setState(state => ({ questions }));

    this.props.changeAreaContent({ questions }); // error here --> how to set questions array correctly?
    this.props.changeAreaContent({ test: 10000 });
  }

  addQuestion(e) {
    e.preventDefault();
    const questions = this.state.questions;
    questions.push(createDefaultQuestion());
    this.setState(state => ({ questions }));
    this.addContent();
  }

  addContent() {
    let { questions } = this.state;
    this.props.changeAreaContent({ questions });
  }

  render() {
    const questions = [];
    const test = [];

    for (let i = 0; i < this.state.questions.length; i++) {
      questions.push(<Question
        id={this.state.questions[i].id}
        setContent={this.setContent}
      />);
    }

    return (
      <div className="component editHeader">
        {/* <h2>{Constants.locstr.list.listSettings}</h2>*/}
        <h2>Quiz Settings</h2>
        <button type="button" onClick={e => this.addQuestion(e)}>Add Question</button>
        {questions}
        State Length: {this.state.questions.length}
        Props Length: {this.props.questions.length}
        {this.props.questions.map((item, i) => (
          <div>{item.label}</div>
          ))}

        {this.state.questions.map((item, i) => (
          <div>{item.label}</div>
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
