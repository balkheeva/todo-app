import {useCallback, useState} from "react";
import clsx from "clsx";
import styles from './TodoForm.module.scss'
import Button from "../Button/Button";

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
            <InputText
                placeholder="Add title"
                name="name"
                values={values}
                onChange={handleChange}
                error={props.error}
            />
            <label htmlFor="desc">Add description</label>
            <InputText
                placeholder="Add description"
                name="desc"
                values={values}
                onChange={handleChange}
            />
            <label htmlFor="untilDate">End date:</label>
            <input
                className={clsx(props.error && styles.todoForm__placeholderError, styles.todoForm__textfield)}
                name="untilDate"
                type="datetime-local"
                onChange={(e) => handleChange({untilDate: e.target.value})}
            />

            <Button onClick={handleSubmit} className={styles.btnLocation} type="button">Add</Button>
        </form>
    )
}

function InputText(props) {
    const {onChange, name, values, type} = props;
    const [height, setHeight] = useState('')
    const handleChange = useCallback(e => {
        onChange({[name]: e.target.value})
        const scrollHeight = e.target.scrollHeight
        setHeight(scrollHeight)
    }, [name, onChange]);

    return (
        <textarea className={clsx(props.error && styles.todoForm__placeholderError, styles.todoForm__textfield)}
                  type='text'
                  rows="1"
                  style = {{height: height + 'px'}}
                  id={props.name}
                  value={values[name]}
                  onChange={handleChange}
                  placeholder={props.error || props.description}
        />
    )
}
