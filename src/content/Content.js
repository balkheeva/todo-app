import React, {useState, useEffect} from "react";
import TodoForm from '../TodoForm/TodoForm'
import TodoList from "../TodoList/TodoList";
import Container from "./Container";
import styles from './Content.module.scss'
import clsx from "clsx";
import {API_PATH} from "./constants";
import Button from "../Button/Button";

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

    useEffect(() => {
        get(API_PATH + '/todos')
            .then(data => setTodos(data))
    }, []);

    const handleFormSubmit = (values) => {
        const formData = new FormData();
        formData.append('id', values.id);
        formData.append('File', values.file);
        formData.append('name', values.name);
        formData.append('desc', values.desc);
        formData.append('untilDate', values.untilDate);
        if (!values.name) {
            setError("Please enter a title");
            return;
        }
        const url = values.id ? API_PATH + '/todos/edit' : API_PATH + '/todos/create-with-file'
        return postForm(url, formData)
            .then(data => {
                setTodos(data);
                console.log(data)
                if (error) setError('')
            });
    }

    const handleChangeBox = id => {
        post(API_PATH + '/todos/complete', {id})
            .then(data => {
                setTodos(data);
            });
    };

    const handleEdit = (id, values) => {
        return handleFormSubmit({...values, id})
    };

    const handleDeleteClick = (id) => {
        post(API_PATH + '/todos/delete', {id})
            .then(data => {
                setTodos(data);
            });
    }

    const handleDeleteCompleted = () => {
        post(API_PATH + '/todos/clear-completed')
            .then(data => {
                setTodos(data);
            });
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
                    onDelete={handleDeleteClick}
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

function post(url, data = {}) {
    return fetch(url, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
}

function postForm(url, formData) {
    return fetch(url, {
        method: 'post',
        body: formData,
    })
        .then(response => response.json())
}

function get(url) {
    return fetch(url)
        .then(response => response.json())
}


