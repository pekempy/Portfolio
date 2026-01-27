import { Text, Box } from '@mantine/core';
import { EditableList, type ListItem } from '../EditableList';
import { EditableText } from '../EditableText';
import { useContent } from '../../context/ContentContext';
import { type ExtendedCSSProperties } from '../../utils/contentUtils';

interface EditableParagraphsProps {
    contentKey: string;
    defaultValue?: string;
    defaultItems?: ListItem[];
}

export function EditableParagraphs({ contentKey, defaultValue, defaultItems }: EditableParagraphsProps) {
    const { content, updateContent } = useContent();
    const items = (content[contentKey] as ListItem[]) || defaultItems || (defaultValue ? [{ _id: '1', title: 'Start', text: defaultValue }] : []);

    const handleItemSave = (id: string, newVal: { text: string; style: ExtendedCSSProperties }) => {
        const newItems = items.map(item => item._id === id ? { ...item, ...newVal } : item);
        updateContent(contentKey, newItems);
    };

    return (
        <EditableList
            contentKey={contentKey}
            defaultItems={items}
            title="Paragraphs"
            itemFields={['text']}
            renderItem={(item: ListItem) => (
                <Box key={item._id} mb="md">
                    <EditableText
                        value={{ text: (item.text as string) || '', style: (item.style as ExtendedCSSProperties) || {} }}
                        onSave={(val) => handleItemSave(item._id, val)}
                        as={Text}
                        size="lg"
                        style={{ lineHeight: 1.8 }}
                        multiline
                    />
                </Box>
            )}
        />
    );
}
