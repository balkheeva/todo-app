import clsx from "clsx"
import styles from "./Button.module.scss"


export default function Button(props) {
    return <button className={clsx(styles.root, props.isSecondary ? styles.secondary : styles.primary, props.className)} onClick={props.onClick} type="button">{props.children}</button>
}