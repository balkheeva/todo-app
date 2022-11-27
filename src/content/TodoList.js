import React, {useState} from "react";
import Todos from "./Todos";
import IconDelete from "./IconDelete";
import {API_PATH} from './constants'
import TodoForm from "./TodoForm";
import Modal from "./Modal";
import styles from './TodoList.module.css'
import Button from "./Button";
import IconEdit from "./IconEdit";


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
            {todo.fileName && <a href={`${API_PATH}/todos/files/${todo.id}`} target="_blank">{todo.origName}</a>}
            <button className={styles.btn} onClick={() => setModalOpen(!modalOpen)}><IconEdit/></button>
            <span className={styles.dateCreated}>{new Date(todo.created).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}</span>
            {todo.updated && <span className={styles.dateCreated}>{new Date(todo.updated).toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit'
            })}</span>}
            {todo.untilDate && <span className={styles.dateCreated}>{todo.untilDate}</span>}
            <button className={styles.btn} onClick={props.onDelete}><IconDelete /></button>
            {modalOpen && (
                <Modal>
                    <TodoForm onFormSubmit={handleEdit} initialValues={todo} />
                </Modal>
            )}
        </>
    )
}

