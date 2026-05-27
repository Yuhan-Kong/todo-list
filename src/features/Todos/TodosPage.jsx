import { useState, useEffect } from "react";

import useDebounce from "../../utils/useDebounce";
import SortBy from "../../shared/SortBy";
import TodoForm from "./TodoForm";
import TodoList from './TodoList/TodoList';


function TodosPage({ token }) {
    const [todoList, setTodoList] = useState([]);
    const [error, setError] = useState('');
    const [isTodoListLoading, setIsTodoListLoading] = useState(false);
    const [sortBy, setSortBy] = useState('creationDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [filterTerm, setFilterTerm] = useState('');
    const debouncedFilterTerm = useDebounce(filterTerm, 300);

    useEffect(() => {
        async function fetchTodos() {
            try{
                setIsTodoListLoading(true)
                
                const params = new URLSearchParams({
                  sortBy,
                  sortDirection,
                })

                const response = await fetch(`/api/tasks?${params}`, {
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
    }, [token, sortBy, sortDirection])

    async function addTodo(todoTitle) {
        const newTodo = {
          id: Date.now(),
          title: todoTitle,
          isCompleted: false
        };
      
        setTodoList(prev => [newTodo, ...prev]);
      
        try {
          const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': token
            },
            credentials: 'include',
            body: JSON.stringify({
              title: todoTitle,
              isCompleted: false
            })
          });
      
          if (!response.ok) {
            throw new Error('error');
          }
      
          const data = await response.json();
      
          setTodoList(prev =>
            prev.map(todo =>
              todo.id === newTodo.id ? data : todo
            )
          );
      
        } catch (err) {
          setError(err.message);
      
          setTodoList(prev =>
            prev.filter(todo => todo.id !== newTodo.id)
          );
        }
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
                // createdAt: originalTodo.createdAt
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
        const originalTodo = todoList.find(
          todo => todo.id === editedTodo.id
        )
      
        try {
          setTodoList(prev => prev.map(todo => {
            if (todo.id === editedTodo.id) {
              return { ...editedTodo };
            } else {
              return todo;
            }
          }))
      
          const response = await fetch(`/api/tasks/${editedTodo.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': token
            },
            credentials: 'include',
            body: JSON.stringify({
              title: editedTodo.title,
              isCompleted: editedTodo.isCompleted,
              // createdAt: originalTodo.createdAt
            })
          })
      
          if (!response.ok) {
            throw new Error('error')
          }
      
        } catch (err) {
          setError(err.message)
        
          setTodoList(prev => prev.map(todo => {
            if (todo.id === editedTodo.id) {
              return originalTodo
            } else {
              return todo
            }
          }))
          
        }
      }
      return (
        <div>
            {error && (
                <div>
                    <p>{error}</p>
                    <button onClick={() => setError('')}>
                    Clear Error
                    </button>
                </div>
            )}

            {isTodoListLoading && <p>Loading...</p>}

            <SortBy 
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortByChange={setSortBy}
            onSortDirectionChange={setSortDirection}
            />
            <TodoForm onAddTodo={addTodo} />
            <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
        </div>
      )
}
export default TodosPage;