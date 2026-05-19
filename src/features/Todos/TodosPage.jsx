import TodoForm from "./TodoForm";
import TodoList from './TodoList/TodoList';
import { useState, useEffect } from "react";
function TodosPage({ token }) {
    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);

    useEffect(() => {
        async function fetchTodos() {
            try{
                setIsTodoListLoading(true)
                
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
                setIsTodoListLoading(false)
            }
        }
        fetchTodos()
    }, [token])

    async function addTodo(todoTitle) {
        const newTodo = {
          id: Date.now(),
          title: todoTitle,
          isCompleted: false
        };
    
        setTodoList(previous => [newTodo, ...previous]);

        const response = await fetch('/api/tasks', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            credentials: 'include',
            body: JSON.stringify({
                title: todoTitle,
                isCompleted: false
            })
        })
    
      }

      async function completeTodo(id) {
        const originalTodo = todoList.find(todo => todo.id === id)

        setTodoList(prev => prev.map(todo => {
          if (todo.id === id) {
            return {...todo, isCompleted: true};
          } else {
            return todo
          }
        }))
        try {
            const response = await fetch(`/api/tasks/${id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
              },
              credentials: 'include',
              body: JSON.stringify({
                isCompleted: true,
                createdAt: originalTodo.createdAt
              })
            })
        
            if (!response.ok) {
              throw new Error('error')
            }
        
          } catch (err) {
            setError(err.message)
        
            setTodoList(prev => prev.map(todo => {
              if (todo.id === id) {
                return originalTodo
              } else {
                return todo
              }
            }))
          }
      }
      
      async function updateTodo(editedTodo) {
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