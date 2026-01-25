import { Popover, Stack, Group, Text, TextInput, Select, Button, ColorInput, NumberInput } from '@mantine/core';
import { useContent } from '../../context/ContentContext';
import { useState, useCallback } from 'react';
import { IconLink, IconPencil } from '@tabler/icons-react';
import { ICON_MAP, ICON_OPTIONS } from '../../utils/contentUtils';



interface EditableLinkProps {
    contentKey: string;
    defaultIcon: string;
    defaultUrl: string;
    size?: number;
}

interface LinkData {
    icon?: string;
    url?: string;
    style?: React.CSSProperties & { hoverColor?: string; color?: string };
}
type LinkStyle = React.CSSProperties & { hoverColor?: string; color?: string };

export function EditableLink({ contentKey, defaultIcon, defaultUrl, size = 28 }: EditableLinkProps) {
    const { content, updateContent, isEditable } = useContent();

    const getData = useCallback((val: unknown) => {
        if (!val || typeof val !== 'object') return { icon: defaultIcon, url: defaultUrl, style: {} as LinkStyle };
        const v = val as LinkData;
        return {
            icon: v.icon || defaultIcon,
            url: v.url || defaultUrl,
            style: (v.style || {}) as LinkStyle
        };
    }, [defaultIcon, defaultUrl]);

    const item = getData(content[contentKey]);

    const [isEditing, setIsEditing] = useState(false);
    const [tempIcon, setTempIcon] = useState(item.icon);
    const [tempUrl, setTempUrl] = useState(item.url);
    const [tempStyle, setTempStyle] = useState<React.CSSProperties & { hoverColor?: string }>(item.style);

    const handleOpen = () => {
        const current = getData(content[contentKey]);
        setTempIcon(current.icon);
        setTempUrl(current.url);
        setTempStyle(current.style);
        setIsEditing(true);
    };

    const handleSave = () => {
        updateContent(contentKey, { icon: tempIcon, url: tempUrl, style: tempStyle });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const IconComponent = ICON_MAP[item.icon] || IconLink;

    const iconStyle = {
        color: item.style.color || 'var(--mantine-color-white)',
        ['--hover-color' as string]: (item.style?.hoverColor || item.style?.color || 'var(--mantine-color-white)'),
        transition: 'all 0.2s',
        ...item.style
    };

    if (isEditable) {
        return (
            <Popover
                opened={isEditing}
                onClose={handleCancel}
                width={300}
                position="bottom"
                withArrow
                shadow="md"
                zIndex={1000}
                closeOnClickOutside={true}
                closeOnEscape={true}
            >
                <Popover.Target>
                    <div
                        onClick={handleOpen}
                        style={{
                            cursor: 'pointer',
                            position: 'relative',
                            display: 'inline-flex',
                            outline: '1px solid rgba(219, 198, 116, 0.5)',
                            outlineOffset: '4px',
                            borderRadius: '4px'
                        }}
                    >
                        <IconComponent size={size} style={iconStyle} />
                        <IconPencil
                            size={10}
                            style={{
                                position: 'absolute',
                                top: -6,
                                right: -6,
                                backgroundColor: '#dbc674',
                                color: 'black',
                                borderRadius: '50%',
                                padding: 2,
                                width: 14,
                                height: 14
                            }}
                        />
                    </div>
                </Popover.Target>
                <Popover.Dropdown p="md">
                    <Stack gap="sm">
                        <Text fw={700} size="sm" c="gold">LINK SETTINGS</Text>

                        <Select
                            label="Icon"
                            data={ICON_OPTIONS}
                            value={tempIcon}
                            onChange={(val) => setTempIcon(val || 'link')}
                            comboboxProps={{ zIndex: 1100 }}
                        />

                        <TextInput
                            label="Target URL"
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.currentTarget.value)}
                            placeholder="https://..."
                        />

                        <Text fw={700} size="sm" c="gold" mt="xs">STYLING</Text>

                        <Group grow>
                            <ColorInput
                                label="Color"
                                value={tempStyle.color || ''}
                                onChange={(val) => setTempStyle((s) => ({ ...s, color: val }))}
                                placeholder="Default"
                                popoverProps={{ zIndex: 1100 }}
                            />
                            <ColorInput
                                label="Hover Color"
                                value={tempStyle.hoverColor || ''}
                                onChange={(val) => setTempStyle((s) => ({ ...s, hoverColor: val }))}
                                placeholder="Default"
                                popoverProps={{ zIndex: 1100 }}
                            />
                        </Group>

                        <Group grow>
                            <NumberInput
                                label="Icon Size"
                                value={size}
                                disabled
                            />
                        </Group>

                        <Group grow mt="md">
                            <Button variant="subtle" color="gray" size="xs" onClick={handleCancel}>Cancel</Button>
                            <Button color="gold" c="dark" size="xs" onClick={handleSave}>Save</Button>
                        </Group>
                    </Stack>
                </Popover.Dropdown>
            </Popover>
        );
    }

    return (
        <a
            href={item.url}
            target={item.url.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="editable-link-icon"
            style={iconStyle as React.CSSProperties}
        >
            <IconComponent size={size} />
        </a>
    );
}
