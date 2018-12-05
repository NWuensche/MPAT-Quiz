import React from 'react';
import autobind from 'class-autobind';

import { createHandler, handlersWithTag } from '../../utils';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import { trackAction } from '../../analytics';
import { componentLoader } from '../../../ComponentLoader';


class QuizContent extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedButton: 0,
      enteredButton: -1, // -1 = nothing entered, i = Button i selected
    };
  }

  componentDidMount() {
    // Register Key Handlers
    registerHandlers(this, handlersWithTag('active', [
      createHandler(KeyEvent.VK_UP, this.up.bind(this)),
      createHandler(KeyEvent.VK_DOWN, this.down.bind(this)),
      createHandler(KeyEvent.VK_ENTER,  this.enter.bind(this)),
    ]));
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }

  //
  // up() {
  //   const state = this.state;
  //   state.currentIndex--;
  //   if (state.currentIndex < 0) {
  //     state.currentIndex = this.props.listArray.length - 1;
  //   }
  //   this.setState(state);
  //   trackAction('list', 'up', this.props.listArray[state.currentIndex].description);
  // }
  //
  // down() {
  //   const state = this.state;
  //   state.currentIndex++;
  //   if (state.currentIndex >= this.props.listArray.length) {
  //     state.currentIndex = 0;
  //   }
  //   this.setState(state);
  //   trackAction('list', 'down', this.props.listArray[state.currentIndex].description);
  // }
  //
  // enter() {
  //   const url = this.props.listArray[this.state.currentIndex].appUrl;
  //   trackAction('list', 'goto', url);
  //   window.location.href = url;
  // }
    //

  // Fix that -1 % 4 == -1 , newMod(-1,4) == 3
  newMod(m, n) {
    return ((m%n)+n)%n;
  }

  up() {
      const numAnswers = this.props.answers.length;
      this.setState(prevState => ({
                  ...prevState,
                  selectedButton: this.newMod((prevState.selectedButton - 1),  numAnswers),
      }))
  }
  down() {
      const numAnswers = this.props.answers.length;
      this.setState(prevState => ({
                  ...prevState,
                  selectedButton: this.newMod((prevState.selectedButton + 1), numAnswers),
      }))
  }
  enter() {
      this.setState(prevState => ({
                  ...prevState,
                  enteredButton: prevState.selectedButton,
      }))
  }
  render() {
    const answers = this.props.answers
    return (
      <div>
        {answers.map((answer, i) => (
             <QuizButton
             item={answer}
             isSelected={i == this.state.selectedButton}
             isEntered={i == this.state.enteredButton}
             />
         ))}
        entered:{this.state.enteredButton}
      </div>
    );
  }
}

function QuizButton({ item, isSelected=false, isEntered=false}) {
  let css;
  if (isEntered) {
    css = { border: '2px #0f0 solid', margin: '10px', padding: '10x' };
  }
    else if (isSelected) {
    css = { border: '2px #f00 solid', margin: '10px', padding: '10x' };
  } 
    else { 
     css = { border: '2px #ddd solid', margin: '10px', padding: '10x' }; 
  }
  return (
    <div style={css}>
      <button>{item.label}</button>
    </div>
  );
}



componentLoader.registerComponent('quiz', { view: QuizContent }, {
  isStylable: true
});

