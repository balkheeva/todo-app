import React, {useState, useEffect} from "react";
import TodoForm from './TodoForm'
import TodoList from "./TodoList";
import Container from "./Container";
import styles from './Content.module.css'
import clsx from "clsx";


const tabs = [
    {text: 'All', filter: () => true},
    {text: 'Completed', filter: todo => todo.done},
    {text: 'Active', filter: todo => !todo.done},
    {text: 'Created recently', filter: todo => (Date.now() - todo.created) < 1000 * 10}
]

export default function ToDoApp() {
    const [todos, setTodos] = useState(() => {
        const items = localStorage.getItem("todos");
        return items ? JSON.parse(items) : [];
    });
    const [name, setName] = useState("");
    const [error, setError] = useState('');
    const [tab, setTab] = useState(tabs[0]);

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    function handleFormSubmit(event) {
        event.preventDefault();
        if (!name) {
            setError("Please enter a name");
            return;
        }
        setTodos([...todos, {
            id: Math.random() + '',
            name,
            done: false,
            created: Date.now(),
            updated: null
        }]);
        setName("");
        if (error) setError('')
    }

    function handleNameChange(event) {
        setName(event.target.value);
    }

    const handleChangeBox = id => {
        setTodos(todos.map(el => el.id === id ? {...el, done: !el.done, updated: Date.now()} : el));
    };

    function handleDeleteClick(id) {
        setTodos(todos.filter(todo => todo.id !== id));
    }

    const handleDeleteCompleted = () => {
        setTodos(todos.filter(todo => !todo.done));
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
                            onNameChange={handleNameChange}
                            name={name}
                            error={error}
                        />
                        {/*<div className={styles.tips}>{todos.length === 0 && <p>Add your first todo</p>}</div>*/}
                        <TodoList
                            todos={items.reverse()}
                            onDeleteClick={handleDeleteClick}
                            onCheckClick={handleChangeBox}
                        />
                    </div>

                    <div className={styles.tabs}>
                        <div className={styles.itemsLeft}>{itemLeft} {plural(itemLeft, 'item', 'items')} left</div>
                        <Tabs  onChange={setTab} value={tab} items={tabs}/>

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
            <button className={clsx(styles['tabs-button'], props.value === i && styles['tabs-button-active'])} key={i.text} onClick={() => props.onChange(i)}>{i.text}</button>
        ))}
    </>
}


