import React from 'react';
import useStickerStore from '@/store/stickerStore';

// Example component showing how to use the new sticker store
export const StickerConfigPanel: React.FC = () => {
  const {
    configuration,
    updateConfiguration,
    activePanel,
    setActivePanel,
    materials,
    selectMaterial,
    calculatePrice,
  } = useStickerStore();

  const handleQuantityChange = (quantity: number) => {
    updateConfiguration({ quantity });
  };

  const handleDimensionChange = (width: number, height: number) => {
    updateConfiguration({
      dimensions: { ...configuration.dimensions, width, height }
    });
  };

  return (
    <div className="sticker-config-panel">
      <h3>Sticker Configuration</h3>
      
      <div className="config-section">
        <label>Dimensions</label>
        <input
          type="number"
          value={configuration.dimensions.width}
          onChange={(e) => handleDimensionChange(Number(e.target.value), configuration.dimensions.height)}
          placeholder="Width"
        />
        <input
          type="number"
          value={configuration.dimensions.height}
          onChange={(e) => handleDimensionChange(configuration.dimensions.width, Number(e.target.value))}
          placeholder="Height"
        />
        <span>{configuration.dimensions.unit}</span>
      </div>

      <div className="config-section">
        <label>Quantity</label>
        <input
          type="number"
          value={configuration.quantity}
          onChange={(e) => handleQuantityChange(Number(e.target.value))}
          min="1"
        />
      </div>

      <div className="config-section">
        <label>Material</label>
        <select
          value={configuration.material?.id || ''}
          onChange={(e) => {
            const material = materials.find(m => m.id === e.target.value);
            if (material) selectMaterial(material);
          }}
        >
          <option value="">Select material</option>
          {materials.map(material => (
            <option key={material.id} value={material.id}>
              {material.name} - ${material.price}
            </option>
          ))}
        </select>
      </div>

      <div className="price-section">
        <strong>Total Price: ${configuration.price.toFixed(2)}</strong>
      </div>

      <div className="panel-controls">
        <button 
          onClick={() => setActivePanel('Templates')}
          className={activePanel === 'Templates' ? 'active' : ''}
        >
          Templates
        </button>
        <button 
          onClick={() => setActivePanel('Materials')}
          className={activePanel === 'Materials' ? 'active' : ''}
        >
          Materials
        </button>
      </div>
    </div>
  );
};