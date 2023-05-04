import {responseRequest} from "../models";
import React from "react";

interface Props {
    FirstValue: string;
    SecondValue: string;
    showForm: boolean;
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;

}

export const SwitchTab: React.FC<Props> = ({FirstValue, SecondValue, showForm, setShowForm}) => {

    return (
        <div className="tabs">
            <div
                className={`w-1/2 tab tab-lg tab-lifted ${showForm ? "tab-active" : ""}`}
                onClick={() => {
                    setShowForm(true)
                }}
            >
                {FirstValue}
            </div>
            <div
                className={`w-1/2 tab tab-lg tab-lifted ${showForm ? "" : "tab-active"}`}
                onClick={() => {
                    setShowForm(false)
                }}
            >
                {SecondValue}
            </div>
        </div>
    )
}