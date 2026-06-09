import TodoListItem from "./TodoListItem";
import { useMemo } from "react";

function TodoList({todoList, onCompleteTodo, onUpdateTodo, dataVersion, statusFilter = 'active',}) {
  const filteredTodoList = useMemo(() => {
    console.log(`Recalculating filtered todos (v${dataVersion}) - Status: ${statusFilter}`);

    let filteredTodos;
    switch (statusFilter) {
      case 'completed':
        filteredTodos = todoList.filter((todo) => todo.isCompleted);
        break;
      case 'active':
        filteredTodos = todoList.filter((todo) => !todo.isCompleted);
        break;
      case 'all':
      default:
        filteredTodos = todoList;
        break;
    }

    return {
      version: dataVersion,
      todos: filteredTodos,
    };
  }, [todoList, dataVersion, statusFilter]);

    return(
      filteredTodoList.todos.length === 0 ? <p>Add todo above to get started</p> : 
        (<ul>
          {filteredTodoList.todos.map(todo => (<TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>))}
      </ul>)
    );
}

export default TodoList;
