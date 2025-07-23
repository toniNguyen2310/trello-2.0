// hooks/useBoardsWithCache.js
import { useEffect, useState, useCallback } from 'react'
import { getBoardsByUser } from 'service/apis'
import { isEqual } from 'lodash'

export const LS_KEY = 'cachedBoards'

export const useBoardsWithCache = (userId) => {
    const [boards, setBoards] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchBoards = useCallback(async () => {
        if (!userId) return
        try {
            const cachedStr = localStorage.getItem(LS_KEY)
            let cached = null
            if (cachedStr) {
                cached = JSON.parse(cachedStr)
                if (Array.isArray(cached)) {
                    setBoards(cached)
                    setIsLoading(false)
                }
            }
            const res = await getBoardsByUser(userId)
            const fresh = res.boards || []

            if (!cached || !isEqual(fresh, cached)) {
                setBoards(fresh)
                localStorage.setItem(LS_KEY, JSON.stringify(fresh))
            }
            if (!cached) setIsLoading(false)

        } catch (error) {
            console.error('Không lấy được boards:', error)
            setIsLoading(false)
        }
    }, [userId])

    useEffect(() => {
        fetchBoards()
    }, [fetchBoards])

    return { boards, isLoading }
}
