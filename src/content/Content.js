import React, {useState, useEffect} from "react";
import TodoForm from './TodoForm'
import TodoList from "./TodoList";
import Container from "./Container";
import styles from './Content.module.css'
import clsx from "clsx";
import {API_PATH} from "./constants";


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

    function handleFormSubmit(values) {
        const formData = new FormData();
        formData.append('id', values.id);
        formData.append('File', values.file);
        formData.append('name', values.name);
        formData.append('desc', values.desc);
        formData.append('untilDate', values.untilDate);
        if (!values.name) {
            setError("Please enter a name");
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

    function handleDeleteClick(id) {
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
    return <>
        <div className={styles['to-do']}>
            <Container>
                <h1 className={styles.headline}>todos</h1>
                <div className={styles.content}>
                    <TodoForm
                        onFormSubmit={handleFormSubmit}
                        error={error}
                    />
                    {itemLeft ===0 && <p>You don't have any task here</p>}
                    <TodoList
                        todos={items}
                        onDelete={handleDeleteClick}
                        onComplete={handleChangeBox}
                        onEdit={handleEdit}
                    />

                </div>

                <div className={styles.tabs}>
                    <div className={styles.itemsLeft}>{itemLeft} {plural(itemLeft, 'item', 'items')} left</div>
                    <Tabs onChange={setTab} value={tab} items={tabs}/>

                    <button className={styles.clear} onClick={handleDeleteCompleted} type="button">Clear completed</button>
                </div>


            </Container>
        </div>

    </>
}

function plural(num, single, multi) {
    return num === 1 ? single : multi
}

const Tabs = (props) => {
    return <>
        {props.items.map(i => (
            <button className={clsx(styles['tabs-button'], props.value === i && styles['tabs-button-active'])}
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


