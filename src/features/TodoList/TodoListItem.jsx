import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
function TodoListItem({ todo, onCompleteTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <li>
            {isEditing ? (
                <TextInputWithLabel
                    value={todo.title}
                />
            ) : (
                <>
                    <input
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={() => onCompleteTodo(todo.id)}
                    />
                    <span>
                        {todo.title}
                    </span>
                </>
            )}
        </li>
    );
}

export default TodoListItem;