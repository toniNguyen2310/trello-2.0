
import React from 'react'
import './ListBoardScss/ListBoard.scss'
import WorkspaceSection from './WorkspaceSection'
import { useAuth } from '@contexts/AuthContext';

import { useBoardsWithCache } from '@utils/customHooks/useBoardsWithCache';



const ListBoard = () => {
    const { user } = useAuth()
    const boards = useBoardsWithCache(user?._id)
    return (
        <div>
            <WorkspaceSection
                title="YOUR WORKSPACES"
                boards={boards}
            />
        </div>
    )
}

export default ListBoard
