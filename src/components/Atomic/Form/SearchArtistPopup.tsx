import React, { useState, forwardRef, useRef, useEffect, useCallback } from 'react'
import { Modal, Input, List, Button, Space, Spin } from 'antd'
import { Service } from 'src/services'
import { useSearch } from 'src/Hook/useSearch'
import { DeleteOutlined } from '@ant-design/icons'
import AvatarWithLoader from 'src/components/Atomic/Form/AvatarWithLoader'

// Types
interface Artist {
  id: string
  name: string
  thumbnail: string
}

interface SearchArtistPopupProps {
  value?: Artist[]
  onChange?: (value: Artist[]) => void
}

// Components
const SelectedArtistList: React.FC<{ artists: Artist[]; onRemove: (id: string, updateValue?: boolean) => void }> = ({
  artists,
  onRemove
}) => (
  <Space size='large'>
    {artists.map((artist) => (
      <Space key={artist.id} direction='vertical' align='center'>
        <ArtistAvatar artist={artist} onRemove={(id) => onRemove(id, true)} />
        <span>{artist.name}</span>
      </Space>
    ))}
  </Space>
)

const ArtistAvatar: React.FC<{ artist: Artist; onRemove: (id: string) => void }> = ({ artist, onRemove }) => (
  <div className='relative group inline-block'>
    <AvatarWithLoader src={artist.thumbnail} size={64} />
    <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
      <DeleteOutlined
        onClick={(e) => {
          e.stopPropagation()
          onRemove(artist.id)
        }}
        className='text-white bg-red-500 p-1 rounded-full cursor-pointer'
        style={{ fontSize: '15px' }}
      />
    </div>
  </div>
)

const SearchInput: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
  <Input placeholder='Search...' value={value} onChange={(e) => onChange(e.target.value)} className='w-full' />
)

// Custom hooks
const useArtistSelection = (initialValue: Artist[] = []) => {
  const [tempSelected, setTempSelected] = useState<Artist[]>(initialValue)

  const handleSelect = (item: Artist) => {
    setTempSelected((prev) => (prev.some((v) => v.id === item.id) ? prev : [...prev, item]))
  }

  const handleRemove = (id: string) => {
    setTempSelected((prev) => prev.filter((item) => item.id !== id))
  }

  return { tempSelected, setTempSelected, handleSelect, handleRemove }
}

// Main component
const SearchArtistPopup = forwardRef<any, SearchArtistPopupProps>(({ value = [], onChange }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { tempSelected, setTempSelected, handleSelect, handleRemove } = useArtistSelection()
  const listRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const {
    triggerSearch: triggerSearchArtists,
    results: artistsData,
    loading: artistsLoading,
    loadMore: loadMoreArtists,
    loadingMore: artistsLoadingMore,
    hasMore: hasMoreArtists
  } = useSearch({
    func: Service.getEventsArtists
  })

  const handleLoadMore = useCallback(() => {
    loadMoreArtists({ q: searchQuery })
  }, [loadMoreArtists, searchQuery])

  // Auto-load more when scrolling to bottom
  useEffect(() => {
    if (!listRef.current || !hasMoreArtists || artistsLoadingMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMoreArtists && !artistsLoadingMore) {
            handleLoadMore()
          }
        })
      },
      {
        root: listRef.current,
        rootMargin: '100px', // Start loading 100px before reaching the bottom
        threshold: 0.1
      }
    )

    observerRef.current = observer

    // Observe the last item in the list
    const listItems = listRef.current.querySelectorAll('.ant-list-item')
    if (listItems.length > 0) {
      const lastItem = listItems[listItems.length - 1]
      observer.observe(lastItem)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [artistsData, hasMoreArtists, artistsLoadingMore, searchQuery, handleLoadMore])

  React.useImperativeHandle(ref, () => ({
    handleOpenModal: () => {
      triggerSearchArtists({ q: '' })
      setTempSelected([...value])
      setIsModalOpen(true)
    }
  }))

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSearchQuery('')
  }

  const handleDone = () => {
    onChange?.(tempSelected)
    handleModalClose()
  }

  const handleSearch = (query: string) => {
    triggerSearchArtists({ q: query })
    setSearchQuery(query)
  }

  const handleRemoveWithUpdate = (id: string, updateValue: boolean = false) => {
    if (updateValue) {
      onChange?.(value.filter((item) => item.id !== id))
      return
    }
    handleRemove(id)
  }

  return (
    <>
      {!isModalOpen && <SelectedArtistList artists={value} onRemove={handleRemoveWithUpdate} />}

      <Modal
        title='Search and Select'
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={[
          <Button key='cancel' onClick={handleModalClose}>
            Cancel
          </Button>,
          <Button key='done' type='primary' onClick={handleDone} className='bg-blue-500 hover:bg-blue-600'>
            Done
          </Button>
        ]}
        className='rounded-lg'
      >
        <div className='space-y-4'>
          <div className='mb-4'>
            <SearchInput value={searchQuery} onChange={handleSearch} />
          </div>

          {tempSelected.length > 0 && (
            <div className='mb-4 p-2 border rounded'>
              <Space size={4} wrap>
                {tempSelected.map((item) => (
                  <ArtistAvatar key={item.id} artist={item} onRemove={handleRemove} />
                ))}
              </Space>
            </div>
          )}

          {!artistsLoading ? (
            <>
              <List
                ref={listRef}
                className='max-h-96 overflow-y-auto'
                dataSource={artistsData.filter((item) => !tempSelected.some((v) => v.id === item.id))}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => handleSelect(item)}
                    className={`p-2 hover:bg-[#F9FAFB1F] cursor-pointer rounded ${
                      tempSelected.some((v) => v.id === item.id) ? 'bg-blue-100' : ''
                    }`}
                  >
                    <Space className='mx-2 w-[100%] flex justify-between'>
                      <span>{item.name}</span>
                      <AvatarWithLoader src={item.thumbnail} />
                    </Space>
                  </List.Item>
                )}
              />
              {artistsLoadingMore && <Spin>Loading more...</Spin>}
            </>
          ) : (
            <Spin>loading...</Spin>
          )}
        </div>
      </Modal>
    </>
  )
})

SearchArtistPopup.displayName = 'SearchArtistPopup'

export default SearchArtistPopup
