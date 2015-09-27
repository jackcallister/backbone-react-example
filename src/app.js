import $ from 'jquery'
import Backbone from 'backbone'
import React, { Component } from 'react'

const TodoModel = Backbone.Model.extend({

  defaults: {
    id: null,
    text: 'Get stuff done',
    completed: false
  },

  toggle: function() {
    this.set({
      completed: !this.get('completed')
    })
  }
})

const TodoCollection = Backbone.Collection.extend({
  model: TodoModel,

  completed: function() {
    return this.where({
      completed: true
    })
  },
})

// Smart and grumpy - Replacement for Backbone.View
class TodoConnector extends Component {
  componentDidMount() {
    this.props.model.on('change', () => {
      this.forceUpdate()
    })
  }

  render() {
    const id = this.props.model.get('id')
    const text = this.props.model.get('text')
    const completed = this.props.model.get('completed')
    const toggle = this.props.model.toggle.bind(this.props.model)

    const props = {
      id,
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
      <li key={this.props.id} onClick={ (e) => { this.props.toggle() }}>
        {this.props.text} {this.props.completed.toString()}
      </li>
    )
  }
}

class Todos extends Component {

  renderTodos() {
    return this.props.todos.map((todo, i) => {
      return <TodoConnector model={todo} key={i} />
    })
  }

  render() {
    const todos = this.renderTodos()

    return (
      <ul>
        {todos}
      </ul>
    )
  }
}

class TodosConnector extends Component {

  constructor(props) {
    super(props)

    this.state = {
      onlyDisplayCompleted: false
    }
  }

  componentDidMount() {
    this.props.collection.on('change', () => {
      this.forceUpdate()
    })
  }

  getTodos() {
    if (this.state.onlyDisplayCompleted) {
      return this.props.collection.completed.call(this.props.collection)
    } else {
      return this.props.collection.models
    }
  }

  toggleDisplayCompleted() {
    this.setState({
      onlyDisplayCompleted: !this.state.onlyDisplayCompleted
    })
  }

  render() {
    const todos = this.getTodos()

    return (
      <div>
        <button onClick={(e) => { this.toggleDisplayCompleted() }}>Completed only</button>
        <Todos todos={todos} />
      </div>
    )
  }
}

const collection = new TodoCollection([
  new TodoModel({id: 1}),
  new TodoModel({id: 2, completed: true}),
  new TodoModel({id: 3})
])

document.addEventListener('DOMContentLoaded', () => {
  React.render(<TodosConnector collection={collection}/>, document.getElementById('todo'))
})
