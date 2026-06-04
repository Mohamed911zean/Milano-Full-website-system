'use client';

import React, { createContext, useContext, useState } from 'react';

interface LocationContextType {
  city: string;
  area: string;
  setLocation: (city: string, area: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [{ city, area }, setSavedLocation] = useState(() => {
    if (typeof window === 'undefined') return { city: '', area: '' };
    try {
      const saved = localStorage.getItem('location');
      return saved ? JSON.parse(saved) as { city: string; area: string } : { city: '', area: '' };
    } catch {
      return { city: '', area: '' };
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setLocation = (c: string, a: string) => {
    setSavedLocation({ city: c, area: a });
    localStorage.setItem('location', JSON.stringify({ city: c, area: a }));
    setIsModalOpen(false);
  };

  return (
    <LocationContext.Provider value={{ city, area, setLocation, isModalOpen, setIsModalOpen }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
}
