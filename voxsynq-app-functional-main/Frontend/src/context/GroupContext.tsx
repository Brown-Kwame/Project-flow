import React, { createContext, useCallback, useContext, useState } from 'react';

const GroupContext = createContext({
  groups: [],
  setGroups: (groups: any[]) => {},
  updateGroup: (group: any) => {},
});

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<any[]>([]);

  const updateGroup = useCallback((updatedGroup: any) => {
    setGroups(prev => {
      const idx = prev.findIndex(g => g.id === updatedGroup.id);
      if (idx !== -1) {
        const newGroups = [...prev];
        newGroups[idx] = { ...newGroups[idx], ...updatedGroup };
        return newGroups;
      } else {
        return [...prev, updatedGroup];
      }
    });
  }, []);

  return (
    <GroupContext.Provider value={{ groups, setGroups, updateGroup }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = () => useContext(GroupContext).groups;
export const useSetGroups = () => useContext(GroupContext).setGroups;
export const useUpdateGroup = () => useContext(GroupContext).updateGroup;
export const useGroup = (groupId: number) => {
  const groups = useGroups();
  return groups.find(g => g.id === groupId);
}; 