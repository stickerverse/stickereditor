import useStickerStore from '@/store/stickerStore'
import { useEditorContext } from '@/uibox'
import { styled } from 'baseui'
import { useEffect } from 'react'
import PanelItems from './PanelItems'

const Container = styled('div', props => ({
  background: '#ffffff',
  width: '360px',
  flex: 'none',
  boxShadow: '1px 0px 1px rgba(0, 0, 0, 0.15)',
}))

// Map new toolbar labels to existing panel components
const panelMapping: Record<string, string> = {
  'Upload Image': 'Images',
  'Outline Style': 'Elements', // For now, use Elements panel for outline selection
  'Material': 'Background', // Use Background panel for material selection
  'Add Text': 'Text',
  'Cliparts': 'Illustrations',
}

function PanelsList() {
  const { activePanel } = useStickerStore()
  const { activeObject } = useEditorContext()

  // Map the new panel names to existing component names
  const mappedPanelName = panelMapping[activePanel] || activePanel
  const Component = PanelItems[mappedPanelName as keyof typeof PanelItems]

  return <Container>{Component && <Component />}</Container>
}

export default PanelsList
