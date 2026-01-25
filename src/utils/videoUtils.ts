export function extractYouTubeId(url: string) {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export function getThumbnail(url: string) {
    const id = extractYouTubeId(url);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

    if (url.includes('vimeo.com')) {
        const id = url.split('/').pop()?.split('?')[0];
        return id ? `https://vumbnail.com/${id}.jpg` : '/hero.png';
    }
    return '/hero.png';
}

export function getEmbedUrl(url: string) {
    if (!url) return '';
    const id = extractYouTubeId(url);
    if (id) {
        return `https://www.youtube.com/embed/${id}?rel=0`;
    }
    if (url.includes('vimeo.com') && !url.includes('player.vimeo.com')) {
        const id = url.split('/').pop()?.split('?')[0];
        return id ? `https://player.vimeo.com/video/${id}` : url;
    }
    return url;
}
