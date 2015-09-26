import $ from 'jquery'
import Backbone from 'backbone'
import React, { Component } from 'react'

const TodoModel = Backbone.Model.extend({

  defaults: {
    id: 1,
    text: 'Get stuff done',
    completed: false
  },

  toggle: function() {
    debugger
    this.set({
      completed: !this.get('completed')
    })
  }
})

const todoModel = new TodoModel

// Smart and grumpy - Replacement for Backbone.View
class TodoConnector extends Component {
  componentDidMount() {
    this.props.model.on('change', () => {
      this.forceUpdate()
    })
  }

  render() {
    const text = this.props.model.get('text')
    const completed = this.props.model.get('completed')
    const toggle = this.props.model.toggle.bind(this.props.model)

    const props = {
      text,
      completed,
      toggle,
    }

    return (
      <Todo {...props} />
    )
  }
}

// Dumb and happy - Easy to test and decoupled from Backbone
class Todo extends Component {

  render() {
    return (
      <li onClick={ (e) => { this.props.toggle() }}>
        {this.props.text} {this.props.completed.toString()}
      </li>
    )
  }
}


document.addEventListener('DOMContentLoaded', () => {
  React.render(<TodoConnector model={todoModel} />, document.getElementById('todo'))
})
