import styles from "./Container.module.scss"
export default function Container(props){
    return <div className={styles.myContainer}>{props.children}</div>
}