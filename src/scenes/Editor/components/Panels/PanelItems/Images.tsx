import { useEffect, useState, useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { Input } from 'baseui/input'
import { Button } from 'baseui/button'
import Icons from '@components/icons'
import { useHandlers } from '@/uibox'
import { getPixabayImages, PixabayImage } from '@/services/pixabay'
import { useDebounce } from 'use-debounce'

function Images() {
  const [search, setSearch] = useState('')
  const [images, setImages] = useState<PixabayImage[]>([])
  const [value] = useDebounce(search, 1000)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlers = useHandlers()
  useEffect(() => {
    getPixabayImages('people')
      .then(data => setImages(data))
      .catch(console.log)
  }, [])

  useEffect(() => {
    if (value) {
      getPixabayImages(value)
        .then((data: any) => setImages(data))
        .catch(console.log)
    }
  }, [value])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        if (imageUrl) {
          setUploadedImages(prev => [imageUrl, ...prev])
          addImageToCanvas(imageUrl)
        }
      }
      reader.readAsDataURL(file)
    }
    // Reset the file input so the same file can be uploaded again if needed
    event.target.value = ''
  }

  const addImageToCanvas = url => {
    const options = {
      type: 'StaticImage',
      metadata: { src: url },
    }
    handlers.objectsHandler.create(options)
  }

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <div style={{ padding: '2rem 2rem' }}>
        <Input
          startEnhancer={() => <Icons.Search size={18} />}
          value={search}
          onChange={e => setSearch((e.target as any).value)}
          placeholder="Search images"
          clearOnEscape
        />
      </div>
      <div style={{ padding: '0 2rem 1rem' }}>
        <Button
          onClick={() => fileInputRef.current?.click()}
          overrides={{
            Root: {
              style: {
                width: '100%',
                backgroundColor: '#4268F6',
                color: 'white',
              }
            }
          }}
        >
          Upload Image
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <Scrollbars>
          <div
            style={{ display: 'grid', gap: '0.5rem', padding: '0 2rem 2rem', gridTemplateColumns: '1fr 1fr' }}
          >
            {/* Display uploaded images first */}
            {uploadedImages.map((imgUrl, index) => (
              <div
                key={`upload-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  height: '120px',
                }}
                onClick={() => addImageToCanvas(imgUrl)}
              >
                <img width="100%" src={imgUrl} alt="uploaded" style={{ objectFit: 'cover', height: '100%' }} />
              </div>
            ))}
            {/* Then display Pixabay images */}
            {images.map(img => (
              <div
                key={img.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  height: '120px',
                }}
                onClick={() => addImageToCanvas(img.webformatURL)}
              >
                <img width="100%" src={img.previewURL} alt="preview" style={{ objectFit: 'cover', height: '100%' }} />
              </div>
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  )
}

export default Images
