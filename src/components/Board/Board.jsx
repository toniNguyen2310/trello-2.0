
import BoardHeader from '../BoardHeader/BoardHeader'
import BoardContent from '../BoardContent/BoardContent'
import { Outlet } from 'react-router-dom';

function Board() {
    return (
        <>
            <BoardHeader />
            <>
                <BoardContent />
                <Outlet />

            </>
        </>
    )
}

export default Board