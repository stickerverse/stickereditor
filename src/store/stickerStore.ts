import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

interface Material {
  id: string;
  name: string;
  type: 'vinyl' | 'paper' | 'holographic' | 'transparent';
  price: number;
  durability: number;
  preview: string;
  description: string;
  features: string[];
}

interface StickerConfiguration {
  material: Material | null;
  dimensions: {
    width: number;
    height: number;
    unit: 'inches' | 'cm';
  };
  quantity: number;
  outlineType: 'contour' | 'square' | 'circle' | 'custom';
  bleedSize: number;
  price: number;
}

interface OnboardingState {
  isFirstVisit: boolean;
  currentStep: number;
  completedSteps: string[];
  tooltipsShown: string[];
}

interface UserActivity {
  lastAction: string;
  timestamp: number;
  sessionDuration: number;
}

interface StickerStore {
  // Configuration
  configuration: StickerConfiguration;
  updateConfiguration: (config: Partial<StickerConfiguration>) => void;
  
  // Materials
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  selectMaterial: (material: Material) => void;
  
  // UI State
  activePanel: string;
  setActivePanel: (panel: string) => void;
  isPanelAnimating: boolean;
  setPanelAnimating: (animating: boolean) => void;
  
  // Onboarding & Help
  onboarding: OnboardingState;
  updateOnboarding: (state: Partial<OnboardingState>) => void;
  completeOnboardingStep: (step: string) => void;
  
  // User Activity
  userActivity: UserActivity;
  trackActivity: (action: string) => void;
  
  // Pricing
  calculatePrice: () => number;
  bulkDiscounts: { quantity: number; discount: number }[];
  
  // Undo/Redo for configuration
  configHistory: StickerConfiguration[];
  configHistoryIndex: number;
  undoConfig: () => void;
  redoConfig: () => void;
  
  // Auto-save
  lastSaved: number | null;
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
}

const defaultConfiguration: StickerConfiguration = {
  material: null,
  dimensions: { width: 3, height: 3, unit: 'inches' },
  quantity: 10,
  outlineType: 'contour',
  bleedSize: 0.125,
  price: 0,
};

const useStickerStore = create<StickerStore>()(
  devtools(
    persist(
      subscribeWithSelector((set, get) => ({
        // Configuration
        configuration: defaultConfiguration,
        updateConfiguration: (config) => {
          const currentConfig = get().configuration;
          const newConfig = { ...currentConfig, ...config };
          
          set((state) => ({
            configuration: newConfig,
            configHistory: [...state.configHistory.slice(0, state.configHistoryIndex + 1), newConfig],
            configHistoryIndex: state.configHistoryIndex + 1,
            isDirty: true,
          }));
          
          // Recalculate price
          get().calculatePrice();
        },
        
        // Materials
        materials: [],
        setMaterials: (materials) => set({ materials }),
        selectMaterial: (material) => {
          get().updateConfiguration({ material });
        },
        
        // UI State
        activePanel: 'Templates',
        setActivePanel: (panel) => set({ activePanel: panel }),
        isPanelAnimating: false,
        setPanelAnimating: (animating) => set({ isPanelAnimating: animating }),
        
        // Onboarding
        onboarding: {
          isFirstVisit: true,
          currentStep: 0,
          completedSteps: [],
          tooltipsShown: [],
        },
        updateOnboarding: (state) => 
          set((s) => ({ onboarding: { ...s.onboarding, ...state } })),
        completeOnboardingStep: (step) =>
          set((s) => ({
            onboarding: {
              ...s.onboarding,
              completedSteps: [...s.onboarding.completedSteps, step],
            },
          })),
        
        // User Activity
        userActivity: {
          lastAction: '',
          timestamp: Date.now(),
          sessionDuration: 0,
        },
        trackActivity: (action) =>
          set({
            userActivity: {
              lastAction: action,
              timestamp: Date.now(),
              sessionDuration: Date.now() - get().userActivity.timestamp,
            },
          }),
        
        // Pricing
        calculatePrice: () => {
          const { material, dimensions, quantity } = get().configuration;
          if (!material) return 0;
          
          const area = dimensions.width * dimensions.height;
          const basePrice = material.price * area;
          const bulkDiscounts = get().bulkDiscounts;
          
          const applicableDiscount = bulkDiscounts
            .filter((d) => quantity >= d.quantity)
            .sort((a, b) => b.discount - a.discount)[0];
          
          const discount = applicableDiscount ? applicableDiscount.discount : 0;
          const totalPrice = basePrice * quantity * (1 - discount / 100);
          
          set((state) => ({
            configuration: { ...state.configuration, price: totalPrice },
          }));
          
          return totalPrice;
        },
        
        bulkDiscounts: [
          { quantity: 50, discount: 20 },
          { quantity: 100, discount: 30 },
          { quantity: 500, discount: 40 },
        ],
        
        // History
        configHistory: [defaultConfiguration],
        configHistoryIndex: 0,
        undoConfig: () => {
          const { configHistoryIndex, configHistory } = get();
          if (configHistoryIndex > 0) {
            set({
              configHistoryIndex: configHistoryIndex - 1,
              configuration: configHistory[configHistoryIndex - 1],
            });
          }
        },
        redoConfig: () => {
          const { configHistoryIndex, configHistory } = get();
          if (configHistoryIndex < configHistory.length - 1) {
            set({
              configHistoryIndex: configHistoryIndex + 1,
              configuration: configHistory[configHistoryIndex + 1],
            });
          }
        },
        
        // Auto-save
        lastSaved: null,
        isDirty: false,
        markDirty: () => set({ isDirty: true }),
        markClean: () => set({ isDirty: false, lastSaved: Date.now() }),
      })),
      {
        name: 'sticker-editor-storage',
        partialize: (state) => ({
          configuration: state.configuration,
          onboarding: state.onboarding,
          materials: state.materials,
        }),
      }
    )
  )
);

export default useStickerStore;