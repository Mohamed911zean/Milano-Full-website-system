'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  city: string;
  area: string;
  setLocation: (city: string, area: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('location');
    if (saved) {
      const { city, area } = JSON.parse(saved);
      setCity(city);
      setArea(area);
    }
  }, []);

  const setLocation = (c: string, a: string) => {
    setCity(c);
    setArea(a);
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
