import styles from './TodoForm.module.css'
import clsx from "clsx";

export default function TodoForm(props) {
    return <>
        <form  onSubmit={props.onFormSubmit}>
            {/*<label htmlFor="todo">Enter To do: </label>*/}
            <input
                className={clsx(props.error && styles.placeholderError, styles.textfield)}
                type="text" id="todo"
                value={props.name}
                onChange={props.onNameChange}
                placeholder={props.error || 'What needs to be done?'}
            />
            {/*<input className={styles.btn} type="submit" value="Add todo" />*/}
        </form>
    </>
}