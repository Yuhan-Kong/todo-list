import { useState, useEffect, useCallback, useReducer } from "react";
import { todoReducer, initialTodoState, TODO_ACTIONS } from "../../reducers/todoReducers";
import useDebounce from "../../utils/useDebounce";
import FilterInput from "../../shared/FilterInput";
import SortBy from "../../shared/SortBy";
import TodoForm from "./TodoForm";
import TodoList from './TodoList/TodoList';


function TodosPage({ token }) {
    const [state, dispatch] = useReducer(todoReducer, initialTodoState);
    const {
      todoList,
      error,
      filterError,
      isTodoListLoading,
      sortBy,
      sortDirection,
      filterTerm,
      dataVersion,
    } = state;
    const debouncedFilterTerm = useDebounce(filterTerm, 300);

    useEffect(() => {
      async function fetchTodos() {
        try {
          dispatch({ type: TODO_ACTIONS.FETCH_START });
      
          const paramsObject = {
            sortBy,
            sortDirection,
            isCompleted: false,
            limit: 100,
          };
      
          if (debouncedFilterTerm) {
            paramsObject.find = debouncedFilterTerm;
          }
      
          const params = new URLSearchParams(paramsObject);
      
          const response = await fetch(`/api/tasks?${params}`, {
            method: 'GET',
            headers: {
              'X-CSRF-TOKEN': token,
            },
            credentials: 'include',
          });
      
          if (response.status === 401) {
            throw new Error('unauthorized');
          }
      
          if (!response.ok) {
            throw new Error('error');
          }
      
          const data = await response.json();
      
          dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: {
              tasks: data.tasks,
            },
          });
      
        } catch (error) {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message: error.message,
              isFilterError:
                debouncedFilterTerm ||
                sortBy !== 'createdAt' ||
                sortDirection !== 'desc',
            },
          });
        }
      }
        fetchTodos()
      }, [token, sortBy, sortDirection, debouncedFilterTerm])

      async function addTodo(todoTitle) {
        const newTodo = {
          id: Date.now(),
          title: todoTitle,
          isCompleted: false,
        };
      
        dispatch({
          type: TODO_ACTIONS.ADD_TODO_START,
          payload: {
            id: newTodo.id,
            title: newTodo.title,
          },
        });
      
        try {
          const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': token,
            },
            credentials: 'include',
            body: JSON.stringify({
              title: todoTitle,
              isCompleted: false,
            }),
          });
      
          if (!response.ok) {
            throw new Error('error');
          }
      
          const data = await response.json();
      
          dispatch({
            type: TODO_ACTIONS.ADD_TODO_SUCCESS,
            payload: {
              tempId: newTodo.id,
              todo: data,
            },
          });
      
        } catch (err) {
          dispatch({
            type: TODO_ACTIONS.ADD_TODO_ERROR,
            payload: {
              message: err.message,
              tempId: newTodo.id,
            },
          });
        }
      }

      async function completeTodo(id) {
        const originalTodo = todoList.find(todo => todo.id === id);
      
        dispatch({
          type: TODO_ACTIONS.COMPLETE_TODO_START,
          payload: {
            id,
          },
        });
      
        try {
          const response = await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': token,
            },
            credentials: 'include',
            body: JSON.stringify({
              isCompleted: true,
            }),
          });
      
          if (!response.ok) {
            throw new Error('error');
          }
      
          const data = await response.json();
      
          dispatch({
            type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
            payload: {
              todo: data,
            },
          });
      
        } catch (err) {
          dispatch({
            type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
            payload: {
              message: err.message,
              id,
              originalTodo,
            },
          });
        }
      }
      
      async function updateTodo(editedTodo) {
        const originalTodo = todoList.find(
          todo => todo.id === editedTodo.id
        );
      
        try {
          setTodoList(prev =>
            prev.map(todo => {
              if (todo.id === editedTodo.id) {
                return { ...editedTodo };
              } else {
                return todo;
              }
            })
          );
      
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
          });
      
          if (!response.ok) {
            throw new Error('error');
          }

          invalidateCache();
      
        } catch (err) {
          setError(err.message);
      
          setTodoList(prev =>
            prev.map(todo => {
              if (todo.id === editedTodo.id) {
                return originalTodo;
              } else {
                return todo;
              }
            })
          );
        }
      }
      const handleSortByChange = (value) => {
        setSortBy(value);
      };

      const handleSortDirectionChange = (value) => {
        setSortDirection(value);
      };

      const handleFilterChange = (newTerm) => {
        setFilterTerm(newTerm);
      };

      const invalidateCache = useCallback(() => {
        setDataVersion(prev => prev + 1);
      }, []);
      
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

            {filterError && (
              <div>
                <p>{filterError}</p>
                <button onClick={() => setFilterError('')}>
                  Clear Filter Error
                </button>
                <button
                  onClick={() => {
                    setFilterTerm('');
                    setSortBy('createdAt');
                    setSortDirection('desc');
                    setFilterError('');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}

            {isTodoListLoading && <p>Loading...</p>}

            <SortBy 
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortByChange={handleSortByChange}
            onSortDirectionChange={handleSortDirectionChange}
            />
            <FilterInput
              filterTerm={filterTerm}
              onFilterChange={handleFilterChange}
            />
            <TodoForm onAddTodo={addTodo} />
            <TodoList 
              todoList={todoList} 
              onCompleteTodo={completeTodo} 
              onUpdateTodo={updateTodo} 
              dataVersion={dataVersion}
            />
        </div>
      )
}
export default TodosPage;
