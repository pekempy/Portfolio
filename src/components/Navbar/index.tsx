import { Group, Burger, Container, Drawer, Stack, useMantineTheme, Button, ActionIcon, Menu, Text, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLink, useNavigate } from 'react-router-dom';
import { IconChevronDown, IconHistory, IconPencil, IconWorldUpload, IconTrash } from '@tabler/icons-react';
import classes from './Navbar.module.css';
import { useContent } from '../../context/ContentContext';
import { EditableText } from '../EditableText';
import { useState } from 'react';

const links = [
    { link: '/', label: 'Home' },
    { link: '/about', label: 'About Me' },
    { link: '/reels', label: 'Reels' },
    { link: '/resume', label: 'Résumé' },
    { link: '/gallery', label: 'Gallery' },
    { link: '/work', label: 'Work' },
    { link: '/contact', label: 'Contact' },
];

export function Navbar() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const { isEditable, setEditable, isAdmin, logout, publish, isStaged, getVersions, revertToVersion, discardChanges } = useContent();
    interface Version {
        id: string;
        name: string;
        timestamp: string | number | Date;
    }
    const [versions, setVersions] = useState<Version[]>([]);

    const fetchVersions = async () => {
        const v = await getVersions();
        setVersions(v as Version[]);
    };

    const navKeys = links.map((_, i) => `nav.item.${i}`);

    const items = links.map((link, index) => (
        <EditableText
            key={link.label}
            as={NavLink}
            to={link.link}
            contentKey={`nav.item.${index}`}
            defaultValue={link.label}
            className={({ isActive }: { isActive: boolean }) =>
                `${classes.link} ${isActive ? classes.linkActive : ''}`
            }
            onClick={close}
            bulkStyleKeys={navKeys}
            extended
        />
    ));

    return (
        <header className={classes.header}>
            <Container size="xl" className={classes.inner}>
                <div className={classes.logo} style={{ fontFamily: theme.headings.fontFamily, fontWeight: 700, fontSize: '1.25rem' }}>
                    <EditableText
                        contentKey="site.title"
                        defaultValue="John Doe"
                        style={{ cursor: 'pointer' }}
                        onClick={() => { if (!isEditable) navigate('/'); }}
                    />
                </div>

                <Group gap={5} visibleFrom="sm">
                    {items}
                    {isAdmin && (
                        <Group gap="xs" ml="xl">
                            <Group gap={0}>
                                {isStaged && (
                                    <Button
                                        size="xs"
                                        color="green"
                                        variant="filled"
                                        leftSection={<IconWorldUpload size={14} />}
                                        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                                        onClick={() => {
                                            if (confirm('Publish all pending changes to live site?')) {
                                                publish();
                                            }
                                        }}
                                    >
                                        Publish
                                    </Button>
                                )}
                                <Menu shadow="md" width={250} position="bottom-end" onOpen={fetchVersions}>
                                    <Menu.Target>
                                        <ActionIcon
                                            size={30}
                                            variant="filled"
                                            color={isStaged ? "green" : "gray"}
                                            style={{
                                                borderTopLeftRadius: isStaged ? 0 : 4,
                                                borderBottomLeftRadius: isStaged ? 0 : 4
                                            }}
                                        >
                                            <IconChevronDown size={14} />
                                        </ActionIcon>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <Menu.Label>ACTIONS</Menu.Label>
                                        {isStaged && (
                                            <Menu.Item
                                                color="red"
                                                leftSection={<IconTrash size={14} />}
                                                onClick={() => {
                                                    if (confirm('Discard all pending changes and reset to live version? This cannot be undone.')) {
                                                        discardChanges();
                                                    }
                                                }}
                                            >
                                                Discard All Changes
                                            </Menu.Item>
                                        )}
                                        <Divider />
                                        <Menu.Label>VERSION HISTORY</Menu.Label>
                                        {versions.length === 0 && <Menu.Item disabled>No previous versions</Menu.Item>}
                                        {versions.map(v => (
                                            <Menu.Item
                                                key={v.id}
                                                leftSection={<IconHistory size={14} />}
                                                onClick={() => {
                                                    if (confirm(`Restore version from ${v.name}? Current staged changes will be replaced.`)) {
                                                        revertToVersion(v.id);
                                                    }
                                                }}
                                            >
                                                <Stack gap={0}>
                                                    <Text size="xs">{v.name}</Text>
                                                    <Text size="p" c="dimmed" style={{ fontSize: '10px' }}>{new Date(v.timestamp).toLocaleString()}</Text>
                                                </Stack>
                                            </Menu.Item>
                                        ))}
                                        <Divider />
                                        <Menu.Item c="dimmed" disabled>Snapshots created on publish</Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>

                            <ActionIcon
                                variant={isEditable ? 'filled' : 'outline'}
                                color="gold"
                                size="lg"
                                onClick={() => setEditable(!isEditable)}
                                title={isEditable ? 'Disable Edit Mode' : 'Enable Edit Mode'}
                            >
                                <IconPencil size={20} />
                            </ActionIcon>
                            <Button
                                color="red"
                                variant="subtle"
                                size="xs"
                                onClick={async () => {
                                    await logout();
                                    navigate('/');
                                }}
                            >
                                Logout
                            </Button>
                        </Group>
                    )}
                </Group>

                <Group hiddenFrom="sm">
                    {isAdmin && (
                        <Group gap="xs">
                            <Menu shadow="md" width={200} position="bottom-end" onOpen={fetchVersions}>
                                <Menu.Target>
                                    <ActionIcon variant="filled" color={isStaged ? "green" : "gray"}>
                                        <IconHistory size={18} />
                                    </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Label>ACTIONS</Menu.Label>
                                    {isStaged && (
                                        <>
                                            <Menu.Item
                                                color="red"
                                                leftSection={<IconTrash size={14} />}
                                                onClick={() => { if (confirm('Discard all?')) discardChanges(); }}
                                            >
                                                Discard Changes
                                            </Menu.Item>
                                            <Menu.Item
                                                color="green"
                                                leftSection={<IconWorldUpload size={14} />}
                                                onClick={() => { if (confirm('Publish?')) publish(); }}
                                            >
                                                Publish Staged
                                            </Menu.Item>
                                        </>
                                    )}
                                    <Divider />
                                    <Menu.Label>HISTORY</Menu.Label>
                                    {versions.map(v => (
                                        <Menu.Item key={v.id} onClick={() => revertToVersion(v.id)}>
                                            {v.name}
                                        </Menu.Item>
                                    ))}
                                </Menu.Dropdown>
                            </Menu>
                            <ActionIcon
                                variant={isEditable ? 'filled' : 'outline'}
                                color="gold"
                                size="md"
                                onClick={() => setEditable(!isEditable)}
                                mr="xs"
                            >
                                <IconPencil size={18} />
                            </ActionIcon>
                        </Group>
                    )}
                    <Burger opened={opened} onClick={toggle} size="sm" />
                </Group>

                <Drawer
                    opened={opened}
                    onClose={close}
                    size="100%"
                    padding="md"
                    title="Menu"
                    hiddenFrom="sm"
                    zIndex={1000000}
                >
                    <Stack>
                        {items}
                    </Stack>
                </Drawer>
            </Container>
        </header>
    );
}
