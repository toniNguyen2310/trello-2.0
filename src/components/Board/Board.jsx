
import BoardHeader from '../BoardHeader/BoardHeader'
import BoardContent from '../BoardContent/BoardContent'
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getBoardFullData } from 'service/apis';
import isEqual from 'lodash/isEqual'
import { useColorVariants } from '@utils/customHooks/useColorVariants';
import { useAuth } from '@contexts/AuthContext';
import LoadingComponent from '@components/LoadingComponent/LoadingComponent ';
import NotFound from '@components/Layout/NotFound';
import { useLocation } from 'react-router-dom'

function Board() {
    const { boardId } = useParams()
    const [board, setBoard] = useState(null)
    const [loading, setLoading] = useState(true)
    const colorOb = useColorVariants(board?.color || '#f9f9f9')
    const { setAppBarColor } = useAuth()
    const listColumnsRef = useRef({})
    const location = useLocation()
    const navigate = useNavigate();

    const fetchBoard = useCallback(async () => {
        try {
            // Bước 1: Lấy dữ liệu từ localStorage
            const cachedStr = localStorage.getItem(`trelloBoard-${boardId}`)
            let cached = null

            if (cachedStr) {
                cached = JSON.parse(cachedStr)
                setBoard(cached)
                listColumnsRef.current = cached
            }

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
    }, [boardId])

    useEffect(() => {
        if (boardId) fetchBoard()
    }, [boardId, fetchBoard])
    const updateCardInBoard = (cardId, newData) => {
        setBoard(prev => {
            const newColumns = prev.columns.map(col => {
                if (col.cards.some(card => card.id === cardId)) {
                    const newCards = col.cards.map(card =>
                        card.id === cardId ? { ...card, ...newData } : card
                    )
                    return { ...col, cards: newCards }
                }
                return col
            })
            const newBoard = { ...prev, columns: newColumns }
            listColumnsRef.current = newBoard
            return newBoard
        })
        console.log(listColumnsRef.current.columns)
    };

    useEffect(() => {
        if (board) {
            setAppBarColor(colorOb.darker2)
        }
    }, [board, colorOb, setAppBarColor]);


    if (loading) return <LoadingComponent />
    if (!board) return <NotFound />
    return (
        <>
            {/* <LoadingComponent /> */}
            <BoardHeader board={board} colorOb={colorOb} listColumnsRef={listColumnsRef} />
            <BoardContent board={board} colorOb={colorOb} listColumnsRef={listColumnsRef} />
            <Outlet context={{ fetchBoard }} />
        </>
    )
}

export default Board