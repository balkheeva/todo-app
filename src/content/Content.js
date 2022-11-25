import React, {useState, useEffect} from "react";
import TodoForm from './TodoForm'
import TodoList from "./TodoList";
import Container from "./Container";
import styles from './Content.module.css'
import clsx from "clsx";
import Button from "./Button";


const tabs = [
    {text: 'All', filter: () => true},
    {text: 'Completed', filter: todo => todo.done},
    {text: 'Active', filter: todo => !todo.done},
    {text: 'Created recently', filter: todo => (Date.now() - todo.created) < 1000 * 10}
]


export default function ToDoApp() {
    const [todos, setTodos] = useState([]);
    const [values, setValues] = useState({name: '', desc: '', file: ''});
    const [error, setError] = useState('');
    const [tab, setTab] = useState(tabs[0]);

    useEffect(() => {
        get('http://localhost:8080/todos')
            .then(data => setTodos(data))
    }, []);

    function handleFormSubmit(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('File', values.file);
        formData.append('name', values.name);
        formData.append('desc', values.desc);
        if (!values.name) {
            setError("Please enter a name");
            return;
        }
        postForm('http://localhost:8080/todos/create-with-file', formData)
            .then(data => {
                setTodos(data);
                console.log(data)
                setValues({name: '', desc: '', file: null})
                if (error) setError('')
            });
    }

    function handleChange(data) {
        setValues({...values, ...data});
    }

    const handleChangeBox = id => {
        post('http://localhost:8080/todos/complete', {id})
            .then(data => {
                setTodos(data);
            });
    };


    function handleDeleteClick(id) {
        post('http://localhost:8080/todos/delete', {id})
            .then(data => {
                setTodos(data);
            });
    }

    const handleDeleteCompleted = () => {
        post('http://localhost:8080/todos/clear-completed')
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
                        onChange={handleChange}
                        values={values}
                        error={error}
                    />
                    {/*<div className={styles.tips}>{todos.length === 0 && <p>Add your first todo</p>}</div>*/}
                    <TodoList
                        todos={items}
                        onDeleteClick={handleDeleteClick}
                        onCheckClick={handleChangeBox}
                    />
                </div>

                <div className={styles.tabs}>
                    <div className={styles.itemsLeft}>{itemLeft} {plural(itemLeft, 'item', 'items')} left</div>
                    <Tabs onChange={setTab} value={tab} items={tabs}/>

                    <button className={styles.clear} onClick={handleDeleteCompleted}>Clear completed</button>
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


