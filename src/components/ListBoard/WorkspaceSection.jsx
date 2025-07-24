import { useEffect, useRef } from 'react';
import BoardCard from './BoardCard'
import './ListBoardScss/WorkspaceSection.scss'
import { memo } from 'react';
import { useBoardCardWrapPosition } from '@utils/customHooks/useSmartPosition';

const WorkspaceSection = ({ title, boards }) => {
    const gridRef = useRef(null)
    const cardRef = useRef(null);
    const position = useBoardCardWrapPosition(gridRef, cardRef)

    return (
        <div className="workspace-section" >
            <div className="workspace-header">
                <div className="workspace-title">
                    {title}
                </div>
            </div>
            <div className="board-grid" ref={gridRef}>
                {boards?.map((board, index) => (
                    <BoardCard key={board._id} board={board} />
                ))}
                <BoardCard board={{ title: 'Create new board', color: '#f1f2f4', new: true }} cardRef={cardRef} position={position} />
            </div>

        </div>
    )
}

export default memo(WorkspaceSection)
