import React, { useRef, useState } from 'react';
import { Check } from 'lucide-react';
import './CheckboxDemo.scss';
import { uniqueId } from 'lodash';
import useClickOutside from '@utils/customHooks/useClickOutside';

const ChecklistItem = ({
    checked = false,
    onChange,
    label = '',
}) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        if (onChange) {
            onChange(!checked);
        }

        // Reset click animation after a short delay
        setTimeout(() => {
            setIsClicked(false);
        }, 200);
    };

    return (
        <div className="checkbox-container">
            <div
                onClick={handleClick}
                className={`
          checkbox 
          ${checked ? 'checkbox--checked' : ''}
          ${isClicked ? 'checkbox--clicked' : ''}
        `}
            >
                <Check

                    size={14}
                    className={`checkbox__icon ${checked ? 'checkbox__icon--visible' : ''}`}
                    strokeWidth={3}
                />

                {/* {isClicked && (
                    <div className="checkbox__ripple" />
                )} */}
            </div>
            {label && (
                <span
                    onClick={handleClick}
                    className={`checkbox__label ${checked ? 'checkbox__label--completed' : ''}`}
                >
                    {label}
                </span>
            )}
        </div>
    );
};

// Demo component with 2-3 checkboxes
const Checklist = ({ checklist, onChange }) => {
    const [tasks, setTasks] = useState(checklist);
    const [isAdd, setIsAdd] = useState(false)
    const [newTask, setNewTask] = useState('')
    const wrapperRef = useRef(null)
    const inputRef = useRef(null)

    useClickOutside({
        ref: wrapperRef,
        callback: () => {
            setNewTask('');
            setIsAdd(false)
        },
        active: isAdd
    })


    const handleTaskChange = (id, checked) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, checked } : task
        );
        setTasks(updatedTasks);
        onChange && onChange(updatedTasks);
    };

    const handleAddTask = () => {
        if (!newTask.trim()) return;
        const newItem = {
            id: "column-" + uniqueId(),
            text: newTask.trim(),
            checked: false
        };
        const updatedTasks = [...tasks, newItem];
        setTasks(updatedTasks);
        onChange && onChange(updatedTasks);
        setNewTask('');
        setIsAdd(true);
        setTimeout(() => inputRef.current?.focus(), 0)

    };

    const completedCount = tasks.filter(task => task.checked).length;

    return (
        <>
            <div className="body-section">
                <label className="title-label ">
                    Checklist
                </label>

                <div className="progress-section">
                    <div className="progress-bar">
                        <div
                            className="progress-bar__fill"
                            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                        />
                    </div>
                    <div className="progress-info">
                        <span>Progress:</span>
                        <span className="progress-count">{completedCount}/{tasks.length} completed</span>
                    </div>
                </div>

                <div className="tasks-list">
                    {tasks.map(task => (
                        <ChecklistItem
                            key={task.id}
                            id={`task-${task.id}`}
                            checked={task.checked}
                            onChange={(checked) => handleTaskChange(task.id, checked)}
                            label={task.text}
                        />
                    ))}
                </div>
                {isAdd ?
                    <div className='form-add' ref={wrapperRef}>
                        <input className='form-add-input'
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Enter new task..."
                            autoFocus
                            ref={inputRef}
                        />

                        <div className='form-add-btn'>
                            <button className='btn-form addform' onClick={handleAddTask}>Add</button>
                            <button className='btn-form canformm' onClick={() => {
                                setNewTask('');
                                setIsAdd(false)
                            }}>Cancel</button>
                        </div>
                    </div>
                    :
                    <div className='form-add'>
                        <div className='form-add-btn'>
                            <button className='btn-form addEdit' onClick={() => setIsAdd(true)}>Add an item</button>
                        </div>
                    </div>
                }



            </div>
        </>
    );
};

export default Checklist;