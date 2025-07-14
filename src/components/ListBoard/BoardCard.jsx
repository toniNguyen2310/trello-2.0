
import { useNavigate } from 'react-router-dom'
import './ListBoardScss/BoardCard.scss'

const BoardCard = ({ board }) => {
    const navigate = useNavigate()

    return (
        <div className="board-card" onClick={() => navigate('/board')}>
            <div className="board-thumbnail" style={{ backgroundColor: board.bgColor }}></div>
            <div className="board-title">{board.name}</div>
        </div>
    )
}

export default BoardCard
