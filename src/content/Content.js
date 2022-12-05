import React, {useState, useEffect, useMemo} from "react";
import TodoForm from '../TodoForm/TodoForm'
import TodoList from "../TodoList/TodoList";
import Container from "./Container";
import styles from './Content.module.scss'
import clsx from "clsx";
import Button from "../Button/Button";
import {db} from "../firebase.js"
import {collection, writeBatch, addDoc, doc, deleteDoc, onSnapshot, updateDoc, query, where} from "firebase/firestore";



const tabs = [
    {text: 'All', filter: () => true},
    {text: 'Completed', filter: todo => todo.done},
    {text: 'Active', filter: todo => !todo.done},
    {text: 'Created recently', filter: todo => (Date.now() - todo.created) < 1000 * 120}
]

export default function ToDoApp() {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState('');
    const [tab, setTab] = useState(tabs[0]);
    const userId = useMemo(() => (
        new URLSearchParams(window.location.search).get('userId') || Math.random().toString().substring(2)
    ), [])

    useEffect(() => {
        onSnapshot(query(collection(db, "todos"), where('userId', '==', userId)), rawDocs => {
            const docs = rawDocs.docs
                .map((doc) => ({ ...doc.data(), id: doc.id }));
            docs.sort((a, b) => b.created - a.created);
            setTodos(docs);
        })
    }, []);

    function handleFormSubmit(values) {
        if (!values.name) {
            setError("Please enter a title");
            return;
        }
        return addDoc(collection(db, "todos"), {
            name: values.name,
            userId,
            desc: values.desc,
            untilDate: values.untilDate,
            done: false,
            created: Date.now(),
            updated: null,
            completed: null
        }).then(() => {
            if (new URLSearchParams(window.location.search).has('userId')) return;
            window.history.pushState({}, '', '?userId=' + userId)
        });
    }

    const handleChangeBox = id => {
        const found = todos.find(i => i.id === id)
        return handleEdit(id, { done: !found.done })
    };

    const handleDelete = (id) => {
        const reference = doc(db, 'todos', id)
        return deleteDoc(reference)
    }

    const handleEdit = (id, values) => {
        const reference = doc(db, 'todos', id)
        return updateDoc(reference, values)
    }

    const handleDeleteCompleted = () => {
        const batch = writeBatch(db)
        todos
            .filter(todo => todo.done)
            .forEach(todo => {
                const reference = doc(db, 'todos', todo.id)
                batch.delete(reference)
            })
        return batch.commit()
    }
    const itemLeft = todos.filter(todo => !todo.done).length;
    const items = todos.filter(todo => tab.filter(todo))
    return (
        <div className={styles.toDo}>
            <Container>
                <h1 className={styles.toDo__headline}>todos</h1>
                <div className={styles.toDo__content}>
                    <TodoForm
                        onFormSubmit={handleFormSubmit}
                        error={error}
                    />
                    {todos.length === 0 ?
                        <p className={styles.toDo__description}>You don't have any tasks here</p> : null}
                </div>
                <TodoList
                    todos={items}
                    onDelete={handleDelete}
                    onComplete={handleChangeBox}
                    onEdit={handleEdit}
                />
                <div className={styles.toDo__tabs}>
                    <div className={styles.toDo__itemsLeft}>{itemLeft} {plural(itemLeft, 'item', 'items')} left</div>
                    <Tabs
                        onChange={setTab}
                        value={tab}
                        items={tabs}
                    />
                    <Button className={styles.toDo__clear}
                            onClick={handleDeleteCompleted}
                            disabled={itemLeft === todos.length}>Clear completed
                    </Button>
                </div>
            </Container>
        </div>
    )

}


function plural(num, single, multi) {
    return num === 1 ? single : multi
}

const Tabs = (props) => {
    return <>
        {props.items.map(i => (
            <button className={clsx(styles.toDo__tabs__button, props.value === i && styles.toDo__tabs__button__active)}
                    key={i.text} onClick={() => props.onChange(i)}>{i.text}</button>
        ))}
    </>
}





