import { ActionIcon, Box, Button, Card, Group, Modal, Stack, Text, TextInput, Select, ColorInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useContent } from '../../context/ContentContext';
import { IconDeviceFloppy, IconDragDrop, IconMenuOrder, IconPlus, IconTrash, IconLink } from '@tabler/icons-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { ICON_MAP, ICON_OPTIONS } from '../../utils/contentUtils';

// Define interface for Social Link Item
interface SocialLinkItem {
    _id: string;
    icon?: string;
    url?: string;
    style?: React.CSSProperties & { hoverColor?: string; color?: string };
    [key: string]: unknown;
}

function SortableLinkItem({ id, item, removeItem, updateItem }: { id: string, item: SocialLinkItem, removeItem: (id: string) => void, updateItem: (id: string, field: string, value: unknown) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition, zIndex: 1000 };

    const handleStyleChange = (key: string, value: string) => {
        updateItem(id, 'style', { ...item.style, [key]: value });
    };

    return (
        <Card withBorder shadow="sm" radius="md" mb="sm" ref={setNodeRef} style={style} {...attributes}>
            <Group align="flex-start">
                <div {...listeners} style={{ cursor: 'grab', marginTop: '5px' }}>
                    <IconDragDrop size={20} color="gray" />
                </div>

                <Box style={{ flex: 1 }}>
                    <Group grow mb="xs">
                        <Select
                            label="Icon"
                            data={ICON_OPTIONS}
                            value={item.icon || 'link'}
                            onChange={(val) => updateItem(id, 'icon', val)}
                            comboboxProps={{ zIndex: 2000000 }}
                        />
                        <TextInput
                            label="URL"
                            placeholder="https://..."
                            value={item.url || ''}
                            onChange={(e) => updateItem(id, 'url', e.currentTarget.value)}
                        />
                    </Group>
                    <Group grow>
                        <ColorInput
                            label="Color"
                            value={item.style?.color || ''}
                            onChange={(val) => handleStyleChange('color', val)}
                            popoverProps={{ zIndex: 2000000 }}
                        />
                        <ColorInput
                            label="Hover Color"
                            value={item.style?.hoverColor || ''}
                            onChange={(val) => handleStyleChange('hoverColor', val)}
                            popoverProps={{ zIndex: 2000000 }}
                        />
                    </Group>
                </Box>

                <ActionIcon color="red" variant="subtle" onClick={() => removeItem(id)} mt={5}>
                    <IconTrash size={20} />
                </ActionIcon>
            </Group>
        </Card>
    );
}

interface EditableSocialLinksProps {
    contentKey: string;
    defaultItems?: SocialLinkItem[];
}

export function EditableSocialLinks({ contentKey, defaultItems = [] }: EditableSocialLinksProps) {
    const { content, updateContent, isEditable } = useContent();
    const items = (content[contentKey] as SocialLinkItem[]) || defaultItems;

    const [opened, { open: openModal, close }] = useDisclosure(false);
    const [tempItems, setTempItems] = useState<SocialLinkItem[]>([]);

    const handleOpen = () => {
        const hydrated = items.map((it) => ({
            ...it,
            _id: it._id || Math.random().toString(36).substr(2, 9),
            style: it.style || {}
        }));
        setTempItems(hydrated);
        openModal();
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setTempItems((items) => {
                const oldIndex = items.findIndex((i) => i._id === active.id);
                const newIndex = items.findIndex((i) => i._id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleUpdateItem = (id: string, field: string, value: unknown) => {
        setTempItems(prev => prev.map(item => item._id === id ? { ...item, [field]: value } : item));
    };

    const handleRemoveItem = (id: string) => {
        if (confirm('Delete this social link?')) {
            setTempItems(prev => prev.filter(item => item._id !== id));
        }
    };

    const handleAddItem = () => {
        setTempItems(prev => [...prev, {
            _id: Math.random().toString(36).substr(2, 9),
            icon: 'link',
            url: '',
            style: { color: '#ffffff', hoverColor: '#dbc674' }
        }]);
    };

    const handleSave = () => {
        updateContent(contentKey, tempItems);
        close();
    };

    return (
        <>
            {isEditable && (
                <Group justify="center" mb="lg" w="100%">
                    <Button
                        leftSection={<IconMenuOrder size={16} />}
                        variant="outline"
                        color="gold"
                        onClick={handleOpen}
                        c="dark"
                        size="xs"
                        style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                    >
                        Manage Social Links
                    </Button>
                </Group>
            )}

            <Group gap="lg">
                {items.map((item: SocialLinkItem, idx: number) => {
                    const IconComponent = ICON_MAP[item.icon || 'link'] || IconLink;
                    const iconStyle: React.CSSProperties = {
                        color: item.style?.color || 'var(--mantine-color-white)',
                        ['--hover-color' as string]: item.style?.hoverColor || item.style?.color || 'var(--mantine-color-white)',
                        transition: 'all 0.2s',
                        ...item.style
                    } as React.CSSProperties;

                    return (
                        <a
                            key={item._id || idx}
                            href={item.url}
                            target={item.url?.startsWith('http') ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="editable-link-icon"
                            style={iconStyle}
                        >
                            <IconComponent size={28} />
                        </a>
                    );
                })}
            </Group>

            <Modal opened={opened} onClose={close} title="Manage Social Links" size="lg" zIndex={1000000}>
                <Stack>
                    <Text size="sm" c="dimmed">Add, remove, or reorder your social media profiles.</Text>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={tempItems.map(i => i._id)} strategy={verticalListSortingStrategy}>
                            {tempItems.map(item => (
                                <SortableLinkItem
                                    key={item._id}
                                    id={item._id}
                                    item={item}
                                    removeItem={handleRemoveItem}
                                    updateItem={handleUpdateItem}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    <Button leftSection={<IconPlus size={16} />} variant="light" onClick={handleAddItem}>Add Social Link</Button>

                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={close}>Cancel</Button>
                        <Button leftSection={<IconDeviceFloppy size={16} />} onClick={handleSave} color="gold" c="dark">Save Changes</Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
