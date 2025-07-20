import { useEffect, useState } from 'react';

export const useSmartPosition = (ref) => {
    const [position, setPosition] = useState(''); // 'left' or 'right'

    useEffect(() => {
        const updatePosition = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const screenWidth = window.innerWidth;

            if (rect.left < screenWidth / 2) {
                // console.log('R')
                setPosition('right');
            } else {
                // console.log('L')

                setPosition('left');
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
        };
    }, []);

    return position;
};
