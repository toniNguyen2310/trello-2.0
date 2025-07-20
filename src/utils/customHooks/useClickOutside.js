
import { useEffect } from 'react'

export default function useClickOutside({
    ref,
    callback,
    active = true,
    deps = []
}) {
    useEffect(() => {
        if (!active) return

        const handleClickOutside = async (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                await callback?.()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref, active, deps = []])
}
