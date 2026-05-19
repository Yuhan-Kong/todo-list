import TodoForm from "./TodoForm";
import TodoList from './TodoList/TodoList';
import { useState, useEffect } from "react";
function TodosPage({ token }) {
    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setisTodoListLoading] = useState(false);

    useEffect(() => {
        async function fetchTodos() {
            try{
                setisTodoListLoading(true)
                
                const response = await fetch('/api/tasks', {
                    method: 'GET',
                    headers: {
                        'X-CSRF-TOKEN': token
                    },
                    credentials: 'include'
                })

                if (response.status === 401) {
                    throw new Error('unauthorized')
                }

                if (!response.ok) {
                    throw new Error('error')
                }
                const data = await response.json()

                setTodoList(data.tasks)
            } catch(err) {
                setError(err.message)
            } finally {
                setisTodoListLoading(false)
            }

        }
    }, [token])

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
export default TodosPage;