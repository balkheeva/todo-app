import React, {useState} from "react";
import Todos from "./Todos";
import IconDelete from "./IconDelete";
import {API_PATH} from './constants'
import TodoForm from "./TodoForm";
import Modal from "./Modal";
import styles from './TodoList.module.css'
import Button from "./Button";


export default function TodoList(props) {
    return (
        <ul className={styles['todo-list']}>
            {props.todos.map(todo => (
                <li key={todo.id}>
                    <ListItem
                        todo={todo}
                        onDelete={() => props.onDelete(todo.id)}
                        onComplete={() => props.onComplete(todo.id)}
                        onEdit={(values) => props.onEdit(todo.id, values)}
                    />
                </li>
            ))}
        </ul>
    )
}

function ListItem(props) {
    const [modalOpen, setModalOpen] = useState(false)
    const {todo} = props
    const handleEdit = (values) => props.onEdit(values).then(() => setModalOpen(false))
    return (
        <>
            <div className={styles.checkbox}>
                <input type="checkbox" onChange={props.onComplete} checked={todo.done}/>
            </div>
            <Todos details={todo}/>
            {todo.fileName && <a href={`${API_PATH}/todos/files/${todo.id}`} target="_blank">Your File</a>}
            <Button onClick={() => setModalOpen(!modalOpen)}>Edit</Button>
            <p className={styles.dateCreated}>{new Date(todo.created).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}</p>
            <p className={styles.dateCreated}>{todo.untilDate}</p>
            <Button onClick={props.onDelete}><IconDelete /></Button>
            {modalOpen && (
                <Modal>
                    <TodoForm onFormSubmit={handleEdit} initialValues={todo} />
                </Modal>
            )}
        </>
    )
}

