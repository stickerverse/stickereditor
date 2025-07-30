import { motion } from 'framer-motion';
import { X, Check, Minus } from 'lucide-react';
import { styled } from 'baseui';

const StyledComparisonOverlay = styled(motion.div, (props: any) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: props.$theme.colors.backgroundPrimary,
  zIndex: 100,
  overflow: 'auto',
}));

const StyledComparisonHeader = styled('div', (props: any) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.5rem 2rem',
  borderBottom: `1px solid ${props.$theme.colors.borderOpaque}`,
}));

const StyledComparisonTitle = styled('h3', (props: any) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: props.$theme.colors.contentPrimary,
  margin: 0,
}));

const StyledCloseButton = styled('button', (props: any) => ({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: props.$theme.colors.backgroundSecondary,
  border: 'none',
  color: props.$theme.colors.contentSecondary,
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: props.$theme.colors.negative,
    color: 'white',
  },
}));

const StyledComparisonTable = styled('div', () => ({
  padding: '2rem',
}));

const StyledComparisonRow = styled('div', () => ({
  display: 'grid',
  gridTemplateColumns: '200px repeat(auto-fit, minmax(150px, 1fr))',
  gap: '1rem',
  padding: '1rem 0',
  alignItems: 'center',
}));

const StyledComparisonCell = styled('div', (props: any) => ({
  textAlign: 'center',
  color: props.$theme.colors.contentSecondary,
  fontSize: '0.875rem',
  ':first-child': {
    textAlign: 'left',
    fontWeight: 500,
  },
}));

const StyledHeaderRow = styled(StyledComparisonRow, (props: any) => ({
  fontWeight: 600,
  color: props.$theme.colors.contentPrimary,
  borderBottom: `2px solid ${props.$theme.colors.accent}`,
}));

const StyledMaterialImage = styled('img', () => ({
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '0.5rem',
}));

const StyledDurabilityDots = styled('div', () => ({
  display: 'flex',
  gap: '4px',
  justifyContent: 'center',
  marginBottom: '0.25rem',
}));

const StyledDurabilityDot = styled('div', (props: any) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: props.$active ? props.$theme.colors.accent : props.$theme.colors.backgroundSecondary,
}));

const StyledSelectButton = styled(motion.button, (props: any) => ({
  width: '100%',
  padding: '0.75rem 1.5rem',
  backgroundColor: props.$theme.colors.accent,
  border: 'none',
  borderRadius: '8px',
  color: '#000',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(255, 215, 0, 0.3)',
  },
}));

interface MaterialComparisonProps {
  materialIds: string[];
  materials: any[];
  onClose: () => void;
  onSelect: (material: any) => void;
}

const MaterialComparison = ({ materialIds, materials, onClose, onSelect }: MaterialComparisonProps) => {
  const selectedMaterials = materials.filter(m => materialIds.includes(m.id));
  
  const features = [
    'Waterproof',
    'UV Resistant',
    'Dishwasher safe',
    'Outdoor durability',
    'Removable',
    'Writable surface',
    'Premium finish',
  ];

  const hasFeature = (material: any, feature: string) => {
    return material.features.some((f: string) => 
      f.toLowerCase().includes(feature.toLowerCase())
    );
  };

  return (
    <StyledComparisonOverlay 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <StyledComparisonHeader>
        <StyledComparisonTitle>Material Comparison</StyledComparisonTitle>
        <StyledCloseButton onClick={onClose}>
          <X size={20} />
        </StyledCloseButton>
      </StyledComparisonHeader>

      <StyledComparisonTable>
        <StyledHeaderRow>
          <StyledComparisonCell>Features</StyledComparisonCell>
          {selectedMaterials.map(material => (
            <StyledComparisonCell key={material.id}>
              <StyledMaterialImage src={material.preview} alt={material.name} />
              <h4 style={{ margin: 0, fontSize: '1rem' }}>{material.name}</h4>
            </StyledComparisonCell>
          ))}
        </StyledHeaderRow>

        {/* Price Row */}
        <StyledComparisonRow style={{ borderBottom: '1px solid #e5e7eb' }}>
          <StyledComparisonCell>Price per sq inch</StyledComparisonCell>
          {selectedMaterials.map(material => (
            <StyledComparisonCell key={material.id}>
              <strong>${material.price.toFixed(2)}</strong>
            </StyledComparisonCell>
          ))}
        </StyledComparisonRow>

        {/* Durability Row */}
        <StyledComparisonRow style={{ borderBottom: '1px solid #e5e7eb' }}>
          <StyledComparisonCell>Durability</StyledComparisonCell>
          {selectedMaterials.map(material => (
            <StyledComparisonCell key={material.id}>
              <StyledDurabilityDots>
                {[...Array(5)].map((_, i) => (
                  <StyledDurabilityDot
                    key={i}
                    $active={i < material.durability}
                  />
                ))}
              </StyledDurabilityDots>
              <span>{material.durability}/5 years</span>
            </StyledComparisonCell>
          ))}
        </StyledComparisonRow>

        {/* Features */}
        {features.map(feature => (
          <StyledComparisonRow key={feature} style={{ borderBottom: '1px solid #e5e7eb' }}>
            <StyledComparisonCell>{feature}</StyledComparisonCell>
            {selectedMaterials.map(material => (
              <StyledComparisonCell key={material.id}>
                {hasFeature(material, feature) ? (
                  <Check size={20} style={{ color: '#4ade80' }} />
                ) : (
                  <Minus size={20} style={{ color: '#9ca3af', opacity: 0.3 }} />
                )}
              </StyledComparisonCell>
            ))}
          </StyledComparisonRow>
        ))}

        {/* Action Row */}
        <StyledComparisonRow style={{ borderBottom: 'none', paddingTop: '2rem' }}>
          <StyledComparisonCell></StyledComparisonCell>
          {selectedMaterials.map(material => (
            <StyledComparisonCell key={material.id}>
              <StyledSelectButton
                onClick={() => onSelect(material)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Select This Material
              </StyledSelectButton>
            </StyledComparisonCell>
          ))}
        </StyledComparisonRow>
      </StyledComparisonTable>
    </StyledComparisonOverlay>
  );
};

export default MaterialComparison;