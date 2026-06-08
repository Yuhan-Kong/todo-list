import { useState, useEffect, useCallback, useReducer } from "react";
import { todoReducer, initialTodoState, TODO_ACTIONS } from "../reducers/todoReducer";
import useDebounce from "../utils/useDebounce";
import FilterInput from "../shared/FilterInput";
import SortBy from "../shared/SortBy";
import TodoForm from "../features/Todos/TodoForm";
import TodoList from '../features/Todos/TodoList/TodoList';
import { useAuth } from "../contexts/AuthContext";


function TodosPage() {
    const { token } = useAuth();
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
      
        dispatch({
          type: TODO_ACTIONS.UPDATE_TODO_START,
          payload: {
            id: editedTodo.id,
            editedTodo,
          },
        });
      
        try {
          const response = await fetch(`/api/tasks/${editedTodo.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': token,
            },
            credentials: 'include',
            body: JSON.stringify({
              title: editedTodo.title,
              isCompleted: editedTodo.isCompleted,
            }),
          });
      
          if (!response.ok) {
            throw new Error('error');
          }
      
          const data = await response.json();
      
          dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
            payload: {
              todo: data,
            },
          });
      
        } catch (err) {
          dispatch({
            type: TODO_ACTIONS.UPDATE_TODO_ERROR,
            payload: {
              message: err.message,
              id: editedTodo.id,
              originalTodo,
            },
          });
        }
      }
      const handleSortByChange = (value) => {
        dispatch({
          type: TODO_ACTIONS.SET_SORT,
          payload: {
            sortBy: value,
            sortDirection,
          },
        });
      };

      const handleSortDirectionChange = (value) => {
        dispatch({
          type: TODO_ACTIONS.SET_SORT,
          payload: {
            sortBy,
            sortDirection: value,
          },
        });
      };

      const handleFilterChange = (newTerm) => {
        dispatch({
          type: TODO_ACTIONS.SET_FILTER,
          payload: {
            filterTerm: newTerm,
          },
        });
      };

      
      return (
        <div>
            {error && (
                <div>
                    <p>{error}</p>
                    <button
                      onClick={() =>
                        dispatch({
                          type: TODO_ACTIONS.CLEAR_ERROR,
                        })
                      }
                    >
                    Clear Error
                    </button>
                </div>
            )}

            {filterError && (
              <div>
                <p>{filterError}</p>
                <button
                  onClick={() =>
                    dispatch({
                      type: TODO_ACTIONS.CLEAR_FILTER_ERROR,
                    })
                  }
                >
                  Clear Filter Error
                </button>
                <button
                  onClick={() =>
                    dispatch({
                      type: TODO_ACTIONS.RESET_FILTERS,
                    })
                  }
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
