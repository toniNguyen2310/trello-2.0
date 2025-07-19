import { useMemo } from 'react';

function darkenColor(hex, amount = 20) {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return hex;

    let h = hex.replace('#', '');
    if (h.length === 3) {
        h = h.split('').map(c => c + c).join('');
    }

    const r = Math.max(0, parseInt(h.slice(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(h.slice(2, 4), 16) - amount);
    const b = Math.max(0, parseInt(h.slice(4, 6), 16) - amount);

    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function extractFirstHexFromGradient(color) {
    if (typeof color !== 'string') return null;

    const hexMatch = color.match(/#([0-9a-fA-F]{3,6})/);
    return hexMatch ? `#${hexMatch[1]}` : null;
}

export const useColorVariants = (baseColor) => {
    return useMemo(() => {
        let hexColor = baseColor;

        // Nếu là linear-gradient thì lấy màu hex đầu tiên
        if (baseColor?.startsWith('linear-gradient')) {
            const extracted = extractFirstHexFromGradient(baseColor);
            if (extracted) hexColor = extracted;
        }

        return {
            base: baseColor,
            darker1: darkenColor(hexColor, 20),
            darker2: darkenColor(hexColor, 40)
        };
    }, [baseColor]);
};
