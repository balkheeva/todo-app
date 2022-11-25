import styles from './TodoForm.module.css'
import clsx from "clsx";
import {useCallback} from "react";

export default function TodoForm(props) {
    const handleEnter = (e) => {
        if (e.key === 'Enter') props.onFormSubmit(e)
    }
    return <>
        <form onKeyPress={handleEnter}>
            <label>Add title</label>
            <Input
                id="name"
                placeholder="Add title"
                name="name"
                values={props.values}
                onChange={props.onChange}
                error={props.error}
            />
            <label>Add description</label>
            <Input
                id="description"
                placeholder="Add description"
                name="desc"
                values={props.values}
                onChange={props.onChange}
            />
            <label>Choose a file:</label>
            <input
                type="file"
                id="file"
                name="file"
                onChange={e => props.onChange({file: e.target.files[0]})}
            />
            <button onClick={props.onFormSubmit}>Add</button>
        </form>
    </>
}

function Input(props) {
    const {onChange, name} = props;

    const handleChange = useCallback(e => {
        onChange({[name]: e.target.value})
    }, [name, onChange]);

    return (
        <input
            className={clsx(props.error && styles.placeholderError, styles.textfield)}
            type="text"
            id={props.id}
            value={props.values[name]}
            onChange={handleChange}
            placeholder={props.error || props.description}
        />
    )
}