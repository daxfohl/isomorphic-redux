import React, { Component , PropTypes }   from 'react';
import TodosView              from './TodosView';
import TodosForm              from './TodosForm';
import { bindActionCreators } from 'redux';
import * as TodoActions       from 'actions/TodoActions';
import { connect }            from 'react-redux';

class Home extends Component {
  static propTypes = {
    todos:  PropTypes.any.isRequired,
    dispatch: PropTypes.func.isRequired,
    editId: PropTypes.number,
    deleteId: PropTypes.number
  };

  render() {
    const { todos, dispatch, routeParams, history } = this.props;
    const { editId, deleteId } = routeParams;
    return (
      <div id="todo-list">
        <TodosView todos={todos} editId={editId} deleteId={deleteId} history={history}
          {...bindActionCreators(TodoActions, dispatch)} />
        <TodosForm
          {...bindActionCreators(TodoActions, dispatch)}/>
      </div>
    );
  }
}

export default connect(state => ({ todos: state.todos }))(Home)
