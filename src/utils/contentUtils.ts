import React from 'react';
import {
    IconBrandInstagram,
    IconBrandTwitter,
    IconBrandLinkedin,
    IconBrandFacebook,
    IconBrandTiktok,
    IconBrandYoutube,
    IconMail,
    IconLink,
    IconPhone
} from '@tabler/icons-react';

export const ICON_MAP: Record<string, React.ElementType> = {
    instagram: IconBrandInstagram,
    twitter: IconBrandTwitter,
    linkedin: IconBrandLinkedin,
    facebook: IconBrandFacebook,
    tiktok: IconBrandTiktok,
    youtube: IconBrandYoutube,
    email: IconMail,
    link: IconLink,
    phone: IconPhone
};

export const ICON_OPTIONS = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter / X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'email', label: 'Email' },
    { value: 'link', label: 'Website / Link' },
    { value: 'phone', label: 'Phone' },
];

export interface ExtendedCSSProperties extends React.CSSProperties {
    hoverColor?: string;
    activeColor?: string;
    hoverBgColor?: string;
    activeBgColor?: string;
    hoverBorderColor?: string;
    activeBorderColor?: string;
    [key: string]: unknown;
}

export interface ContentItem {
    text: string;
    style?: ExtendedCSSProperties;
}

export function getItem(val: unknown, defaultText: string): ContentItem {
    if (!val) return { text: defaultText, style: {} };
    if (typeof val === 'string') return { text: val, style: {} };

    if (typeof val === 'object' && val !== null) {
        const v = val as Record<string, unknown>;
        return {
            text: (typeof v.text === 'string' ? v.text : undefined) ?? defaultText,
            style: (typeof v.style === 'object' && v.style !== null) ? (v.style as ExtendedCSSProperties) : {}
        };
    }

    return { text: defaultText, style: {} };
}

export function getValue(val: unknown, defaultValue: unknown): { value: unknown, style: ExtendedCSSProperties } {
    if (!val) return { value: defaultValue, style: {} };
    if (typeof val === 'string') return { value: val, style: {} };

    if (typeof val === 'object' && val !== null) {
        const v = val as Record<string, unknown>;
        const style = (typeof v.style === 'object' && v.style !== null) ? (v.style as ExtendedCSSProperties) : {};

        if ('src' in v) return { value: v.src, style };
        if ('value' in v) return { value: v.value, style };

        return { value: val, style: {} };
    }

    return { value: val, style: {} };
}
