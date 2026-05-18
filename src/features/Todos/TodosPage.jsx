import TodoForm from "./TodoForm";
import TodoList from './TodoList/TodoList';
import { useState } from "react";
function TodosPage() {
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
          <TodoForm onAddTodo={addTodo} />
          <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
        </div>
      )
}