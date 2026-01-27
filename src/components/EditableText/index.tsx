import { Text, Textarea, Tooltip, Popover, ColorInput, NumberInput, Select, ActionIcon, Group, Stack, Button, Box, TextInput } from '@mantine/core';
import { useContent } from '../../context/ContentContext';
import { getItem, type ExtendedCSSProperties } from '../../utils/contentUtils';
import { useState, useRef } from 'react';
import { IconPencil, IconBold, IconItalic, IconUnderline, IconLink } from '@tabler/icons-react';

interface EditableTextProps extends React.ComponentPropsWithoutRef<React.ElementType> {
    contentKey?: string;
    defaultValue?: string;
    as?: React.ElementType;
    style?: React.CSSProperties;
    className?: string | ((args: { isActive: boolean }) => string);
    bulkStyleKeys?: string[];
    styleKey?: string;
    extended?: boolean;
    multiline?: boolean;
    value?: { text: string; style?: ExtendedCSSProperties;[key: string]: unknown };
    onSave?: (newValue: { text: string; style: ExtendedCSSProperties }) => void;
}

const FONTS = [
    { value: 'Inter, sans-serif', label: 'Inter' },
    { value: 'Roboto, sans-serif', label: 'Roboto' },
    { value: 'Open Sans, sans-serif', label: 'Open Sans' },
    { value: 'Lato, sans-serif', label: 'Lato' },
    { value: 'Montserrat, sans-serif', label: 'Montserrat' },
    { value: 'Poppins, sans-serif', label: 'Poppins' },
    { value: 'Raleway, sans-serif', label: 'Raleway' },
    { value: 'Oswald, sans-serif', label: 'Oswald' },
    { value: 'Playfair Display, serif', label: 'Playfair Display' },
    { value: 'Merriweather, serif', label: 'Merriweather' },
    { value: 'Lora, serif', label: 'Lora' },
    { value: 'PT Serif, serif', label: 'PT Serif' },
    { value: 'Cinzel, serif', label: 'Cinzel' },
    { value: 'Abril Fatface, serif', label: 'Abril Fatface' },
    { value: 'Dancing Script, cursive', label: 'Dancing Script' },
    { value: 'Pacifico, cursive', label: 'Pacifico' },
    { value: 'Shadows Into Light, cursive', label: 'Shadows Into Light' },
    { value: 'Lobster, cursive', label: 'Lobster' },
    { value: 'Bebas Neue, sans-serif', label: 'Bebas Neue' },
    { value: 'Roboto Mono, monospace', label: 'Roboto Mono' },
    { value: 'Outfit, sans-serif', label: 'Outfit' },
];


export function EditableText({
    contentKey,
    defaultValue = '',
    as: Component = Text,
    style = {},
    bulkStyleKeys,
    styleKey,
    extended = false,
    multiline = false,
    value,
    onSave,
    ...props
}: EditableTextProps) {
    const { content, updateContent, bulkUpdate, isEditable } = useContent();
    const item = value || (contentKey ? getItem(content[contentKey], defaultValue) : { text: defaultValue, style: {} });
    const styleSource = value || (styleKey ? getItem(content[styleKey], '') : item);

    const [isEditing, setIsEditing] = useState(false);
    const [tempText, setTempText] = useState(item.text);
    const [tempStyle, setTempStyle] = useState<ExtendedCSSProperties>(styleSource.style || {});
    const [linkUrl, setLinkUrl] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSave = () => {
        if (onSave) {
            onSave({ text: tempText, style: tempStyle });
        } else if (contentKey) {
            if (styleKey) {
                bulkUpdate({
                    [contentKey]: { text: tempText },
                    [styleKey]: { style: tempStyle }
                });
            } else {
                updateContent(contentKey, { text: tempText, style: tempStyle });
            }
        }
        setIsEditing(false);
        setShowLinkInput(false);
        setLinkUrl('');
    };

    const handleCancel = () => {
        const currentItem = value || (contentKey ? getItem(content[contentKey], defaultValue) : { text: defaultValue, style: {} });
        const currentStyleSource = value || (styleKey ? getItem(content[styleKey], '') : currentItem);
        setTempText(currentItem.text);
        setTempStyle(currentStyleSource.style || {});
        setIsEditing(false);
        setShowLinkInput(false);
        setLinkUrl('');
    };

    const toggleStyle = (key: keyof ExtendedCSSProperties, value: unknown, defaultValue: unknown) => {
        setTempStyle(prev => {
            const current = prev[key];
            const next = current === value ? defaultValue : value;
            return { ...prev, [key]: next };
        });
    };

    const insertLink = () => {
        if (!textareaRef.current) return;
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;

        if (start === end) {
            // No selection, just insert link
            const newText = tempText.slice(0, start) + `[Link Text](${linkUrl})` + tempText.slice(end);
            setTempText(newText);
        } else {
            const selectedText = tempText.slice(start, end);
            const newText = tempText.slice(0, start) + `[${selectedText}](${linkUrl})` + tempText.slice(end);
            setTempText(newText);
        }
        setLinkUrl('');
        setShowLinkInput(false);
    };


    const mergedStyle: ExtendedCSSProperties = {
        ...style,
        ...(styleSource.style || {}),
        textAlign: (styleSource.style as ExtendedCSSProperties)?.textAlign || style?.textAlign,
        marginTop: (styleSource.style as ExtendedCSSProperties)?.marginTop || style?.marginTop,
        marginBottom: (styleSource.style as ExtendedCSSProperties)?.marginBottom || style?.marginBottom,
        marginLeft: (styleSource.style as ExtendedCSSProperties)?.marginLeft || style?.marginLeft,
        marginRight: (styleSource.style as ExtendedCSSProperties)?.marginRight || style?.marginRight,
    };

    if (!mergedStyle.display) {
        if (multiline || mergedStyle.textAlign || mergedStyle.marginTop || mergedStyle.marginBottom) {
            mergedStyle.display = Component === 'span' ? 'inline-block' : 'block';
        }
    }

    if (multiline) {
        if (!mergedStyle.width) mergedStyle.width = '100%';
        if (!mergedStyle.whiteSpace) mergedStyle.whiteSpace = 'pre-wrap';
    }

    const styleWithVars: React.CSSProperties & Record<string, unknown> = { ...mergedStyle };
    const itStyle = (styleSource.style || {}) as ExtendedCSSProperties;
    if (itStyle.hoverColor) styleWithVars['--hover-color'] = itStyle.hoverColor;
    if (itStyle.activeColor) styleWithVars['--active-color'] = itStyle.activeColor;
    if (itStyle.hoverBgColor) styleWithVars['--hover-bg'] = itStyle.hoverBgColor;
    if (itStyle.activeBgColor) styleWithVars['--active-bg'] = itStyle.activeBgColor;
    if (itStyle.hoverBorderColor) styleWithVars['--hover-border'] = itStyle.hoverBorderColor;
    if (itStyle.activeBorderColor) styleWithVars['--active-border'] = itStyle.activeBorderColor;

    const getFinalClassName = (args: { isActive?: boolean } = {}) => {
        const baseClass = typeof props.className === 'function' ? props.className(args as { isActive: boolean }) : (props.className || '');
        return `editable-text-wrapper ${baseClass}`.trim();
    };

    function renderContent(text: string) {
        const regex = /\[(.*?)\]\((.*?)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Text before match
            if (match.index > lastIndex) {
                parts.push(text.slice(lastIndex, match.index));
            }
            // The link
            parts.push(
                <a
                    key={match.index}
                    href={match[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {match[1]}
                </a>
            );
            lastIndex = regex.lastIndex;
        }
        // Remaining text
        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return parts.length > 0 ? parts : text;
    }

    if (isEditable) {
        if (isEditing) {
            return (
                <Popover
                    opened={isEditing}
                    position="bottom"
                    withArrow
                    shadow="xl"
                    width={350}
                    onClose={() => handleCancel()}
                    zIndex={1000000}
                    closeOnClickOutside={true}
                    closeOnEscape={true}
                >
                    <Popover.Target>
                        <Box
                            className={getFinalClassName()}
                            style={{
                                ...styleWithVars,
                                display: multiline ? 'block' : styleWithVars.display,
                                width: multiline ? '100%' : (styleWithVars.width || 'fit-content'),
                                minWidth: multiline ? '100%' : undefined,
                                position: 'relative',
                                outline: '2px solid gold',
                                outlineOffset: '2px',
                                zIndex: 10,
                                cursor: 'text',
                                boxSizing: 'border-box'
                            }}
                        >
                            <Textarea
                                ref={textareaRef}
                                aria-label="Edit text content"
                                value={tempText}
                                onChange={(e) => setTempText(e.currentTarget.value)}
                                minRows={3}
                                autosize
                                variant="unstyled"
                                p={0}
                                m={0}
                                styles={{
                                    input: {
                                        width: '100%',
                                        minWidth: '100%',
                                        background: 'transparent',
                                        color: 'inherit',
                                        font: 'inherit',
                                        lineHeight: 'inherit',
                                        textAlign: 'inherit',
                                        padding: 0,
                                        boxSizing: 'border-box',
                                    }
                                }}
                            />
                        </Box>
                    </Popover.Target>
                    <Popover.Dropdown p={0} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <Box p="md" style={{ flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
                            <Stack gap="md">
                                <Text fw={700} size="sm" c="gold">TEXT STYLING</Text>
                                <Select
                                    label="Font Family"
                                    data={FONTS}
                                    value={tempStyle.fontFamily as string || 'inherit'}
                                    onChange={(val) => setTempStyle(s => ({ ...s, fontFamily: val || undefined }))}
                                    comboboxProps={{ zIndex: 1000000 }}
                                    renderOption={({ option }) => (
                                        <Text style={{ fontFamily: option.value }}>
                                            {option.label}
                                        </Text>
                                    )}
                                />

                                <Group grow>
                                    <NumberInput
                                        label="FontSize"
                                        value={parseInt(String(tempStyle.fontSize || 16))}
                                        onChange={(val) => setTempStyle(s => ({ ...s, fontSize: val ? `${val}px` : undefined }))}
                                    />
                                    <ColorInput
                                        label="Text Color"
                                        value={tempStyle.color as string || '#ffffff'}
                                        onChange={(val) => setTempStyle(s => ({ ...s, color: val }))}
                                        popoverProps={{ zIndex: 1000000 }}
                                    />
                                </Group>

                                {extended && (
                                    <>
                                        <Group grow>
                                            <ColorInput
                                                label="Hover Color"
                                                value={tempStyle.hoverColor || ''}
                                                onChange={(val) => setTempStyle(s => ({ ...s, hoverColor: val }))}
                                                placeholder="inherit"
                                                popoverProps={{ zIndex: 1000000 }}
                                            />
                                            <ColorInput
                                                label="Active Color"
                                                value={tempStyle.activeColor || ''}
                                                onChange={(val) => setTempStyle(s => ({ ...s, activeColor: val }))}
                                                placeholder="inherit"
                                                popoverProps={{ zIndex: 1000000 }}
                                            />
                                        </Group>

                                        <Group grow>
                                            <ColorInput
                                                label="Hover BG"
                                                value={tempStyle.hoverBgColor || ''}
                                                onChange={(val) => setTempStyle(s => ({ ...s, hoverBgColor: val }))}
                                                placeholder="transparent"
                                                popoverProps={{ zIndex: 1000000 }}
                                            />
                                            <ColorInput
                                                label="Active BG"
                                                value={tempStyle.activeBgColor || ''}
                                                onChange={(val) => setTempStyle(s => ({ ...s, activeBgColor: val }))}
                                                placeholder="transparent"
                                                popoverProps={{ zIndex: 1000000 }}
                                            />
                                        </Group>
                                    </>
                                )}

                                <Group gap={5}>
                                    <ActionIcon
                                        variant={tempStyle.fontWeight === 'bold' ? 'filled' : 'default'}
                                        onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}
                                        size="lg"
                                    >
                                        <IconBold size={20} />
                                    </ActionIcon>
                                    <ActionIcon
                                        variant={tempStyle.fontStyle === 'italic' ? 'filled' : 'default'}
                                        onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}
                                        size="lg"
                                    >
                                        <IconItalic size={20} />
                                    </ActionIcon>
                                    <ActionIcon
                                        variant={tempStyle.textDecoration === 'underline' ? 'filled' : 'default'}
                                        onClick={() => toggleStyle('textDecoration', 'underline', 'none')}
                                        size="lg"
                                    >
                                        <IconUnderline size={20} />
                                    </ActionIcon>
                                    <ActionIcon
                                        variant={showLinkInput ? 'filled' : 'default'}
                                        onClick={() => {
                                            // Focus link input if opening
                                            setShowLinkInput(v => !v);
                                        }}
                                        size="lg"
                                        title="Insert Link"
                                    >
                                        <IconLink size={20} />
                                    </ActionIcon>
                                </Group>

                                {showLinkInput && (
                                    <Group align="flex-end">
                                        <TextInput
                                            style={{ flex: 1 }}
                                            placeholder="https://example.com"
                                            label="Link URL"
                                            value={linkUrl}
                                            onChange={(e) => setLinkUrl(e.currentTarget.value)}
                                        />
                                        <Button onClick={insertLink} size="sm" color="gold" c="dark">Insert</Button>
                                    </Group>
                                )}

                                {extended && (
                                    <>
                                        <Text fw={700} size="sm" c="gold" mt="sm">BORDERS & CORNERS</Text>

                                        <Group grow>
                                            <NumberInput
                                                label="Width"
                                                value={parseInt(String(tempStyle.borderWidth || 0))}
                                                onChange={(val) => setTempStyle(s => ({ ...s, borderWidth: val ? `${val}px` : undefined }))}
                                            />
                                            <Select
                                                label="Style"
                                                data={['none', 'solid', 'dashed', 'dotted', 'double']}
                                                value={(tempStyle.borderStyle as string) || 'none'}
                                                onChange={(val) => setTempStyle(s => ({ ...s, borderStyle: val as React.CSSProperties['borderStyle'] }))}
                                                comboboxProps={{ zIndex: 1000000 }}
                                            />
                                        </Group>

                                        <Group grow>
                                            <ColorInput
                                                label="Border Color"
                                                value={(tempStyle.borderColor as string) || ''}
                                                onChange={(val) => setTempStyle(s => ({ ...s, borderColor: val }))}
                                                placeholder="transparent"
                                                popoverProps={{ zIndex: 1000000 }}
                                            />
                                            <NumberInput
                                                label="Corners (px)"
                                                value={parseInt(String(tempStyle.borderRadius || 0))}
                                                onChange={(val) => setTempStyle(s => ({ ...s, borderRadius: val ? `${val}px` : undefined }))}
                                            />
                                        </Group>

                                        <Group grow>
                                            <ColorInput
                                                label="Hover Border"
                                                value={tempStyle.hoverBorderColor || ''}
                                                onChange={(val) => setTempStyle(s => ({ ...s, hoverBorderColor: val }))}
                                                popoverProps={{ zIndex: 1000000 }}
                                            />
                                            <ColorInput
                                                label="Active Border"
                                                value={tempStyle.activeBorderColor || ''}
                                                onChange={(val) => setTempStyle(s => ({ ...s, activeBorderColor: val }))}
                                                popoverProps={{ zIndex: 1000000 }}
                                            />
                                        </Group>
                                    </>
                                )}

                                <Text fw={700} size="sm" c="gold" mt="sm">LAYOUT & SPACING</Text>

                                <Group grow items-align="flex-end">
                                    <Select
                                        label="Alignment"
                                        data={[
                                            { value: 'left', label: 'Left' },
                                            { value: 'center', label: 'Center' },
                                            { value: 'right', label: 'Right' },
                                        ]}
                                        value={tempStyle.textAlign as string || 'left'}
                                        onChange={(val) => setTempStyle(s => ({ ...s, textAlign: val as React.CSSProperties['textAlign'] }))}
                                        comboboxProps={{ zIndex: 1000000 }}
                                    />
                                    {extended && (
                                        <ColorInput
                                            label="Static BG"
                                            value={tempStyle.backgroundColor as string || ''}
                                            onChange={(val) => setTempStyle(s => ({ ...s, backgroundColor: val }))}
                                            placeholder="transparent"
                                            popoverProps={{ zIndex: 1000000 }}
                                        />
                                    )}
                                </Group>

                                <Group grow>
                                    <NumberInput
                                        label="Margin T"
                                        value={parseInt(String(tempStyle.marginTop || 0))}
                                        onChange={(val) => setTempStyle(s => ({ ...s, marginTop: val ? `${val}px` : undefined }))}
                                    />
                                    <NumberInput
                                        label="Margin B"
                                        value={parseInt(String(tempStyle.marginBottom || 0))}
                                        onChange={(val) => setTempStyle(s => ({ ...s, marginBottom: val ? `${val}px` : undefined }))}
                                    />
                                </Group>

                                <Group grow>
                                    <NumberInput
                                        label="Margin L"
                                        value={parseInt(String(tempStyle.marginLeft || 0))}
                                        onChange={(val) => setTempStyle(s => ({ ...s, marginLeft: val ? `${val}px` : undefined }))}
                                    />
                                    <NumberInput
                                        label="Margin R"
                                        value={parseInt(String(tempStyle.marginRight || 0))}
                                        onChange={(val) => setTempStyle(s => ({ ...s, marginRight: val ? `${val}px` : undefined }))}
                                    />
                                </Group>

                                {extended && (
                                    <Group grow>
                                        <NumberInput
                                            label="Pad X"
                                            value={parseInt(String(tempStyle.paddingLeft || 0))}
                                            onChange={(val) => setTempStyle(s => ({
                                                ...s,
                                                paddingLeft: val ? `${val}px` : undefined,
                                                paddingRight: val ? `${val}px` : undefined
                                            }))}
                                        />
                                        <NumberInput
                                            label="Pad Y"
                                            value={parseInt(String(tempStyle.paddingTop || 0))}
                                            onChange={(val) => setTempStyle(s => ({
                                                ...s,
                                                paddingTop: val ? `${val}px` : undefined,
                                                paddingBottom: val ? `${val}px` : undefined
                                            }))}
                                        />
                                    </Group>
                                )}
                            </Stack>
                        </Box>

                        <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-dark-4)', backgroundColor: 'var(--mantine-color-dark-7)' }}>
                            <Group grow>
                                <Button size="sm" color="gray" variant="subtle" onClick={handleCancel}>Cancel</Button>
                                <Button size="sm" color="gold" c="dark" onClick={handleSave}>Save Changes</Button>
                            </Group>

                            {extended && bulkStyleKeys && bulkStyleKeys.length > 0 && (
                                <Button
                                    size="xs"
                                    variant="filled"
                                    color="gold"
                                    c="dark"
                                    mt="md"
                                    fullWidth
                                    onClick={() => {
                                        const updates: Record<string, { text: string; style: ExtendedCSSProperties }> = {};
                                        bulkStyleKeys.forEach((key: string) => {
                                            const existing = getItem(content[key], '');
                                            const textToSave = (key === contentKey) ? tempText : existing.text;
                                            updates[key] = { text: textToSave, style: tempStyle };
                                        });
                                        bulkUpdate(updates);
                                        setIsEditing(false);
                                    }}
                                >
                                    Sync Style to All Items
                                </Button>
                            )}
                        </Box>
                    </Popover.Dropdown>
                </Popover>
            );
        }

        return (
            <Tooltip label="Click to edit" openDelay={500}>
                <Component
                    {...props}
                    onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        setTempText(item.text);
                        setTempStyle(styleSource.style || {});
                        setIsEditing(true);
                    }}
                    className={getFinalClassName()}
                    style={{
                        ...styleWithVars,
                        cursor: 'pointer',
                        position: 'relative',
                        outline: '1px solid rgba(219, 198, 116, 0.5)',
                        outlineOffset: '1px',
                    }}
                >
                    {renderContent(item.text)}
                    <IconPencil
                        size={12}
                        style={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            backgroundColor: '#dbc674',
                            color: 'black',
                            borderRadius: '50%',
                            padding: 2,
                            width: 14,
                            height: 14,
                            zIndex: 10,
                            boxShadow: '0 0 2px rgba(0,0,0,0.5)',
                            display: 'block'
                        }}
                    />
                </Component>

            </Tooltip>
        );
    }

    const finalClassName = typeof props.className === 'function' ? getFinalClassName : getFinalClassName();

    return (
        <Component {...props} className={finalClassName} style={styleWithVars}>
            {renderContent(item.text)}
        </Component>
    );
}
