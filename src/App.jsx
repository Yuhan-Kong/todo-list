import './App.css'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
import { useState } from 'react'

function App() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    };

    setTodoList(previous => [newTodo, ...previous]);

  }

function completeTodo(id) {
  setTodoList(prev => prev.map(todo => {
    if (todo.id === id) {
      return {...todo, isCompleted: true};
    } else {
      return todo
    }
  }))
}

function updateTodo(editedTodo) {
  setTodoList(prev => prev.map(todo => {
    if (todo.id === editedTodo.id) {
      return {...editedTodo};
    } else {
      return todo;
    }
  }))
}
  
  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  )
}

export default App
