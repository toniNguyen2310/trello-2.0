import { LS_KEY } from './useBoardsWithCache'

export const useUpdateBoardsCache = () => {
    const addBoardToCache = (newBoard) => {
        try {
            const cached = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
            const updated = [newBoard, ...cached]
            localStorage.setItem(LS_KEY, JSON.stringify(updated))
        } catch (err) {
            console.error('Failed to update boards cache', err)
        }
    }
    const removeBoardFromCache = (boardId) => {
        try {
            if (!boardId) return
            const cached = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
            const updated = cached.filter(board => board._id !== boardId)
            localStorage.setItem(LS_KEY, JSON.stringify(updated))
        } catch (err) {
            console.error('Failed to remove board from cache', err)
        }
    }

    return { addBoardToCache, removeBoardFromCache }
}
