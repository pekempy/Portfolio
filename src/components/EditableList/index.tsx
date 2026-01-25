import { ActionIcon, Box, Button, Card, Group, Modal, Stack, Text, TextInput, FileButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useContent } from '../../context/ContentContext';
import { IconDeviceFloppy, IconDragDrop, IconMenuOrder, IconPlus, IconTrash, IconUpload, IconFocus } from '@tabler/icons-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect, useRef } from 'react';

export interface ListItem {
    _id: string;
    title: string;
    src?: string;
    slug?: string;
    subtitle?: string;
    dateFrom?: string;
    dateTo?: string;
    objectPosition?: string;
    [key: string]: unknown;
}

function SortableItem({ id, item, removeItem, updateItem, enableSlug, enableSubtitle, enableDate }: { id: string, item: ListItem, removeItem: (id: string) => void, updateItem: (id: string, field: string, value: string) => void, enableSlug?: boolean, enableSubtitle?: boolean, enableDate?: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (file: File | null) => {
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await response.json();
            if (data.url) updateItem(id, 'src', data.url);
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const isVideo = item.src?.includes('youtube') || item.src?.includes('vimeo') || item.src?.includes('.mp4');
    const [isPositioning, setIsPositioning] = useState(false);
    const [previewPos, setPreviewPos] = useState({ x: 50, y: 50 });
    const dragRef = useRef<{ startX: number, startY: number, startPosX: number, startPosY: number, currentX: number, currentY: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (isPositioning) {
            const [x, y] = (item.objectPosition as string || '50% 50%').split(' ').map(s => parseFloat(s));
            setPreviewPos({ x: isNaN(x) ? 50 : x, y: isNaN(y) ? 50 : y });
        }
    }, [isPositioning, item.objectPosition]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startPosX: previewPos.x,
            startPosY: previewPos.y,
            currentX: previewPos.x,
            currentY: previewPos.y
        };
        setIsDragging(true);
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!dragRef.current) return;
            const deltaX = e.clientX - dragRef.current.startX;
            const deltaY = e.clientY - dragRef.current.startY;

            const newX = Math.max(0, Math.min(100, dragRef.current.startPosX - deltaX * 0.25));
            const newY = Math.max(0, Math.min(100, dragRef.current.startPosY - deltaY * 0.25));

            dragRef.current.currentX = newX;
            dragRef.current.currentY = newY;
            setPreviewPos({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            if (dragRef.current) {
                updateItem(id, 'objectPosition', `${Math.round(dragRef.current.currentX)}% ${Math.round(dragRef.current.currentY)}%`);
            }
            dragRef.current = null;
            setIsDragging(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, id, updateItem]);

    return (
        <>
            <Card withBorder shadow="sm" radius="md" mb="sm" ref={setNodeRef} style={style} {...attributes}>
                <Group align="flex-start">
                    <div {...listeners} style={{ cursor: 'grab', marginTop: '5px' }}>
                        <IconDragDrop size={20} color="gray" />
                    </div>

                    <Box style={{ flex: 1 }}>
                        <TextInput
                            label="Title"
                            value={item.title}
                            onChange={(e) => updateItem(id, 'title', e.currentTarget.value)}
                            mb="xs"
                        />
                        {(enableSlug || item.slug !== undefined) && (
                            <TextInput
                                label="URL Slug (e.g. project-name)"
                                value={item.slug || ''}
                                onChange={(e) => updateItem(id, 'slug', e.currentTarget.value)}
                                mb="xs"
                                placeholder="my-cool-project"
                            />
                        )}
                        {(enableSubtitle || item.subtitle !== undefined) && (
                            <TextInput
                                label="Subtitle (e.g. Role / Character)"
                                value={item.subtitle || ''}
                                onChange={(e) => updateItem(id, 'subtitle', e.currentTarget.value)}
                                mb="xs"
                            />
                        )}
                        {(enableDate || item.dateFrom !== undefined || item.dateTo !== undefined) && (
                            <Group grow mb="xs">
                                <TextInput
                                    label="Date From"
                                    placeholder="e.g. Jan 2023"
                                    value={item.dateFrom || ''}
                                    onChange={(e) => updateItem(id, 'dateFrom', e.currentTarget.value)}
                                />
                                <TextInput
                                    label="Date To"
                                    placeholder="e.g. Present"
                                    value={item.dateTo || ''}
                                    onChange={(e) => updateItem(id, 'dateTo', e.currentTarget.value)}
                                />
                            </Group>
                        )}
                        <Group align="flex-end" gap="xs">
                            <TextInput
                                label={isVideo ? 'Video URL' : 'Image URL'}
                                value={item.src}
                                onChange={(e) => updateItem(id, 'src', e.currentTarget.value)}
                                style={{ flex: 1 }}
                            />
                            {!isVideo && (
                                <>
                                    <Button
                                        variant="light"
                                        color="gray"
                                        onClick={() => setIsPositioning(true)}
                                        title="Adjust Image Position"
                                        px="xs"
                                    >
                                        <IconFocus size={20} />
                                    </Button>
                                    <FileButton onChange={handleFileUpload} accept="image/*">
                                        {(props) => (
                                            <ActionIcon {...props} variant="light" color="gold" size="lg" loading={isUploading}>
                                                <IconUpload size={20} />
                                            </ActionIcon>
                                        )}
                                    </FileButton>
                                </>
                            )}
                        </Group>
                    </Box>

                    <ActionIcon color="red" variant="subtle" onClick={() => removeItem(id)} mt={5}>
                        <IconTrash size={20} />
                    </ActionIcon>
                </Group>
            </Card>

            <Modal
                opened={isPositioning}
                onClose={() => setIsPositioning(false)}
                title="Adjust Thumbnail Position"
                size="lg"
                zIndex={1000001}
            >
                <Stack>
                    <Text size="sm" c="dimmed">
                        Drag the image to position it within the frame. This updates the thumbnail view.
                    </Text>
                    <Box
                        onMouseDown={handleMouseDown}
                        style={{
                            position: 'relative',
                            height: '250px',
                            width: '370px',
                            margin: '0 auto',
                            overflow: 'hidden',
                            borderRadius: '8px',
                            cursor: 'move',
                            backgroundColor: '#f1f1f1',
                            border: '1px solid #ccc',
                            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        <img
                            src={item.src}
                            draggable={false}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: `${previewPos.x}% ${previewPos.y}%`,
                                pointerEvents: 'none',
                                userSelect: 'none'
                            }}
                        />
                    </Box>
                    <Group justify="center">
                        <Text size="xs" c="dimmed">Position: {Math.round(previewPos.x)}% {Math.round(previewPos.y)}%</Text>
                    </Group>
                    <Group justify="flex-end">
                        <Button onClick={() => {
                            updateItem(id, 'objectPosition', `${Math.round(previewPos.x)}% ${Math.round(previewPos.y)}%`);
                            setIsPositioning(false);
                        }}>Done</Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}

interface EditableListProps {
    contentKey: string;
    defaultItems: ListItem[];
    renderItem: (item: ListItem, index: number) => React.ReactNode;
    title?: string;
    itemContainer?: React.ElementType;
    itemContainerProps?: React.ComponentProps<React.ElementType>;
    enableSlug?: boolean;
    enableSubtitle?: boolean;
    enableDate?: boolean;
    appendItems?: React.ReactNode;
}

export function EditableList({ contentKey, defaultItems, renderItem, title, itemContainer: Container, itemContainerProps, enableSlug, enableSubtitle, enableDate, appendItems }: EditableListProps) {
    const { content, updateContent, isEditable } = useContent();
    const items = (content[contentKey] as ListItem[]) || defaultItems;

    const [opened, { open: openModal, close }] = useDisclosure(false);
    const [tempItems, setTempItems] = useState<ListItem[]>([]);

    const handleOpen = () => {
        const hydrated = items.map((it) => ({ ...it, _id: it._id || Math.random().toString(36).substr(2, 9) }));
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

    const handleUpdateItem = (id: string, field: string, value: string) => {
        setTempItems(prev => prev.map(item => item._id === id ? { ...item, [field]: value } : item));
    };

    const handleRemoveItem = (id: string) => {
        if (confirm('Delete this item?')) {
            setTempItems(prev => prev.filter(item => item._id !== id));
        }
    };

    const handleAddItem = () => {
        setTempItems(prev => [...prev, { _id: Math.random().toString(36).substr(2, 9), title: 'New Item', src: '' }]);
    };

    const handleSave = () => {
        updateContent(contentKey, tempItems);
        close();
    };

    const renderEditableOverlay = () => {
        if (!isEditable) return null;
        return (
            <Group justify="center" mb="lg">
                <Button
                    leftSection={<IconMenuOrder size={16} />}
                    variant="outline"
                    color="gold"
                    onClick={handleOpen}
                    c="dark"
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                >
                    Manage {title || 'List'}
                </Button>
            </Group>
        );
    };

    const listContent = items.map((item: ListItem, index: number) => renderItem(item, index));

    return (
        <>
            {renderEditableOverlay()}

            {Container ? (
                <Container {...itemContainerProps}>
                    {listContent}
                    {appendItems}
                </Container>
            ) : (
                <>
                    {listContent}
                    {appendItems}
                </>
            )}

            <Modal opened={opened} onClose={close} title={`Manage ${title || 'Items'}`} size="lg" zIndex={1000000}>
                <Stack>
                    <Text size="sm" c="dimmed">Drag items to reorder. Edit text fields to change content.</Text>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={tempItems.map(i => i._id)} strategy={verticalListSortingStrategy}>
                            {tempItems.map(item => (
                                <SortableItem
                                    key={item._id}
                                    id={item._id}
                                    item={item}
                                    removeItem={handleRemoveItem}
                                    updateItem={handleUpdateItem}
                                    enableSlug={enableSlug}
                                    enableSubtitle={enableSubtitle}
                                    enableDate={enableDate}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    <Button leftSection={<IconPlus size={16} />} variant="light" onClick={handleAddItem}>Add New Item</Button>

                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={close}>Cancel</Button>
                        <Button leftSection={<IconDeviceFloppy size={16} />} onClick={handleSave} color="gold" c="dark">Save Changes</Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
