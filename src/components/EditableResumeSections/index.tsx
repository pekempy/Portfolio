import { Box, Title } from '@mantine/core';
import { EditableList, type ListItem } from '../EditableList';
import { EditableText } from '../EditableText';
import { useContent } from '../../context/ContentContext';
import { type ExtendedCSSProperties } from '../../utils/contentUtils';

interface EditableResumeSectionsProps {
    contentKey: string;
    defaultItems?: ListItem[];
}

export function EditableResumeSections({ contentKey, defaultItems }: EditableResumeSectionsProps) {
    const { content, updateContent } = useContent();
    const items = (content[contentKey] as ListItem[]) || defaultItems || [];

    const handleItemSave = (id: string, field: string, newVal: { text: string; style: ExtendedCSSProperties }) => {
        const newItems = items.map(item => item._id === id ? { ...item, [field]: newVal.text, [field === 'title' ? 'titleStyle' : 'style']: newVal.style } : item);
        updateContent(contentKey, newItems);
    };

    return (
        <EditableList
            contentKey={contentKey}
            defaultItems={items}
            title="Resume Sections"
            itemFields={['title', 'text']}
            renderItem={(item: ListItem) => (
                <Box key={item._id} mb="xl">
                    <Title order={3} mb="md" style={{ fontFamily: 'Playfair Display, serif' }}>
                        <EditableText
                            value={{ text: item.title, style: (item.titleStyle as ExtendedCSSProperties) || {} }}
                            onSave={(val) => handleItemSave(item._id, 'title', val)}
                        />
                    </Title>
                    <EditableText
                        value={{ text: (item.text as string) || '', style: (item.style as ExtendedCSSProperties) || {} }}
                        onSave={(val) => handleItemSave(item._id, 'text', val)}
                        multiline
                    />
                </Box>
            )}
        />
    );
}
