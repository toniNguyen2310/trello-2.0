// src/components/WorkspaceSection.jsx
import { useEffect } from 'react';
import BoardCard from './BoardCard'
import './ListBoardScss/WorkspaceSection.scss'
import { FaPlus } from "react-icons/fa6";

const WorkspaceSection = ({ title, boards }) => {

    return (
        <div className="workspace-section" >
            <div className="workspace-header">
                <div className="workspace-title">
                    {title}
                </div>
            </div>
            <div className="board-grid">
                {boards?.map((board, index) => (
                    <BoardCard key={board._id} board={board} />
                ))}
                {title === 'YOUR WORKSPACES' && <BoardCard board={{ title: 'Create new board', color: '#f1f2f4', new: true }} />}
            </div>
        </div>
    )
}

export default WorkspaceSection
