import React, { createContext, useContext, useState, useEffect } from 'react';



type ContentMap = Record<string, unknown>;

const initialContent: ContentMap = {};

interface ContentContextType {
    content: ContentMap;
    updateContent: (key: string, value: unknown) => void;
    bulkUpdate: (updates: Record<string, unknown>) => void;
    publish: () => Promise<void>;
    getVersions: () => Promise<unknown[]>;
    revertToVersion: (versionId: string) => Promise<void>;
    discardChanges: () => Promise<void>;
    isEditable: boolean;
    isAdmin: boolean;
    isStaged: boolean;
    isLoading: boolean;
    setEditable: (value: boolean) => void;
    login: (values: Record<string, unknown>) => Promise<boolean>;
    logout: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
    const [content, setContent] = useState<ContentMap>(initialContent);
    const [isEditable, setEditable] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStaged, setIsStaged] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const authRes = await fetch('/api/auth-check');
                const authData = await authRes.json().catch(() => ({ isAdmin: false }));
                const isAuthed = authData.isAdmin;

                if (isAuthed) {
                    setIsAdmin(true);
                    setEditable(true);
                } else {
                    setIsAdmin(false);
                    setEditable(false);
                }

                const endpoint = isAuthed ? '/api/content/staged' : '/api/content';
                const res = await fetch(endpoint);
                const data = await res.json();
                setContent(data);

                if (isAuthed) {
                    const liveRes = await fetch('/api/content');
                    const liveData = await liveRes.json();
                    if (JSON.stringify(liveData) !== JSON.stringify(data)) {
                        setIsStaged(true);
                    }
                }
            } catch (err) {
                console.error('Failed to sync content:', err);
                const local = localStorage.getItem('site_content');
                if (local) setContent(JSON.parse(local));
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, []);

    const saveToBackend = (data: ContentMap, staged: boolean = false) => {
        fetch(`/api/content${staged ? '?staged=true' : ''}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.error('Failed to save content to backend:', err));
    };

    const updateContent = (key: string, value: unknown) => {
        const newContent = { ...content, [key]: value };
        setContent(newContent);
        localStorage.setItem('site_content', JSON.stringify(newContent));
        saveToBackend(newContent, isAdmin);
        if (isAdmin) setIsStaged(true);
    };

    const bulkUpdate = (updates: Record<string, unknown>) => {
        const newContent = { ...content, ...updates };
        setContent(newContent);
        localStorage.setItem('site_content', JSON.stringify(newContent));
        saveToBackend(newContent, isAdmin);
        if (isAdmin) setIsStaged(true);
    };

    const publish = async () => {
        try {
            const res = await fetch('/api/publish', { method: 'POST' });
            if (res.ok) {
                setIsStaged(false);
                alert('Published successfully!');
            } else {
                const err = await res.json();
                alert(`Publish failed: ${err.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Publish failed:', err);
            alert('Failed to publish changes.');
        }
    };

    const getVersions = async () => {
        try {
            const res = await fetch('/api/versions');
            if (res.ok) return await res.json();
            return [];
        } catch (err) {
            console.error('Failed to fetch versions:', err);
            return [];
        }
    };

    const revertToVersion = async (versionId: string) => {
        try {
            const res = await fetch('/api/revert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ versionId })
            });
            if (res.ok) {
                const stagedRes = await fetch('/api/content/staged');
                const stagedData = await stagedRes.json();
                setContent(stagedData);
                setIsStaged(true);
                alert('Reverted to version. Review in edit mode before publishing.');
            }
        } catch (err) {
            console.error('Revert failed:', err);
            alert('Failed to revert version.');
        }
    };

    const discardChanges = async () => {
        try {
            const res = await fetch('/api/discard', { method: 'POST' });
            if (res.ok) {
                const liveRes = await fetch('/api/content');
                const liveData = await liveRes.json();
                setContent(liveData);
                setIsStaged(false);
                alert('All staged changes have been discarded.');
            }
        } catch (err) {
            console.error('Discard failed:', err);
            alert('Failed to discard changes.');
        }
    };

    const login = async (values: Record<string, unknown>) => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });

            if (res.ok) {
                setIsAdmin(true);
                setEditable(true);
                const stagedRes = await fetch('/api/content/staged');
                const stagedData = await stagedRes.json();
                setContent(stagedData);
                return true;
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Login failed');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            alert(message);
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
        } catch (err) {
            console.error('Logout failed on server:', err);
        } finally {
            setIsAdmin(false);
            setEditable(false);
            try {
                const res = await fetch('/api/content');
                const data = await res.json();
                setContent(data);
            } catch (err) {
                console.error('Failed to fetch live content after logout:', err);
            }
        }
    };

    return (
        <ContentContext.Provider value={{
            content,
            updateContent,
            bulkUpdate,
            publish,
            getVersions,
            revertToVersion,
            discardChanges,
            isEditable,
            isAdmin,
            isStaged,
            isLoading,
            setEditable,
            login,
            logout
        }}>
            {children}
        </ContentContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useContent() {
    const context = useContext(ContentContext);
    if (!context) throw new Error('useContent must be used within ContentProvider');
    return context;
}

