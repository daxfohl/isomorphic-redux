import Immutable from 'immutable';

const defaultState = new Immutable.List();

export default function todoReducer(state = defaultState, action) {
  console.log(action);
  switch(action.type) {
    case 'GET_TODOS':
      return new Immutable.List(action.res.data);
    case 'CREATE_TODO_REQUEST':
      return state.concat({id: -1, text: action.text});
    case 'EDIT_TODO_REQUEST':
      return state.map(x => x.id === action.id ? {id: x.id, text: action.text} : x);
    case 'DELETE_TODO_REQUEST':
      return state.filter(x => x.id != action.id);
    default:
      return state;
  }
}
