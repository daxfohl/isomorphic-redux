import React         from 'react';
import { PropTypes } from 'react';
import Immutable     from 'immutable';
import { Link, browserHistory }      from 'react-router'

export default class TodosView extends React.Component {
  static propTypes = {
    todos: PropTypes.object.isRequired,
    getTodos: PropTypes.func.isRequired,
    editTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    editId: PropTypes.any,
    deleteId: PropTypes.any,
    history: PropTypes.object
  };

  handleDelete = () => {
    this.props.deleteTodo(this.props.deleteId);
    this.props.history.push('/');
  };

  handleEdit = () => {
    let node = this.refs['todo-edit'];
    this.props.editTodo(this.props.editId, node.value);
    this.props.history.push('/');
    node.value = '';
  };

  componentDidMount = () => {
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
            this.props.todos.map((todo, index) => {
              return (
                <div style={btnStyle} key={index}>
                  <span>{todo.get('text')}</span>
                  {(() => {
                    if (todo.get('id') != -1) {
                      return(
                        <span>
                          <Link to={`/edit/${todo.get('id')}`}>Edit</Link>
                          <Link to={`/delete/${todo.get('id')}`}>Delete</Link>
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
          if (this.props.editId > -1) {
            return(
              <div style={overlayStyle}>
                <input type="text" placeholder="type todo" ref="todo-edit" />
                <button style={btnStyle} onClick={this.handleEdit}>Edit It!</button>
              </div>
            );
          } else if (this.props.deleteId > -1) {
            return(
              <div style={overlayStyle}>
                <button style={btnStyle} onClick={this.handleDelete}>Delete It!</button>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}
