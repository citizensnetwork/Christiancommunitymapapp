import { createContext, useContext, useState, ReactNode } from 'react';
import { citizens, contributors } from '../data/mock-data';

export type UserRole = 'citizen' | 'contributor' | 'admin';

export interface AppUser {
  id: string;
  name: string;
  profilePhoto: string;
  coverPhoto: string;
  bio: string;
  role: UserRole;
  // contributor extras
  orgName?: string;
  orgId?: string;
  involvementLevel?: string;
  followerCount?: number;
}

const citizenUser: AppUser = {
  id: citizens[0].id,
  name: citizens[0].name,
  profilePhoto: citizens[0].profilePhoto,
  coverPhoto: citizens[0].coverPhoto,
  bio: citizens[0].bio,
  role: 'citizen',
};

const contributorUser: AppUser = {
  id: contributors[0].id,
  name: 'Grace City Church',
  profilePhoto: contributors[0].profilePhoto,
  coverPhoto: contributors[0].coverPhoto,
  bio: contributors[0].bio,
  role: 'contributor',
  orgName: contributors[0].name,
  orgId: contributors[0].id,
  involvementLevel: contributors[0].involvementLevel,
  followerCount: contributors[0].followerCount,
};

const adminUser: AppUser = {
  id: 'admin-1',
  name: 'Kingdom Connect Admin',
  profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
  coverPhoto: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&h=400&fit=crop',
  bio: 'Platform administrator. Serving the Kingdom Connect community.',
  role: 'admin',
};

const DEMO_USERS: Record<UserRole, AppUser> = {
  citizen: citizenUser,
  contributor: contributorUser,
  admin: adminUser,
};

interface UserContextValue {
  user: AppUser;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isContributor: boolean;
  isCitizen: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('citizen');

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const user = DEMO_USERS[role];

  return (
    <UserContext.Provider value={{
      user,
      role,
      setRole,
      isAdmin: role === 'admin',
      isContributor: role === 'contributor' || role === 'admin',
      isCitizen: role === 'citizen',
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
