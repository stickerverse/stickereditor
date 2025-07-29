import Icons from '../../../icons'
import { Button, KIND, SIZE } from 'baseui/button'
import { StatefulPopover, PLACEMENT } from 'baseui/popover'

import { useHandlers } from '@/uibox'
// import { useEffect, useState } from 'react'
// import { useActiveObject } from '@/uibox/hooks/useActiveObject'
// import { useEffect } from 'react'
// import { useEditorContext } from '@/uibox'

function Position() {
  // const [value, setValue] = useState([1])
  // const activeObject = useActiveObject()
  // const { canvas } = useEditorContext()
  const handlers = useHandlers()

  // useEffect(() => {
  //   updateOptions(activeObject)
  // }, [activeObject])

  // useEffect(() => {
  //   handlers.canvasHandler.canvas.on('history:changed', () => {
  //     updateOptions(activeObject)
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [handlers])

  // const updateOptions = (object: fabric.IObjectOptions) => {
  //   const objectIndex = canvas.getObjects().findIndex(o => o === object)
  //   console.log({ objectIndex })
  //   // const updatedValue = [object.opacity * 100]
  //   // setValue(updatedValue)
  // }

  return (
    <StatefulPopover
      focusLock
      placement={PLACEMENT.bottomRight}
      content={({ close }) => (
        <div>
          <div
            style={{
              width: '360px',
              background: '#ffffff',
              fontFamily: 'system-ui',
              fontSize: '0.875rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <PositionItem
                onClick={handlers.objectsHandler.bringForward}
                icon="Forward"
                label="Forward"
                shortcut="Ctrl + J"
              />
              <PositionItem
                onClick={handlers.objectsHandler.bringToFront}
                icon="ToFront"
                label="ToFront"
                shortcut="Ctrl + Alt + J"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <PositionItem
                onClick={handlers.objectsHandler.sendBackwards}
                icon="Backward"
                label="Backward"
                shortcut="Ctrl + ["
              />
              <PositionItem
                onClick={handlers.objectsHandler.sendToBack}
                icon="ToBack"
                label="ToBack"
                shortcut="Ctrl + Alt + ["
              />
            </div>
          </div>
        </div>
      )}
    >
      <Button size={SIZE.compact} kind={KIND.tertiary}>
        Position
      </Button>
    </StatefulPopover>
  )
}
interface PositionItemProps {
  icon: string
  label: string
  shortcut: string
  onClick: Function
}
const PositionItem = ({ icon, label, shortcut, onClick }: PositionItemProps) => {
  const Icon = Icons[icon]
  return (
    <div onClick={() => onClick()} style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Icon size={24} />
        <div style={{ paddingLeft: '0.5rem' }}>{label}</div>
      </div>
      <div style={{ color: 'rgba(0,0,0,0.5)' }}>{shortcut}</div>
    </div>
  )
}

export default Position
