
import BoardHeader from '../BoardHeader/BoardHeader'
import BoardContent from '../BoardContent/BoardContent'
import { Outlet, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getBoardFullData } from 'service/apis';
import isEqual from 'lodash/isEqual'
import { useColorVariants } from '@utils/customHooks/useColorVariants';
import { useAuth } from '@contexts/AuthContext';
import LoadingComponent from '@components/LoadingComponent/LoadingComponent ';

function Board() {
    const { boardId } = useParams()
    const [board, setBoard] = useState(null)
    const [loading, setLoading] = useState(true)
    const colorOb = useColorVariants(board?.color || '#f9f9f9')
    const { setAppBarColor } = useAuth()
    const listColumnsRef = useRef({})

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                // Bước 1: Lấy dữ liệu từ localStorage
                const cachedStr = localStorage.getItem(`trelloBoard-${boardId}`)
                let cached = null

                if (cachedStr) {
                    cached = JSON.parse(cachedStr)
                    setBoard(cached) // Render tạm thời từ localStorage
                    listColumnsRef.current = cached
                }

                // Bước 2: Gọi API để lấy dữ liệu mới
                const fresh = await getBoardFullData(boardId)
                // Nếu khác với cache thì cập nhật
                if (!cached || !isEqual(fresh, cached)) {
                    setBoard(fresh)
                    listColumnsRef.current = fresh
                    localStorage.setItem(`trelloBoard-${boardId}`, JSON.stringify(fresh))
                }
            } catch (err) {
                console.error('Lỗi fetch board:', err)
            } finally {
                setLoading(false)
            }
        }

        if (boardId) fetchBoard()
    }, [boardId])

    useEffect(() => {
        if (board) {
            setAppBarColor(colorOb.darker2)
        }
    }, [board, colorOb])

    if (loading) return <LoadingComponent />
    if (!board) return <div>Bảng không tồn tại</div>
    return (
        <>
            {/* <LoadingComponent /> */}
            <BoardHeader board={board} colorOb={colorOb} listColumnsRef={listColumnsRef} />
            <BoardContent board={board} colorOb={colorOb} listColumnsRef={listColumnsRef} />
            <Outlet />
        </>
    )
}

export default Board