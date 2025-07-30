import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info, Sparkles, Shield, Droplets, Eye } from 'lucide-react';
import { Input } from 'baseui/input';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { styled } from 'baseui';
import useStickerStore from '@/store/stickerStore';
import MaterialCard from '@/components/MaterialCard/MaterialCard';
import MaterialComparison from './MaterialComparison';
import { panelVariants, staggerChildren } from '@/utils/animations';

const StyledMaterialPanel = styled(motion.div, (props: any) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: props.$theme.colors.backgroundPrimary,
}));

const StyledPanelHeader = styled('div', (props: any) => ({
  padding: '2rem 2rem 1rem',
  borderBottom: `1px solid ${props.$theme.colors.borderOpaque}`,
}));

const StyledPanelTitle = styled('h2', (props: any) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: props.$theme.colors.contentPrimary,
  marginBottom: '0.5rem',
  margin: 0,
}));

const StyledPanelSubtitle = styled('p', (props: any) => ({
  fontSize: '0.875rem',
  color: props.$theme.colors.contentSecondary,
  margin: 0,
}));

const StyledMaterialControls = styled('div', () => ({
  padding: '1.5rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}));

const StyledMaterialFilters = styled('div', () => ({
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
}));

const StyledFilterChip = styled(motion.button, (props: any) => ({
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  backgroundColor: props.$active ? props.$theme.colors.accent : props.$theme.colors.backgroundSecondary,
  border: `1px solid ${props.$active ? props.$theme.colors.accent : props.$theme.colors.borderOpaque}`,
  color: props.$active ? '#000' : props.$theme.colors.contentSecondary,
  fontSize: '0.875rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease',
  ':hover': {
    borderColor: props.$theme.colors.accent,
    color: props.$active ? '#000' : props.$theme.colors.contentPrimary,
  },
}));

const StyledCompareToggle = styled(motion.button, (props: any) => ({
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  backgroundColor: props.$active ? '#4ade80' : props.$theme.colors.backgroundSecondary,
  border: `1px solid ${props.$active ? '#4ade80' : props.$theme.colors.borderOpaque}`,
  color: props.$active ? '#000' : props.$theme.colors.contentPrimary,
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.2s ease',
  alignSelf: 'flex-start',
  ':hover': {
    borderColor: '#4ade80',
    color: props.$active ? '#000' : '#4ade80',
  },
}));

const StyledMaterialContent = styled('div', () => ({
  flex: 1,
  overflow: 'hidden',
  position: 'relative',
}));

const StyledMaterialsGrid = styled(motion.div, () => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '1.5rem',
  padding: '0 2rem 2rem',
}));

const StyledPopularBadge = styled(motion.div, () => ({
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  backgroundColor: '#4ade80',
  color: '#000',
  padding: '0.75rem 1.5rem',
  borderRadius: '30px',
  fontSize: '0.875rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  boxShadow: '0 10px 25px rgba(74, 222, 128, 0.3)',
  zIndex: 10,
}));

const StyledMaterialInfoFooter = styled(motion.div, (props: any) => ({
  padding: '1.5rem 2rem',
  borderTop: `1px solid ${props.$theme.colors.borderOpaque}`,
  backgroundColor: props.$theme.colors.backgroundSecondary,
}));

const StyledMaterialFeatures = styled('div', () => ({
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
}));

const StyledFeatureTag = styled(motion.span, (props: any) => ({
  padding: '0.375rem 0.75rem',
  backgroundColor: props.$theme.colors.backgroundPrimary,
  borderRadius: '20px',
  fontSize: '0.75rem',
  color: props.$theme.colors.contentSecondary,
  border: `1px solid ${props.$theme.colors.borderOpaque}`,
}));

const materialData = [
  {
    id: 'vinyl-white',
    name: 'White Vinyl',
    type: 'vinyl',
    price: 0.10,
    durability: 5,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM2MzYzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5XaGl0ZTwvdGV4dD48L3N2Zz4=',
    description: 'Premium white vinyl with strong adhesive',
    features: ['Waterproof', 'UV Resistant', '5+ years outdoor', 'Dishwasher safe'],
    icon: Shield,
    popular: true,
    texture: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
    finish: 'matte',
  },
  {
    id: 'vinyl-clear',
    name: 'Clear Vinyl',
    type: 'transparent',
    price: 0.12,
    durability: 5,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iNSw1Ii8+PHRleHQgeD0iNTAiIHk9IjU1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2MzYzNjMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNsZWFyPC90ZXh0Pjwvc3ZnPg==',
    description: 'Transparent vinyl for glass and windows',
    features: ['Crystal clear', 'No background', 'Window safe', 'Removable'],
    icon: Eye,
    texture: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjwvc3ZnPg==',
    finish: 'glossy',
  },
  {
    id: 'holographic',
    name: 'Holographic',
    type: 'holographic',
    price: 0.15,
    durability: 4,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImhvbG8iIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHNvcC1jb2xvcj0iI2ZmMDA3ZiIvPjxzdG9wIG9mZnNldD0iMjAlIiBzdG9wLWNvbG9yPSIjZmZmZjAwIi8+PHN0b3Agb2Zmc2V0PSI0MCUiIHN0b3AtY29sb3I9IiMwMGZmMDAiLz48c3RvcCBvZmZzZXQ9IjYwJSIgc3RvcC1jb2xvcj0iIzAwZmZmZiIvPjxzdG9wIG9mZnNldD0iODAlIiBzdG9wLWNvbG9yPSIjODAwMGZmIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmYwMDdmIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjaG9sbykiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SG9sbzwvdGV4dD48L3N2Zz4=',
    description: 'Eye-catching rainbow effect vinyl',
    features: ['Rainbow effect', 'Premium look', 'Indoor/outdoor', 'Unique finish'],
    icon: Sparkles,
    premium: true,
    texture: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJob2xvU21hbGwiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjAwN2YiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzAwZmZmZiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmMDA3ZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0idXJsKCNob2xvU21hbGwpIi8+PC9zdmc+',
    finish: 'holographic',
  },
  {
    id: 'paper-matte',
    name: 'Matte Paper',
    type: 'paper',
    price: 0.08,
    durability: 2,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjM2MzYzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QYXBlcjwvdGV4dD48L3N2Zz4=',
    description: 'Affordable matte paper stickers',
    features: ['Budget friendly', 'Matte finish', 'Indoor use', 'Easy to write on'],
    icon: Droplets,
    texture: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZWRlZGVkIi8+PC9zdmc+',
    finish: 'matte',
  },
];

const MaterialPanel = () => {
  const { materials, setMaterials, selectMaterial, configuration } = useStickerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [hoveredMaterial, setHoveredMaterial] = useState<string | null>(null);

  useEffect(() => {
    // Initialize materials in store
    setMaterials(materialData);
  }, [setMaterials]);

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filter || material.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleMaterialSelect = (material: any) => {
    if (compareMode) {
      if (selectedForComparison.includes(material.id)) {
        setSelectedForComparison(selectedForComparison.filter(id => id !== material.id));
      } else if (selectedForComparison.length < 3) {
        setSelectedForComparison([...selectedForComparison, material.id]);
      }
    } else {
      selectMaterial(material);
    }
  };

  const materialTypes = [
    { id: 'all', label: 'All Materials', icon: null },
    { id: 'vinyl', label: 'Vinyl', icon: Shield },
    { id: 'paper', label: 'Paper', icon: Droplets },
    { id: 'holographic', label: 'Special', icon: Sparkles },
    { id: 'transparent', label: 'Clear', icon: Eye },
  ];

  return (
    <StyledMaterialPanel 
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header */}
      <StyledPanelHeader>
        <StyledPanelTitle>Choose Your Material</StyledPanelTitle>
        <StyledPanelSubtitle>Select the perfect material for your stickers</StyledPanelSubtitle>
      </StyledPanelHeader>

      {/* Search and Filters */}
      <StyledMaterialControls>
        <Input
          startEnhancer={() => <Search size={18} />}
          value={searchQuery}
          onChange={e => setSearchQuery((e.target as HTMLInputElement).value)}
          placeholder="Search materials..."
          clearOnEscape
          overrides={{
            Root: {
              style: {
                backgroundColor: 'var(--background-light)',
                borderColor: 'var(--border-color)',
              }
            }
          }}
        />

        {/* Material Type Filters */}
        <StyledMaterialFilters>
          {materialTypes.map(type => {
            const Icon = type.icon;
            return (
              <StyledFilterChip
                key={type.id}
                $active={filter === type.id || (!filter && type.id === 'all')}
                onClick={() => setFilter(type.id === 'all' ? null : type.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {Icon && <Icon size={16} />}
                {type.label}
              </StyledFilterChip>
            );
          })}
        </StyledMaterialFilters>

        {/* Compare Mode Toggle */}
        <StyledCompareToggle
          $active={compareMode}
          onClick={() => {
            setCompareMode(!compareMode);
            setSelectedForComparison([]);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Info size={16} />
          Compare Materials
        </StyledCompareToggle>
      </StyledMaterialControls>

      {/* Materials Grid */}
      <StyledMaterialContent>
        <Scrollbars>
          <StyledMaterialsGrid 
            variants={staggerChildren}
          >
            <AnimatePresence>
              {filteredMaterials.map((material, index) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  isSelected={configuration.material?.id === material.id}
                  isComparing={selectedForComparison.includes(material.id)}
                  onSelect={() => handleMaterialSelect(material)}
                  onHover={setHoveredMaterial}
                  index={index}
                  compareMode={compareMode}
                />
              ))}
            </AnimatePresence>
          </StyledMaterialsGrid>

          {/* Popular Choice Badge */}
          {configuration.material?.popular && (
            <StyledPopularBadge 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles size={16} />
              Popular choice! Used by 73% of customers
            </StyledPopularBadge>
          )}
        </Scrollbars>
      </StyledMaterialContent>

      {/* Comparison View */}
      <AnimatePresence>
        {compareMode && selectedForComparison.length >= 2 && (
          <MaterialComparison
            materialIds={selectedForComparison}
            materials={materials}
            onClose={() => {
              setCompareMode(false);
              setSelectedForComparison([]);
            }}
            onSelect={(material) => {
              selectMaterial(material);
              setCompareMode(false);
              setSelectedForComparison([]);
            }}
          />
        )}
      </AnimatePresence>

      {/* Material Info Footer */}
      {configuration.material && (
        <StyledMaterialInfoFooter 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StyledMaterialFeatures>
            {configuration.material.features.map((feature, index) => (
              <StyledFeatureTag 
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {feature}
              </StyledFeatureTag>
            ))}
          </StyledMaterialFeatures>
        </StyledMaterialInfoFooter>
      )}
    </StyledMaterialPanel>
  );
};

export default MaterialPanel;