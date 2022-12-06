import {useCallback, useState} from "react";
import clsx from "clsx";
import styles from './TodoForm.module.scss'
import Button from "../Button/Button";
import attach from '../images/attachments-attach-svgrepo-com.svg'

const initialValues = {name: '', desc: '', file: '', untilDate: ''}

export default function TodoForm(props) {
    const [values, setValues] = useState(props.initialValues || initialValues);
    const handleEnter = (e) => {
        if (e.key === 'Enter') handleSubmit()
    }
    const handleChange = data => {
        setValues({...values, ...data})
    }
    const handleSubmit = () => props.onFormSubmit(values).then(() => setValues(initialValues))

    return (
        <form className={styles.todoForm} onKeyPress={handleEnter}>
            <label className={styles.todoForm__labelText} htmlFor='name'>Add title</label>
            <Input
                placeholder="Add title"
                name="name"
                values={values}
                onChange={handleChange}
                error={props.error}
            />
            <label htmlFor="desc">Add description</label>
            <Input
                placeholder="Add description"
                name="desc"
                values={values}
                onChange={handleChange}
            />
            <label htmlFor="untilDate">End date:</label>
            <Input
                name="untilDate"
                type="datetime-local"
                values={values}
                onChange={handleChange}
            />

            <Button onClick={handleSubmit} className={styles.btnLocation} type="button">Add</Button>
        </form>
    )
}

function Input(props) {
    const {onChange, name, values, type} = props;
    const handleChange = useCallback(e => {
        onChange({[name]: e.target.value})
    }, [name, onChange]);

    return (
        <input
            className={clsx(props.error && styles.todoForm__placeholderError, styles.todoForm__textfield)}
            type={type || 'text'}
            id={props.name}
            value={values[name]}
            onChange={handleChange}
            placeholder={props.error || props.description}
        />
    )
}
