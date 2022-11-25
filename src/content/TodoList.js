import Todos from "./Todos";
import IconDelete from "./IconDelete";
import styles from './TodoList.module.css'

export default function TodoList(props) {
    return <>
        <ul className={styles['todo-list']}>
            {props.todos.map(todo => <li key={todo.id}>
                <div className={styles.checkbox}>
                    <input type="checkbox" onChange={() => props.onCheckClick(todo.id)} checked={todo.done}/>
                </div>
                <Todos details={todo} />
                <p className={styles.dateCreated}>{new Date(todo.created).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <button onClick={() => props.onEditClick(todo)}>Edit</button>
                <button className={styles.btn} onClick={() => props.onDeleteClick(todo.id)}><IconDelete /></button>
            </li>)}
        </ul>
    </>
}

