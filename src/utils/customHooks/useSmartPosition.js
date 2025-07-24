import { useEffect, useState } from 'react'

export function useBoardCardWrapPosition(gridRef, wrapRef) {
    const [position, setPosition] = useState(null)

    useEffect(() => {
        const updatePosition = () => {

            if (!gridRef.current || !wrapRef.current) return

            const gridRect = gridRef.current.getBoundingClientRect()
            const wrapRect = wrapRef.current.getBoundingClientRect()

            const gridCenter = gridRect.left + gridRect.width / 2
            const wrapCenter = wrapRect.left + wrapRect.width / 2

            if (wrapCenter > gridCenter) {
                setPosition('right')
            } else {
                setPosition('left')
            }
        }

        updatePosition()

        // Lắng nghe resize để cập nhật lại
        window.addEventListener('resize', updatePosition)

        return () => {
            window.removeEventListener('resize', updatePosition)
        }
    }, [gridRef, wrapRef])

    return position
}
