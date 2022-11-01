import clsx from "clsx";
import styles from './TodoList.module.css'

export default function Todos(props){
    const {details} = props;
    return <div className={clsx(styles["todo-item"], details.done && styles["completed"])} >
        <p>{details.name}</p>
    </div>
}