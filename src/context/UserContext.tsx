import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface UserState {
  isAuthenticated: boolean;
  name: string;
  stage: string;
  focusAreas: string[];
  contentPreference: string;
  hasSeenTour: boolean;
  startedContent: string[];
  savedContent: string[];
}

interface UserContextType {
  user: UserState;
  login: () => void;
  signup: () => void;
  logout: () => void;
  setOnboardingData: (data: Partial<UserState>) => void;
  dismissTour: () => void;
  toggleSave: (contentId: string) => boolean;
  isSaved: (contentId: string) => boolean;
}

const defaultUser: UserState = {
  isAuthenticated: false,
  name: 'Maya',
  stage: 'Finding my footing',
  focusAreas: ['Sleep', 'Mindfulness'],
  contentPreference: 'Audio',
  hasSeenTour: false,
  startedContent: [],
  savedContent: [],
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(defaultUser);

  const login = () => setUser(prev => ({ ...prev, isAuthenticated: true }));
  const signup = () => setUser(prev => ({ ...prev, isAuthenticated: true }));
  const logout = () => setUser(prev => ({ ...prev, isAuthenticated: false }));
  const setOnboardingData = (data: Partial<UserState>) =>
    setUser(prev => ({ ...prev, ...data }));
  const dismissTour = () => setUser(prev => ({ ...prev, hasSeenTour: true }));

  const toggleSave = useCallback((contentId: string): boolean => {
    const already = user.savedContent.includes(contentId);
    setUser(prev => ({
      ...prev,
      savedContent: already
        ? prev.savedContent.filter(id => id !== contentId)
        : [...prev.savedContent, contentId],
    }));
    return !already;
  }, [user.savedContent]);

  const isSaved = useCallback((contentId: string): boolean => {
    return user.savedContent.includes(contentId);
  }, [user.savedContent]);

  return (
    <UserContext.Provider value={{ user, login, signup, logout, setOnboardingData, dismissTour, toggleSave, isSaved }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
