// hooks/useBoardsWithCache.js
import { useEffect, useState, useCallback } from 'react'
import { getBoardsByUser } from 'service/apis'
import { isEqual } from 'lodash'

export const LS_KEY = 'cachedBoards'

export const useBoardsWithCache = (userId) => {
    const [boards, setBoards] = useState([])

    // Load từ localStorage
    useEffect(() => {
        const cached = localStorage.getItem(LS_KEY)
        if (cached) {
            try {
                const parsed = JSON.parse(cached)
                if (Array.isArray(parsed)) {
                    setBoards(parsed)
                }
            } catch (err) {
                console.error('Failed to parse cached boards', err)
            }
        }
    }, [])

    const fetchBoards = useCallback(async () => {
        if (!userId) return
        try {
            const res = await getBoardsByUser(userId)
            const newBoards = res.boards || []
            const cachedBoards = JSON.parse(localStorage.getItem(LS_KEY) || '[]')

            if (!isEqual(newBoards, cachedBoards)) {
                setBoards(newBoards)
                localStorage.setItem(LS_KEY, JSON.stringify(newBoards))
            }
        } catch (err) {
            console.error('Không lấy được boards', err)
        }
    }, [userId])

    useEffect(() => {
        fetchBoards()
    }, [fetchBoards])

    return boards
}
