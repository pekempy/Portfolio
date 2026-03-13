import { Image, type ImageProps, FileButton, Button, Modal, Stack, Group, Box, LoadingOverlay, Text, NumberInput, Select, type MantineStyleProp } from '@mantine/core';
import { useContent } from '../../context/ContentContext';
import { getValue } from '../../utils/contentUtils';
import { useState, useEffect, useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconUpload, IconCheck, IconX } from '@tabler/icons-react';
import ReactCrop, { type Crop, centerCrop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import getCroppedImg from '../../utils/cropImage';

interface EditableImageProps extends ImageProps {
    contentKey: string;
    defaultValue: string;
    customTrigger?: React.ReactNode;
    loading?: 'lazy' | 'eager';
}

export function EditableImage({ contentKey, defaultValue, style, customTrigger, ...props }: EditableImageProps) {
    const { content, updateContent, isEditable } = useContent();
    const item = getValue(content[contentKey], defaultValue);
    const src = item.value as string;

    const [opened, { open, close }] = useDisclosure(false);
    const [tempSrc, setTempSrc] = useState(src);
    const [tempStyle, setTempStyle] = useState<React.CSSProperties>(item.style || {});
    const [isLoading, setIsLoading] = useState(false);

    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isCropping, setIsCropping] = useState(false);
    const [croppingImage, setCroppingImage] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const currentItem = getValue(content[contentKey], defaultValue);
        setTempSrc(currentItem.value as string);
        setTempStyle(currentItem.style || {});
    }, [content, contentKey, defaultValue]);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(
            {
                unit: '%',
                width: 90,
                height: 90,
            },
            width,
            height
        );
        setCrop(crop);
        setCompletedCrop({
            unit: 'px',
            width: width * 0.9,
            height: height * 0.9,
            x: width * 0.05,
            y: height * 0.05
        });
    }

    const handleSave = () => {
        updateContent(contentKey, { src: tempSrc, style: tempStyle });
        close();
    };

    const handleFileUpload = async (file: File | null) => {
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setCroppingImage(reader.result as string);
            setIsCropping(true);
        });
        reader.readAsDataURL(file);
    };

    const applyCrop = async () => {
        if (!croppingImage || !completedCrop || !imgRef.current) return;

        const image = imgRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const scaledCrop = {
            x: completedCrop.x * scaleX,
            y: completedCrop.y * scaleY,
            width: completedCrop.width * scaleX,
            height: completedCrop.height * scaleY
        };

        setIsLoading(true);
        try {
            const croppedImageBlob = await getCroppedImg(croppingImage, scaledCrop);
            if (croppedImageBlob) {
                const formData = new FormData();
                formData.append('file', croppedImageBlob, 'cropped.jpg');

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (data.url) {
                    setTempSrc(data.url);
                    setIsCropping(false);
                    setCroppingImage(null);
                }
            }
        } catch (err) {
            console.error('Crop/Upload failed:', err);
            alert('Failed to process image.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isEditable) {
        const containerStyle: MantineStyleProp = [
            {
                display: 'block',
                width: '100%',
                height: '100%',
                pointerEvents: 'auto',
            },
            style,
            item.style as React.CSSProperties
        ];

        return (
            <>
                {customTrigger ? (
                    <Box onClick={(e) => { e.preventDefault(); open(); }} style={{ cursor: 'pointer' }}>
                        {customTrigger}
                    </Box>
                ) : (
                    <Box
                        className="editable-image-container"
                        style={containerStyle}
                        onClick={(e) => {
                            e.preventDefault();
                            open();
                        }}
                    >
                        <Image
                            src={src}
                            {...props}
                            loading="lazy"
                            decoding="async"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectPosition: (item.style as React.CSSProperties)?.objectPosition || (style as React.CSSProperties)?.objectPosition,
                            }}
                        />
                        <Box
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                borderRadius: props.radius || 0
                            }}
                            className="hover-overlay"
                        >
                            <Group gap={5}>
                                <IconPencil size={24} />
                                <span>Edit Image</span>
                            </Group>
                        </Box>
                    </Box>
                )}

                <Modal
                    opened={opened}
                    onClose={() => { if (!isCropping) close(); }}
                    title={<Text fw={700}>IMAGE SETTINGS</Text>}
                    size={isCropping ? "xl" : "md"}
                    zIndex={1000000}
                    closeOnClickOutside={!isCropping}
                >
                    <LoadingOverlay visible={isLoading} />

                    {isCropping && croppingImage ? (
                        <Stack gap="md">
                            <Text fw={700} size="sm" c="gold">DRAG CORNERS TO CROP</Text>
                            <Box style={{ backgroundColor: '#222', borderRadius: '8px', overflow: 'auto', maxHeight: '70vh', padding: '10px' }}>
                                <ReactCrop
                                    crop={crop}
                                    onChange={c => setCrop(c)}
                                    onComplete={c => setCompletedCrop(c)}
                                >
                                    <img
                                        ref={imgRef}
                                        src={croppingImage}
                                        onLoad={onImageLoad}
                                        style={{ maxWidth: '100%', display: 'block' }}
                                    />
                                </ReactCrop>
                            </Box>
                            <Group justify="flex-end" mt="md">
                                <Button variant="subtle" color="gray" leftSection={<IconX size={16} />} onClick={() => { setIsCropping(false); setCroppingImage(null); }}>Discard</Button>
                                <Button leftSection={<IconCheck size={16} />} color="green" onClick={applyCrop}>Crop & Upload</Button>
                            </Group>
                        </Stack>
                    ) : (
                        <Stack gap="md">
                            <Box bg="gray.1" p="xs" style={{ borderRadius: '8px' }}>
                                <Image src={tempSrc} h={200} fit="contain" radius="md" />
                            </Box>

                            <Text fw={700} size="sm" c="gold">POSITION & FOCUS</Text>
                            <Select
                                label="Object Position (Non-destructive)"
                                description="Adjust how the image is centered inside its frame"
                                data={[
                                    { value: 'center', label: 'Center' },
                                    { value: 'top', label: 'Top' },
                                    { value: 'bottom', label: 'Bottom' },
                                    { value: 'left', label: 'Left' },
                                    { value: 'right', label: 'Right' },
                                ]}
                                value={(tempStyle as React.CSSProperties).objectPosition as string || 'center'}
                                onChange={(val) => setTempStyle(s => ({ ...s, objectPosition: val || undefined }))}
                                comboboxProps={{ zIndex: 1100000 }}
                            />

                            <Text fw={700} size="sm" c="gold" mt="sm">SPACING</Text>
                            <Group grow>
                                <NumberInput
                                    label="Margin Top"
                                    value={parseInt(String(tempStyle.marginTop || 0))}
                                    onChange={(val) => setTempStyle(s => ({ ...s, marginTop: val ? `${val}px` : undefined }))}
                                />
                                <NumberInput
                                    label="Margin Bottom"
                                    value={parseInt(String(tempStyle.marginBottom || 0))}
                                    onChange={(val) => setTempStyle(s => ({ ...s, marginBottom: val ? `${val}px` : undefined }))}
                                />
                            </Group>

                            <Text fw={700} size="sm" c="gold" mt="sm">REPLACE IMAGE</Text>
                            <Group grow>
                                <FileButton onChange={handleFileUpload} accept="image/png,image/jpeg,image/webp">
                                    {(props) => <Button {...props} variant="outline" color="gold" leftSection={<IconUpload size={14} />}>Upload & Crop New Image</Button>}
                                </FileButton>
                            </Group>

                            <Group justify="flex-end" mt="xl">
                                <Button variant="subtle" color="gray" onClick={close}>Cancel</Button>
                                <Button onClick={handleSave} color="gold" c="dark">Save Settings</Button>
                            </Group>
                        </Stack>
                    )}
                </Modal>
            </>
        );
    }

    const finalStyle: MantineStyleProp = [style, item.style as React.CSSProperties];
    return (
        <Image
            src={src}
            style={finalStyle}
            loading="lazy"
            decoding="async"
            {...props}
        />
    );
}
