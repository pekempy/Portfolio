import { Text, Box, SimpleGrid } from '@mantine/core';
import { EditableList, type ListItem } from '../EditableList';
import { EditableText } from '../EditableText';
import { useContent } from '../../context/ContentContext';
import { type ExtendedCSSProperties } from '../../utils/contentUtils';

interface EditableStatsProps {
    contentKey: string;
    defaultStats?: ListItem[];
}

export function EditableStats({ contentKey, defaultStats }: EditableStatsProps) {
    const { content, updateContent } = useContent();
    const items = (content[contentKey] as ListItem[]) || defaultStats || [];

    const handleItemSave = (id: string, field: string, newVal: { text: string; style: ExtendedCSSProperties }) => {
        const newItems = items.map(item => item._id === id ? { ...item, [field === 'title' ? 'title' : 'subtitle']: newVal.text, [field === 'title' ? 'titleStyle' : 'subtitleStyle']: newVal.style } : item);
        updateContent(contentKey, newItems);
    };

    return (
        <EditableList
            contentKey={contentKey}
            defaultItems={items}
            title="Stats"
            itemFields={['title', 'subtitle']}
            enableSubtitle
            itemContainer={SimpleGrid}
            itemContainerProps={{ cols: 2, spacing: 'xl' }}
            renderItem={(item: ListItem) => (
                <Box key={item._id}>
                    <EditableText
                        value={{ text: item.title, style: (item.titleStyle as ExtendedCSSProperties) || {} }}
                        onSave={(val) => handleItemSave(item._id, 'title', val)}
                        as={Text}
                        size="sm"
                        c="dimmed"
                        tt="uppercase"
                        mb={5}
                        fw={700}
                        style={{ letterSpacing: '1px' }}
                    />
                    <EditableText
                        value={{ text: (item.subtitle as string) || '', style: (item.subtitleStyle as ExtendedCSSProperties) || {} }}
                        onSave={(val) => handleItemSave(item._id, 'subtitle', val)}
                        fw={500}
                    />
                </Box>
            )}
        />
    );
}
