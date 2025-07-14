
import React from 'react'
import './ListBoardScss/ListBoard.scss'
import WorkspaceSection from './WorkspaceSection'

const ListBoard = () => {
    const yourBoards = [
        { name: 'Frontend Project', bgColor: '#04d5ffff' },
        { name: 'Marketing Plan', bgColor: '#ff9500ff' }
    ]

    const guestBoards = [
        { name: 'Guest Roadmap', bgColor: '#40ff00ff' },
        { name: 'Feedback Board', bgColor: '#fb2a00ff' }
    ]
    return (
        <div>
            <WorkspaceSection
                title="Your Workspaces"
                boards={yourBoards}
            />
            <WorkspaceSection
                title="Guest Workspaces"
                boards={guestBoards}
            />
        </div>
    )
}

export default ListBoard
