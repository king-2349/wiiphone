import React from "react";
import "./style.css";

export default function ControllerButton(props) {
    return (
        <div 
            className={"controllerButton "+(props.pressed ? "controllerButtonActive " : "")+(props.round ? "controllerButtonRound " : "")}
            onTouchStart={() => {props.buttonPressed()}} 
            onTouchEnd={() => {props.buttonReleased()}} 
        >
            {props.buttonDisplay}
        </div>
    )
}