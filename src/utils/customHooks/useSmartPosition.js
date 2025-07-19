import { useEffect, useState } from 'react';

export const useSmartPosition = (ref) => {
    const [position, setPosition] = useState('right'); // 'left' or 'right'

    useEffect(() => {
        const updatePosition = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const screenWidth = window.innerWidth;

            if (rect.left < screenWidth / 2) {
                setPosition('right');
            } else {
                setPosition('left');
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
        };
    }, [ref]);

    return position;
};
