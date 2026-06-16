import { forwardRef } from "react";
import styles from './TextInputWithLabel.module.css';

const TextInputWithLabel = forwardRef(function TextInputWithLabel(
  { elementId, labelText, onChange, value },
  ref
) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={elementId} className={styles.label}>{labelText}</label>
      <input
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
        className={styles.input}
      />
    </div>
  );
});

export default TextInputWithLabel;