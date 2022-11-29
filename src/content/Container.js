import styles from "./Container.module.scss"

/**
 * Wraps children elements to a container
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function Container(props){
    return <div className={styles.myContainer}>{props.children}</div>
}