import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaClipboardList, FaClock } from 'react-icons/fa'
import './LayoutScss/Sidebar.scss'

const Sidebar = () => {
    return (
        <div className="sidebar">
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaClipboardList /> <span>Boards</span>
            </NavLink>

            <NavLink to="/pomodoro" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaClock /> <span>Pomodoro</span>
            </NavLink>

        </div>
    )
}

export default Sidebar
