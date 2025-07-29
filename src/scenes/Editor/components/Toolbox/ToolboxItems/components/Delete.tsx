import { useHandlers } from '@/uibox'
import { Button, SHAPE, KIND, SIZE } from 'baseui/button'
import Icons from '../../../icons'

function Delete() {
  const handlers = useHandlers()
  return (
    <Button
      onClick={() => handlers.objectsHandler.removeActive()}
      size={SIZE.default}
      kind={KIND.tertiary}
      shape={SHAPE.square}
    >
      <Icons.Delete size={24} />
    </Button>
  )
}

export default Delete
