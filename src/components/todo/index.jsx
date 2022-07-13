import React, { useEffect, useState } from "react";

// Import styles
import styles from "./style/index.module.scss";

// Import icons
import deleteImage from "../icons/delete.svg";

// Import components
import Modal from "../modal";

// import taskData from "./dummyData.json";

const Todo = ({ taskData }) => {

    const [data, setData] = useState(taskData);
    const [showModal, setShowModal] = useState(false);

    const deleteEntry = (id) => {
        const index = data.findIndex(item => item.id === id);
        const dummy = [...data];
        dummy.splice(index, 1);
        setData([...dummy]);
    }

    const showTheModal = () => {
        setShowModal(true);
    }

    const closeModal = (newTask) => {
        setShowModal(false);
        if (typeof (newTask) === 'string' && newTask.length === 0) {
            window.electronApi.send("task-empty", "Task created is empty");
        }
        else if (newTask) {
            const newEntry = {
                id: data.length ? data[0].id + 1 : 1,
                task: newTask,
                checked: false
            }
            const dummy = [...data];
            dummy.unshift(newEntry);
            setData([...dummy]);
        }
    }

    const checkboxClicked = (id) => {
        const index = data.findIndex(item => item.id === id);
        const dummy = [...data];
        dummy[index].checked = !dummy[index].checked;
        setData([...dummy]);
    }

    // When Ctrl + N clicked to add a new item
    const getValue = (args) => {
        setShowModal(true);
    }

    const strikeThrough = (id) => {
        const index = data.findIndex(item => item.id === id);
        return {
            textDecoration: data[index].checked ? "line-through" : "none"
        }
    }

    window.electronApi.receive("add-new-item", getValue);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(data));
    }, [JSON.stringify(data)])

    return (

        <>
            {data.length === 0 ?

                <div className={`${styles.noResults}`}>
                    <p> No tasks present </p>
                    <button title="Add a new task" className={styles.button} onClick={showTheModal}> + </button>
                </div>

                :

                <div className={styles.container}>
                    {data.map(item => {
                        return (
                            <div className={styles.items} key={(item.id).toString()}>
                                <label className={styles.label}>
                                    <input
                                        className={styles.input}
                                        type="checkbox"
                                        defaultChecked={item.checked}
                                        onChange={() => checkboxClicked(item.id)}
                                    />
                                    <span className={styles.checkbox}></span>
                                </label>
                                <span className={styles.content} style={strikeThrough(item.id)}> {item.task} </span>
                                <img src={deleteImage} className={styles.image} onClick={() => deleteEntry(item.id)} />
                            </div>
                        )
                    })}
                </div>
            }

            <button title="Add a new task" className={styles.button} onClick={showTheModal}> + </button>

            {showModal && <Modal close={closeModal} />}

        </>


    )
}

export default Todo;