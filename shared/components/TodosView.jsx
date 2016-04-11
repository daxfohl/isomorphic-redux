import React         from 'react';
import { PropTypes } from 'react';
import Immutable     from 'immutable';

export default class TodosView extends React.Component {
  static propTypes = {
    todos:      PropTypes.instanceOf(Immutable.List).isRequired,
    getTodos:   PropTypes.func.isRequired,
    editTodo:   PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired
  };

  handleDelete = (e) => {
    const id = Number(e.target.dataset.id);
    const currentVal = this.props.todos.get(id);

    this.props.deleteTodo(currentVal.id);
  };

  handleEdit = (e) => {
    const id         = Number(e.target.dataset.id);
    const currentVal = this.props.todos.get(id);

    // For a cutting edge UX
    let text = window.prompt('', currentVal.text);

    this.props.editTodo(currentVal.id, text);
  };

  componentDidMount = () => {
    this.props.getTodos();
    setInterval(this.props.getTodos, 2000);
  };

  render() {
    const btnStyle = {
      'margin': '1em 0 1em 1em'
    };

    return (
      <div id="todos-list">
        {
          this.props.todos.map((todo, index) => {
            return (
              <div style={btnStyle} key={index}>
                <span>{todo.text}</span>
                {(() => {
                  if (todo.id != -1) {
                    return(
                      <span>
                        <button style={btnStyle} data-id={index} onClick={this.handleDelete}>X</button>
                        <button style={btnStyle} data-id={index} onClick={this.handleEdit}>Edit</button>
                      </span>
                    );
                  }
                })()}
              </div>
            );
          })
        }
      </div>
    );
  }
}
