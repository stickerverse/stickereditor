import { motion } from 'framer-motion';
import { Check, Crown } from 'lucide-react';
import { fadeInUp } from '@/utils/animations';
import { styled } from 'baseui';

const StyledMaterialCard = styled(motion.div, (props: any) => ({
  backgroundColor: props.$theme.colors.backgroundSecondary,
  border: `2px solid ${props.$theme.colors.borderOpaque}`,
  borderRadius: '16px',
  padding: '1rem',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  transformStyle: 'preserve-3d',
  perspective: '1000px',
  ':hover': {
    borderColor: props.$theme.colors.accent,
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledMaterialPreview = styled(motion.div, () => ({
  width: '100%',
  height: '150px',
  borderRadius: '12px',
  overflow: 'hidden',
  position: 'relative',
  marginBottom: '1rem',
  transformStyle: 'preserve-3d',
}));

const StyledMaterialImage = styled('img', () => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}));

const StyledMaterialContent = styled('div', () => ({
  position: 'relative',
}));

const StyledMaterialHeader = styled('div', () => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '0.5rem',
}));

const StyledMaterialName = styled('h3', (props: any) => ({
  fontSize: '1.125rem',
  fontWeight: 600,
  color: props.$theme.colors.contentPrimary,
  margin: 0,
}));

const StyledMaterialDescription = styled('p', (props: any) => ({
  fontSize: '0.875rem',
  color: props.$theme.colors.contentSecondary,
  marginBottom: '1rem',
  lineHeight: 1.4,
}));

const StyledMaterialIcon = styled('div', (props: any) => ({
  color: props.$theme.colors.accent,
}));

const StyledDurabilityContainer = styled('div', () => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '1rem',
}));

const StyledDurabilityLabel = styled('span', (props: any) => ({
  fontSize: '0.75rem',
  color: props.$theme.colors.contentSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}));

const StyledDurabilityBars = styled('div', () => ({
  display: 'flex',
  gap: '3px',
  flex: 1,
}));

const StyledPriceContainer = styled('div', () => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.25rem',
  marginBottom: '0.75rem',
}));

const StyledPriceValue = styled('span', (props: any) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: props.$theme.colors.contentPrimary,
}));

const StyledPriceUnit = styled('span', (props: any) => ({
  fontSize: '0.75rem',
  color: props.$theme.colors.contentSecondary,
}));

const StyledBadgesContainer = styled('div', () => ({
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
}));

const StyledSelectionIndicator = styled(motion.div, (props: any) => ({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  width: '24px',
  height: '24px',
  backgroundColor: props.$theme.colors.accent,
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  color: '#000',
}));

const StyledCompareCheckbox = styled(motion.div, () => ({
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  zIndex: 10,
}));

interface MaterialCardProps {
  material: any;
  isSelected: boolean;
  isComparing: boolean;
  onSelect: () => void;
  onHover: (id: string | null) => void;
  index: number;
  compareMode: boolean;
}

const MaterialCard = ({ 
  material, 
  isSelected, 
  isComparing,
  onSelect, 
  onHover,
  index,
  compareMode 
}: MaterialCardProps) => {
  const Icon = material.icon;

  return (
    <StyledMaterialCard
      className={`material-card ${isSelected ? 'selected' : ''} ${isComparing ? 'comparing' : ''}`}
      variants={fadeInUp}
      custom={index}
      whileHover={{ 
        y: -8,
        transition: { type: 'spring', stiffness: 300 }
      }}
      onHoverStart={() => onHover(material.id)}
      onHoverEnd={() => onHover(null)}
      onClick={onSelect}
      style={{
        transformStyle: 'preserve-3d',
        ...(isSelected && { borderColor: 'var(--accent)', backgroundColor: 'rgba(255, 215, 0, 0.05)' }),
        ...(isComparing && { borderColor: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.05)' })
      }}
    >
      {/* 3D Preview Layer */}
      <StyledMaterialPreview 
        whileHover={{
          rotateY: 15,
          rotateX: -15,
          transition: { duration: 0.4 }
        }}
      >
        <StyledMaterialImage 
          src={material.preview} 
          alt={material.name}
        />
        
        {/* Texture Overlay */}
        <motion.div 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
            mixBlendMode: 'multiply',
            backgroundImage: `url(${material.texture})`,
            backgroundSize: '50px 50px',
            pointerEvents: 'none'
          }}
        />

        {/* Finish Effect */}
        <motion.div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            ...(material.finish === 'glossy' && {
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)'
            }),
            ...(material.finish === 'matte' && {
              background: 'rgba(0, 0, 0, 0.1)'
            }),
            ...(material.finish === 'holographic' && {
              background: 'linear-gradient(45deg, rgba(255, 0, 0, 0.2), rgba(255, 154, 0, 0.2), rgba(208, 222, 33, 0.2), rgba(79, 220, 74, 0.2), rgba(63, 218, 216, 0.2), rgba(47, 201, 226, 0.2), rgba(28, 127, 238, 0.2), rgba(95, 21, 242, 0.2), rgba(186, 12, 248, 0.2), rgba(251, 7, 217, 0.2))',
              backgroundSize: '300% 300%',
              animation: 'holographicShift 3s ease infinite'
            })
          }}
        />
      </StyledMaterialPreview>

      {/* Content */}
      <StyledMaterialContent>
        <StyledMaterialHeader>
          <StyledMaterialName>{material.name}</StyledMaterialName>
          <StyledMaterialIcon>
            <Icon size={20} />
          </StyledMaterialIcon>
        </StyledMaterialHeader>

        <StyledMaterialDescription>{material.description}</StyledMaterialDescription>

        {/* Durability Indicator */}
        <StyledDurabilityContainer>
          <StyledDurabilityLabel>Durability</StyledDurabilityLabel>
          <StyledDurabilityBars>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: i < material.durability ? '#FFD700' : '#e5e7eb',
                  borderRadius: '2px',
                  transformOrigin: 'bottom'
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: i < material.durability ? 1 : 0.3 }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
              />
            ))}
          </StyledDurabilityBars>
        </StyledDurabilityContainer>

        {/* Price */}
        <StyledPriceContainer>
          <StyledPriceValue>${material.price.toFixed(2)}</StyledPriceValue>
          <StyledPriceUnit>per sq inch</StyledPriceUnit>
        </StyledPriceContainer>

        {/* Badges */}
        <StyledBadgesContainer>
          {material.popular && (
            <motion.span 
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor: '#4ade80',
                color: '#000'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              Popular Choice
            </motion.span>
          )}
          {material.premium && (
            <motion.span 
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#000'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              <Crown size={12} />
              Premium
            </motion.span>
          )}
        </StyledBadgesContainer>
      </StyledMaterialContent>

      {/* Selection Indicator */}
      <StyledSelectionIndicator 
        initial={false}
        animate={{
          scale: isSelected ? 1 : 0,
          opacity: isSelected ? 1 : 0
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <Check size={16} />
      </StyledSelectionIndicator>

      {/* Compare Checkbox */}
      {compareMode && (
        <StyledCompareCheckbox 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <input 
            type="checkbox" 
            checked={isComparing}
            onChange={() => {}}
            onClick={(e) => e.stopPropagation()}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </StyledCompareCheckbox>
      )}
    </StyledMaterialCard>
  );
};

export default MaterialCard;