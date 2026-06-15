import { useState } from "react";
import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    function handleCancel() {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    }

    function handleEdit(event) {
        setWorkingTitle(event.target.value);
    }

    function handleUpdate(event) {
        if(!isEditing) return;
        event.preventDefault();
        onUpdateTodo({
            ...todo,
            title: workingTitle,
        });
        setIsEditing(false);
    }
    return (
        <li className={styles.item}>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <div className={styles.editForm}>
                        <TextInputWithLabel
                            value={workingTitle}
                            onChange={handleEdit}
                            elementId={`todoTitle-${todo.id}`}
                            labelText="Todo"
                        />
                        <button type="button" onClick={handleCancel} className={styles.cancelButton}>Cancel</button> 
                        <button type="button" onClick={handleUpdate} disabled={!isValidTodoTitle(workingTitle)} className={styles.updateButton}>Update</button>
                    </div>
                ) : (
                    <div className={styles.display}>
                        <input
                            type="checkbox"
                            checked={todo.isCompleted}
                            onChange={() => onCompleteTodo(todo.id)}
                            className={styles.checkbox}
                        />
                        <span
                            onClick={() => setIsEditing(true)}
                            className={`${styles.title} ${todo.isCompleted ? styles.completed : ''}`}
                        >
                            {todo.title}
                        </span>
                    </div>
                )}
            </form>
            
        </li>
    );
}

export default TodoListItem;