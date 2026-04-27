import { useRef } from "react";
function TodoForm({ onAddTodo }) {
    const inputRef = useRef();

    const handleAddTodo = (event) => {
        event.preventDefault();
    };
    return(
        <form>
            <label htmlFor="todoTitle">Todo</label>
            <input type="text" id="todoTitle" />
            <button type="submit" disabled>Add Todo</button>
        </form>
    );
}
export default TodoForm;