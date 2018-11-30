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
    const items = this.props.question_id;
    console.log("Hier " + items)
    return (
      <div>

 hkaSJ'
        SKJADJLÖ
        SADKAJSD'

        ASLDJKADW
        Hallo
        Hallo
        Hallo
        {items}
        {items}
        {items}
      </div>
    );
  }
}

componentLoader.registerComponent('quiz', { view: QuizContent }, {
  isStylable: true
});

