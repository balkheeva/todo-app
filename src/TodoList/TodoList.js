import React, {useState} from "react";
import Todos from "./Todos/Todos";
import IconDelete from "../Icons/IconDelete";
import {API_PATH} from '../content/constants'
import TodoForm from "../TodoForm/TodoForm";
import Modal from "../Modal/Modal";
import styles from './TodoList.module.scss'
import IconEdit from "../Icons/IconEdit";
import IconDeadline from "../Icons/IconDeadline"
import attach from '../images/attachments-attach-svgrepo-com.svg'
import clsx from "clsx";
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'

dayjs.extend(calendar)
dayjs.extend(isSameOrBefore)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)

let now = dayjs()

export default function TodoList(props) {
    return (
        <ul className={styles.todoList}>
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
            <button
                className={clsx(styles.btn, styles.todoItem__editIcon)}
                title="Edit todo"
                type="button"
                onClick={() => setModalOpen(!modalOpen)}><IconEdit className={styles.todoItem__icon}/>
            </button>
            {todo.fileName &&
                <a
                    className={styles.todoItem__fileName}
                    title="Open file in a new tab"
                    href={`${API_PATH}/todos/files/${todo.id}`}
                    target="_blank"
                    rel="noreferrer">
                    <img className={styles.todoItem__icon} src={attach}/>{todo.origName}
                </a>}
            <UntilDate todo={todo}/>

            <button
                title="Delete todo"
                type="button"
                className={clsx(styles.todoItem__deleteIcon, styles.btn)}
                onClick={props.onDelete}>
                <IconDelete className={styles.todoItem__icon}/>
            </button>
            {modalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                    <TodoForm
                        onFormSubmit={handleEdit}
                        initialValues={todo}
                    />
                </Modal>
            )}
        </>
    )
}

const UntilDate = (props) => {
    const {todo} = props
    let className = ''
    let text = ''
    let date = dayjs(todo.untilDate)
    if (todo.done) {
        date = dayjs(todo.completed)
        className = styles.untilDate__dateCompleted
        text = 'Completed '
    } else if (date.isSameOrBefore(now) && todo.untilDate) {
        className = styles.untilDate__expired
        text = 'Expired '
    } else if (!date.isSameOrBefore(now) && todo.untilDate) {
        text = 'Expires ' + (date.isToday() || date.isTomorrow() ? '' : 'on ')
    } else return null
    return (
        <div className={clsx(styles.untilDate, className)}>
            <IconDeadline className={styles.todoItem__icon}/>{text}{date.calendar().toLowerCase()}
        </div>
    )
}