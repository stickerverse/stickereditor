import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

// Interface for a single material option
interface Material {
  id: string;
  name: string;
  type: 'vinyl' | 'paper' | 'holographic' | 'transparent';
  price: number; // Price per square unit (e.g., square inch)
  durability: number; // A rating from 1-5
  preview: string; // URL to an image
  description: string;
  features: string[];
}

// The main configuration for the sticker being designed
interface StickerConfiguration {
  material: Material | null;
  dimensions: {
    width: number;
    height: number;
    unit: 'inches' | 'cm';
  };
  quantity: number;
  outlineType: 'contour' | 'square' | 'circle' | 'custom';
  bleedSize: number; // In inches
  price: number; // Total calculated price
}

// State related to user onboarding and help guides
interface OnboardingState {
  isFirstVisit: boolean;
  currentStep: number;
  completedSteps: string[];
  tooltipsShown: string[];
}

// Tracking user activity within the session
interface UserActivity {
  lastAction: string;
  timestamp: number;
  sessionDuration: number;
}

// The complete interface for our global state store
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
  
  // Undo/Redo for configuration changes
  configHistory: StickerConfiguration[];
  configHistoryIndex: number;
  undoConfig: () => void;
  redoConfig: () => void;
  
  // Auto-save status
  lastSaved: number | null;
  isDirty: boolean; // True if there are unsaved changes
  markDirty: () => void;
  markClean: () => void;
}

// Default state for a new user/session
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
        // Configuration State
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
          
          get().calculatePrice(); // Recalculate price on any configuration change
        },
        
        // Materials State
        materials: [],
        setMaterials: (materials) => set({ materials }),
        selectMaterial: (material) => {
          get().updateConfiguration({ material });
        },
        
        // UI Panel State
        activePanel: 'Templates', // Default active panel
        setActivePanel: (panel) => set({ activePanel: panel }),
        isPanelAnimating: false,
        setPanelAnimating: (animating) => set({ isPanelAnimating: animating }),
        
        // Onboarding State
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
        
        // User Activity Tracking
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
        
        // Pricing Logic
        calculatePrice: () => {
          const { material, dimensions, quantity } = get().configuration;
          if (!material) return 0;
          
          const area = dimensions.width * dimensions.height;
          const basePrice = material.price * area;
          const bulkDiscounts = get().bulkDiscounts;
          
          const applicableDiscount = bulkDiscounts
            .filter((d) => quantity >= d.quantity)
            .sort((a, b) => b.quantity - a.quantity)[0]; // Corrected sorting
          
          const discountPercentage = applicableDiscount ? applicableDiscount.discount : 0;
          const totalPrice = basePrice * quantity * (1 - discountPercentage / 100);
          
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
        
        // History (Undo/Redo)
        configHistory: [defaultConfiguration],
        configHistoryIndex: 0,
        undoConfig: () => {
          const { configHistoryIndex, configHistory } = get();
          if (configHistoryIndex > 0) {
            const newIndex = configHistoryIndex - 1;
            set({
              configHistoryIndex: newIndex,
              configuration: configHistory[newIndex],
              isDirty: true,
            });
          }
        },
        redoConfig: () => {
          const { configHistoryIndex, configHistory } = get();
          if (configHistoryIndex < configHistory.length - 1) {
            const newIndex = configHistoryIndex + 1;
            set({
              configHistoryIndex: newIndex,
              configuration: configHistory[newIndex],
              isDirty: true,
            });
          }
        },
        
        // Auto-save flags
        lastSaved: null,
        isDirty: false,
        markDirty: () => set({ isDirty: true }),
        markClean: () => set({ isDirty: false, lastSaved: Date.now() }),
      })),
      {
        name: 'sticker-editor-storage', // Name for localStorage key
        partialize: (state) => ({
          // Only persist these parts of the store
          configuration: state.configuration,
          onboarding: state.onboarding,
          materials: state.materials,
        }),
      }
    )
  )
);

export default useStickerStore;