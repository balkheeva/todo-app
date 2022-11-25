import React from "react";


export default function Modal(props) {
    return <div style={{position: 'absolute', zIndex: 10}}>{props.children}</div>
}