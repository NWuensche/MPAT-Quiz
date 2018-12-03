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
      currentIndex: 0
    };
  }

  componentDidMount() {
    // Register Key Handlers
    registerHandlers(this, handlersWithTag('active', [
      createHandler(KeyEvent.VK_UP, this.up),
      createHandler(KeyEvent.VK_DOWN, this.down),
      createHandler(KeyEvent.VK_ENTER, this.enter)
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

  render() {
    const items = this.props.questions;
    const test = this.props.test;
    // const abc = [];
    // for (let i = 0; i < items.length; i++) {
    //   abc.push(<div>Test</div>);
    // }

    return (
      <div>
        Hier sollte was stehen
        {test}
        {this.props.questions.map((item, i) => (
          <div>{item.label}</div>
          ))}
        {/*{abc}*/}
        {/* {items.map((item) => (*/}
        {/* <QuizButton*/}
        {/* item={item}*/}
        {/* isSelected={item.correct}*/}
        {/* />*/}
        {/* ))}*/}
      </div>
    );
  }
}

// function QuizButton({ item, isSelected }) {
//   let css;
//   if (isSelected) {
//     css = { border: '2px #f00 solid', margin: '10px', padding: '10x' };
//   } else { css = { border: '2px #ddd solid', margin: '10px', padding: '10x' }; }
//   return (
//     <div style={css}>
//       <button >{item.label}</button>
//     </div>
//   );
// }


componentLoader.registerComponent('quiz', { view: QuizContent }, {
  isStylable: true
});

