import React, { useState } from 'react';
import { Check } from 'lucide-react';
import './CheckboxDemo.scss';

const TrelloCheckbox = ({
    checked = false,
    onChange,
    label = '',
    id = ''
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

                {/* Ripple effect on click */}
                {isClicked && (
                    <div className="checkbox__ripple" />
                )}
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
const CheckboxDemo = () => {
    const [tasks, setTasks] = useState([
        { id: 1, text: "Complete project documentation", checked: false },
        { id: 2, text: "Review code changes", checked: false },
        { id: 3, text: "Update team on progress", checked: false }
    ]);

    const handleTaskChange = (id, checked) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, checked } : task
            )
        );
    };

    const completedCount = tasks.filter(task => task.checked).length;

    return (
        <div className="demo-container">
            <h2 className="demo-title">
                Tasks to Complete
            </h2>

            <div className="tasks-list">
                {tasks.map(task => (
                    <TrelloCheckbox
                        key={task.id}
                        id={`task-${task.id}`}
                        checked={task.checked}
                        onChange={(checked) => handleTaskChange(task.id, checked)}
                        label={task.text}
                    />
                ))}
            </div>

            <div className="progress-section">
                <div className="progress-info">
                    <span>Progress:</span>
                    <span className="progress-count">{completedCount}/{tasks.length} completed</span>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-bar__fill"
                        style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CheckboxDemo;