import { describe, it, expect } from 'vitest';
import { extractYouTubeId, getThumbnail, getEmbedUrl } from './videoUtils';

describe('videoUtils', () => {
    describe('extractYouTubeId', () => {
        it('should extract ID from standard URL', () => {
            expect(extractYouTubeId('https://www.youtube.com/watch?v=txN_qF7Sk6k')).toBe('txN_qF7Sk6k');
        });

        it('should extract ID from shortened URL', () => {
            expect(extractYouTubeId('https://youtu.be/txN_qF7Sk6k')).toBe('txN_qF7Sk6k');
        });

        it('should extract ID from shorts URL', () => {
            expect(extractYouTubeId('https://www.youtube.com/shorts/txN_qF7Sk6k')).toBe('txN_qF7Sk6k');
        });

        it('should extract ID from embed URL', () => {
            expect(extractYouTubeId('https://www.youtube.com/embed/txN_qF7Sk6k')).toBe('txN_qF7Sk6k');
        });

        it('should return null for invalid URLs', () => {
            expect(extractYouTubeId('https://google.com')).toBeNull();
            expect(extractYouTubeId('')).toBeNull();
        });
    });

    describe('getThumbnail', () => {
        it('should return YouTube thumbnail URL', () => {
            expect(getThumbnail('https://youtu.be/txN_qF7Sk6k')).toBe('https://img.youtube.com/vi/txN_qF7Sk6k/hqdefault.jpg');
        });

        it('should return Vimeo thumbnail URL', () => {
            expect(getThumbnail('https://vimeo.com/123456789')).toBe('https://vumbnail.com/123456789.jpg');
        });

        it('should return default thumbnail for unknown URLs', () => {
            expect(getThumbnail('https://google.com')).toBe('/hero.png');
        });
    });

    describe('getEmbedUrl', () => {
        it('should return YouTube embed URL', () => {
            expect(getEmbedUrl('https://www.youtube.com/watch?v=txN_qF7Sk6k')).toBe('https://www.youtube.com/embed/txN_qF7Sk6k?rel=0');
        });

        it('should return Vimeo embed URL', () => {
            expect(getEmbedUrl('https://vimeo.com/123456789')).toBe('https://player.vimeo.com/video/123456789');
        });

        it('should return original URL for unknowns', () => {
            expect(getEmbedUrl('https://google.com')).toBe('https://google.com');
        });
    });
});
