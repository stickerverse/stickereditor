import { useEffect } from 'react';
import useAppContext from '@/hooks/useAppContext';
import useStickerStore from '@/store/stickerStore';

/**
 * Integration bridge between existing AppContext and new StickerStore
 * This demonstrates how both can work together without conflicts
 */
export const StickerAppBridge = () => {
  const { activePanel: appActivePanel, setActivePanel: setAppActivePanel } = useAppContext();
  const { 
    activePanel: stickerActivePanel, 
    setActivePanel: setStickerActivePanel,
    trackActivity,
    materials,
    setMaterials
  } = useStickerStore();

  // Sync panel states when needed
  useEffect(() => {
    if (appActivePanel !== stickerActivePanel) {
      // Track panel changes for analytics
      trackActivity(`Panel changed from ${stickerActivePanel} to ${appActivePanel}`);
      setStickerActivePanel(appActivePanel);
    }
  }, [appActivePanel, stickerActivePanel, setStickerActivePanel, trackActivity]);

  // Initialize default materials if empty
  useEffect(() => {
    if (materials.length === 0) {
      const defaultMaterials = [
        {
          id: 'vinyl-matte',
          name: 'Matte Vinyl',
          type: 'vinyl' as const,
          price: 0.15,
          durability: 5,
          preview: '/materials/vinyl-matte.jpg',
          description: 'Durable matte vinyl perfect for indoor and outdoor use',
          features: ['Waterproof', '5+ year durability', 'UV resistant']
        },
        {
          id: 'paper-eco',
          name: 'Eco Paper',
          type: 'paper' as const,
          price: 0.08,
          durability: 2,
          preview: '/materials/paper-eco.jpg',
          description: 'Recyclable paper stock for indoor applications',
          features: ['Recyclable', 'Indoor use', 'Cost effective']
        },
        {
          id: 'holographic',
          name: 'Holographic',
          type: 'holographic' as const,
          price: 0.25,
          durability: 4,
          preview: '/materials/holographic.jpg',
          description: 'Eye-catching holographic material with rainbow effect',
          features: ['Holographic effect', 'Premium look', 'Durable']
        }
      ];
      
      setMaterials(defaultMaterials);
      trackActivity('Initialized default materials');
    }
  }, [materials.length, setMaterials, trackActivity]);

  // This component doesn't render anything but manages integration
  return null;
};