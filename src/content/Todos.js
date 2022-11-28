import clsx from "clsx";
import styles from './TodoList.module.scss'

export default function Todos(props){
    const {details} = props;

    return (
        <div className={clsx(styles.todoItem, details.done && styles.todoItem__completed)} >
            <p className={styles.todoItem__title}>{details.name}</p>
            <p className={styles.todoItem__desc}>{details.desc}</p>
        </div>
    )
}