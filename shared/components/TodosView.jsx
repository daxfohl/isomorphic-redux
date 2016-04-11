import React         from 'react';
import { PropTypes } from 'react';
import Immutable     from 'immutable';

export default class TodosView extends React.Component {
  static propTypes = {
    todos:      PropTypes.object.isRequired,
    getTodos:   PropTypes.func.isRequired,
    editTodo:   PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired
  };

  startDelete = (e) => {
    const id = Number(e.target.dataset.id);
    const currentVal = this.props.todos.get('list').get(id);
    this.props.showDeleteTodoForm(currentVal.id);
  };

  handleDelete = () => {
    this.props.deleteTodo(this.props.todos.get('deleteId'));
    this.props.hideForms();
  };

  startEdit = (e) => {
    const id         = Number(e.target.dataset.id);
    const currentVal = this.props.todos.get('list').get(id);
    this.props.showEditTodoForm(currentVal.id);
  };

  handleEdit = () => {
    let node = this.refs['todo-edit'];
    this.props.editTodo(this.props.todos.get('editId'), node.value);
    this.props.hideForms();
    node.value = '';
  };

  componentDidMount = () => {
    this.props.getTodos();
    setInterval(this.props.getTodos, 2000);
  };

  render() {
    const btnStyle = {
      'margin': '1em 0 1em 1em'
    };
    const overlayStyle = {height: '100%', width: '100%', position: 'fixed', zIndex: 1, background: 'black', top: 0, left: 0, opacity: 0.8};

    return (
      <div>
        <div>
          {
            this.props.todos.get('list').map((todo, index) => {
              return (
                <div style={btnStyle} key={index}>
                  <span>{todo.text}</span>
                  {(() => {
                    if (todo.id != -1) {
                      return(
                        <span>
                          <button style={btnStyle} data-id={index} onClick={this.startDelete}>X</button>
                          <button style={btnStyle} data-id={index} onClick={this.startEdit}>Edit</button>
                        </span>
                      );
                    }
                  })()}
                </div>
              );
            })
          }
        </div>
        {(() => {
          if (this.props.todos.get('editId') > -1) {
            return(
              <div style={overlayStyle}>
                <input type="text" placeholder="type todo" ref="todo-edit" />
                <button style={btnStyle} onClick={this.handleEdit}>Edit</button>
              </div>
            );
          } else if (this.props.todos.get('deleteId') > -1) {
            return(
              <div style={overlayStyle}>
                <button style={btnStyle} onClick={this.handleDelete}>Delete</button>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
