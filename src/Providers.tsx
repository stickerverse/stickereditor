import { FC } from 'react'
import { Client as Styletron } from 'styletron-engine-atomic'
import { Provider as StyletronProvider } from 'styletron-react'
import { LightTheme, BaseProvider } from 'baseui'
import { EditorProvider } from './uibox'
import { AppProvider } from './contexts/AppContext'
import { StickerStoreProvider } from './store/stickerStore'
const engine = new Styletron()

const Providers: FC = ({ children }) => {
  return (
    <StyletronProvider value={engine}>
      <EditorProvider>
        <BaseProvider theme={LightTheme}>
          <StickerStoreProvider>
            <AppProvider>{children}</AppProvider>
          </StickerStoreProvider>
        </BaseProvider>
      </EditorProvider>
    </StyletronProvider>
  )
}

export default Providers
