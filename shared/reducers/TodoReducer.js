import Immutable from 'immutable';

const defaultState = []

export default function todoReducer(state1 = defaultState, action) {
  const state = Immutable.fromJS(state1);
  switch(action.type) {
    case 'GET_TODOS':
      return Immutable.fromJS(action.res.data);
    case 'CREATE_TODO_REQUEST':
      return state.push(Immutable.Map({id: "-1", text: action.text}));
    case 'EDIT_TODO_REQUEST':
      return state.map(x => x.get('id') == action.id ? Immutable.Map({id: x.id, text: action.text}) : x);
    case 'DELETE_TODO_REQUEST':
      return state.filter(x => x.get('id') != action.id);
    default:
      return state;
  }
}
