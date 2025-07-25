
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './ListBoardScss/BoardCard.scss'
import CreateBoardModal from './CreateBoardModal';
import { useBoardCardWrapPosition } from '@utils/customHooks/useSmartPosition';

const BoardCard = ({ board, cardRef, position }) => {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);


    return (
        <>
            {board && board.new ?
                <div className="board-card-wrap" ref={cardRef} >
                    <div className="board-card-guest" ref={cardRef} onClick={() => setIsOpen(true)}>
                        Create new board
                    </div>
                    <CreateBoardModal isOpen={isOpen} setIsOpen={setIsOpen} position={position} />
                </div>
                :
                <div className="board-card" onClick={() => navigate(`/board/${board._id}`)}>
                    <div className="board-thumbnail" style={{ background: board.color }}></div>
                    <div className="board-title">{board.title}</div>
                </div>
            }
        </>

    )
}

export default BoardCard
