import Immutable from 'immutable';

const defaultState = { list: [] }

export default function todoReducer(state1 = defaultState, action) {
  const state = Immutable.fromJS(state1);
  switch(action.type) {
    case 'GET_TODOS':
      return state.set('list', new Immutable.List(action.res.data));
    case 'CREATE_TODO_REQUEST':
      return state.set('list', state.get('list').concat({id: -1, text: action.text}));
    case 'EDIT_TODO_REQUEST':
      return state.set('list', state.get('list').map(x => x.id === action.id ? {id: x.id, text: action.text} : x));
    case 'DELETE_TODO_REQUEST':
      return state.set('list', state.get('list').filter(x => x.id != action.id));
    case 'HIDE_FORMS':
      return Immutable.Map({list: state.get('list')});
    case 'SHOW_EDIT_TODO_FORM':
      return state.set('editId', action.id);
    case 'SHOW_DELETE_TODO_FORM':
      return state.set('deleteId', action.id);
    default:
      return state;
  }
}
