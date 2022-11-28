import React, {useEffect} from "react";
import {createPortal} from "react-dom";
import styles from "./Modal.module.scss"

export default function Modal(props) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])
    return createPortal(
        <div className={styles.overlay}>
            <div className={styles.content}>{props.children}</div>
            <div className={styles.background} onClick={props.onClose} />
        </div>,
        document.body
    )
}