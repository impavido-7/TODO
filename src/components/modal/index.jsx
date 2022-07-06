import React, { useEffect, useRef, useState } from "react";

import styles from "./index.module.scss";

const Modal = ({ close }) => {

    const ref = useRef(null);

    const saveTask = () => {
        close(ref.current.value)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            saveTask();
        }
    }

    useEffect(() => {
        ref.current.focus();
        if (ref && ref.current) {
            ref.current.addEventListener("keydown", handleKeyDown)
        }
    }, []);

    return (
        <div className={styles.modal} onClick={() => close()}>
            <div className={styles.container} onClick={e => e.stopPropagation()}>

                <div className={styles.header}>
                    <h4 className={styles.title}> Add a new task  </h4>
                </div>

                <div className={styles.bodyContainer}>
                    <div className={styles.body}>
                        <input
                            ref={ref}
                            className={styles.input}
                            type="text"
                            placeholder="Add a new task"
                        />
                    </div>
                    <div className={styles.footer}>
                        <button
                            className={styles.addButton}
                            onClick={saveTask}
                        >
                            Add Item
                        </button>
                        <button
                            className={styles.cancelButton}
                            onClick={() => {
                                close();
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Modal;