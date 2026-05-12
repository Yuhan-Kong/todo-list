import TextInputWithLabel from "../../shared/TextInputWithLabel";
function TodoListItem({ todo, onCompleteTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    return(
        <li>
            <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
            />
            {todo.title}
        </li>
    );
}

export default TodoListItem;