import { Button, FileButton, Group, Modal, Stack, TextInput, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDownload, IconPencil, IconUpload } from '@tabler/icons-react';
import { useContent } from '../../context/ContentContext';
import { useState } from 'react';
import { EditableText } from '../EditableText';

export function EditableResume() {
    const { content, updateContent, isEditable } = useContent();
    const resumeUrl = (typeof content['resume.file'] === 'string' ? content['resume.file'] : undefined) || '#';

    const [opened, { open, close }] = useDisclosure(false);
    const [tempUrl, setTempUrl] = useState(resumeUrl);

    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = async (file: File | null) => {
        if (!file) return;
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.url) setTempUrl(data.url);
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        updateContent('resume.file', tempUrl);
        close();
    };

    return (
        <>
            <Group>
                <EditableText
                    contentKey="resume.button"
                    defaultValue="Download Resume"
                    as={Button}
                    leftSection={<IconDownload size={20} />}
                    variant="outline"
                    color="gold"
                    component="a"
                    href={resumeUrl}
                    target="_blank"
                    download={resumeUrl !== '#' ? "Resume" : undefined}
                />
                {isEditable && (
                    <Button size="xs" color="gray" variant="subtle" onClick={open}>
                        <IconPencil size={16} />
                    </Button>
                )}
            </Group>

            <Modal opened={opened} onClose={close} title="Update Resume" zIndex={1000000}>
                <Stack>
                    <TextInput
                        label="Resume URL"
                        value={tempUrl}
                        onChange={(e) => setTempUrl(e.currentTarget.value)}
                    />

                    <FileButton onChange={handleFileUpload} accept="application/pdf">
                        {(props) => <Button {...props} variant="default" leftSection={<IconUpload size={14} />} loading={isLoading}>Upload PDF</Button>}
                    </FileButton>
                    <Text size="xs" c="dimmed">* Stored on server.</Text>

                    <Button onClick={handleSave} color="gold" c="dark">Save</Button>
                </Stack>
            </Modal>
        </>
    );
}
