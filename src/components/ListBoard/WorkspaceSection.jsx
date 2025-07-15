// src/components/WorkspaceSection.jsx
import BoardCard from './BoardCard'
import './ListBoardScss/WorkspaceSection.scss'

const WorkspaceSection = ({ title, boards }) => {
    return (
        <div className="workspace-section">
            <div className="workspace-title">
                {title}
            </div>

            <div className="board-grid">
                {boards.map((board, index) => (
                    <BoardCard key={index} board={board} />
                ))}
            </div>
        </div>
    )
}

export default WorkspaceSection
