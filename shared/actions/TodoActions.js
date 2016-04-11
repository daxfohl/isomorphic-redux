import request from 'axios';

export function getTodos() {
  return {
    type: 'GET_TODOS',
    promise: request.get("/api/todo/list")
  }
}

export function createTodo(text) {
  return {
    type: 'CREATE_TODO',
    text,
    promise: request.post('/api/todo/create', { text })
  };
}

export function editTodo(id, text) {
  return {
    type: 'EDIT_TODO',
    id, text,
    promise: request.post('/api/todo/update', { id, text })
  };
}

export function deleteTodo(id) {
  return {
    type: 'DELETE_TODO',
    id,
    promise: request.post('/api/todo/delete', { id })
  };
}
