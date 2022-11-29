import {useCallback, useState} from "react";
import clsx from "clsx";
import styles from './TodoForm.module.scss'
import Button from "./Button";
import attach from '../images/attachments-attach-svgrepo-com.svg'

const initialValues = {name: '', desc: '', file: '', untilDate: '', origName: ''}

export default function TodoForm(props) {
    const [values, setValues] = useState(props.initialValues || initialValues);

    const handleEnter = (e) => {
        if (e.key === 'Enter') handleSubmit()
    }
    const handleChange = data => {
        setValues({...values, ...data})
    }
    const handleSubmit = () => props.onFormSubmit(values).then(() => setValues(initialValues))

    return <>
        <form onKeyPress={handleEnter}>
            <label className={styles.labelText} htmlFor='name'>Add title</label>
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
                <label className={styles.inputFile}>
                    <span className={styles.inputFile__text} type="text">{values.origName}</span>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={e => handleChange({file: e.target.files[0], origName: e.target.files[0].name})}
                    />
                    <span className={styles.inputFile__btn}><img src={attach}/>Choose a file</span>
                </label>

            <Button onClick={handleSubmit} className={styles.btnLocation} type="button">Add</Button>
        </form>
    </>
}

function Input(props) {
    const {onChange, name, values, type} = props;
    const handleChange = useCallback(e => {
        onChange({[name]: e.target.value})
    }, [name, onChange]);

    return (
        <input
            className={clsx(props.error && styles.placeholderError, styles.textfield)}
            type={type || 'text'}
            id={props.name}
            value={values[name]}
            onChange={handleChange}
            placeholder={props.error || props.description}
        />
    )
}