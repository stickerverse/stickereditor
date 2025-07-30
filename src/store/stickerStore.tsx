import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Material {
  id: string;
  name: string;
  type: string;
  price: number;
  durability: number;
  preview: string;
  description: string;
  features: string[];
  icon: any;
  popular?: boolean;
  premium?: boolean;
  texture: string;
  finish: string;
}

export interface Configuration {
  material: Material | null;
  size: { width: number; height: number } | null;
  quantity: number;
}

interface StickerStoreContextType {
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  selectMaterial: (material: Material) => void;
  configuration: Configuration;
  setConfiguration: (config: Partial<Configuration>) => void;
}

const StickerStoreContext = createContext<StickerStoreContextType | undefined>(undefined);

interface StickerStoreProviderProps {
  children: ReactNode;
}

export const StickerStoreProvider: React.FC<StickerStoreProviderProps> = ({ children }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [configuration, setConfigurationState] = useState<Configuration>({
    material: null,
    size: null,
    quantity: 1,
  });

  const selectMaterial = (material: Material) => {
    setConfigurationState(prev => ({
      ...prev,
      material,
    }));
  };

  const setConfiguration = (config: Partial<Configuration>) => {
    setConfigurationState(prev => ({
      ...prev,
      ...config,
    }));
  };

  return (
    <StickerStoreContext.Provider
      value={{
        materials,
        setMaterials,
        selectMaterial,
        configuration,
        setConfiguration,
      }}
    >
      {children}
    </StickerStoreContext.Provider>
  );
};

const useStickerStore = (): StickerStoreContextType => {
  const context = useContext(StickerStoreContext);
  if (context === undefined) {
    throw new Error('useStickerStore must be used within a StickerStoreProvider');
  }
  return context;
};

export default useStickerStore;