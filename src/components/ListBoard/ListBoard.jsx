
import React from 'react'
import './ListBoardScss/ListBoard.scss'
import WorkspaceSection from './WorkspaceSection'
import { useAuth } from '@contexts/AuthContext';

import { useBoardsWithCache } from '@utils/customHooks/useBoardsWithCache';
import LoadingComponent from '@components/LoadingComponent/LoadingComponent ';



const ListBoard = () => {
    const { user } = useAuth()
    const { boards, isLoading } = useBoardsWithCache(user?._id)
    if (isLoading) return <LoadingComponent />
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
