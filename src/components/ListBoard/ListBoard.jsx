
import React, { useEffect, useState } from 'react'
import './ListBoardScss/ListBoard.scss'
import WorkspaceSection from './WorkspaceSection'
import { useAuth } from '@contexts/AuthContext';
import { getBoardsByUser } from 'service/apis';

const ListBoard = () => {
    const [boards, setBoards] = useState([]);
    const { user } = useAuth()

    const yourBoards = [
        { title: 'Frontend Project', color: 'linear-gradient(to bottom, #833ab4, #fd1d1d, #fcb045)' },
        { title: 'Marketing Plan', color: '#ff9500ff' }
    ]

    useEffect(() => {
        if (!user?._id) return;

        const fetchBoards = async () => {
            try {
                const res = await getBoardsByUser(user._id);
                setBoards(res.boards);
            } catch (err) {
                console.error("Không lấy được boards", err);
            }
        };

        fetchBoards();
    }, [user]);

    return (
        <div>
            <WorkspaceSection
                title="YOUR WORKSPACES"
                boards={boards}
            />
            {/* <WorkspaceSection
                title="Guest Workspaces"
                boards={guestBoards}
            /> */}
        </div>
    )
}

export default ListBoard
