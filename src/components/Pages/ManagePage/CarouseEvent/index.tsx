import { lazy, Suspense } from 'react'
import { Tabs, Spin } from 'antd'
import type { TabsProps } from 'antd'
import { Service } from 'src/services'

const TabsItemContents = lazy(() => import('./TabsItemContents'))
console.log(Service)

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Upcoming event',
    children: (
      <Suspense fallback={<Spin />}>
        <TabsItemContents
          createApi={Service.createCarouselUpcomingEvent}
          getApi={Service.getCarouseUpcomingEvents}
          deleteApi={Service.deleteCarouselUpcomingEvent}
        />
      </Suspense>
    )
  },
  {
    key: '2',
    label: 'Trending event',
    children: (
      <Suspense fallback={<Spin />}>
        <TabsItemContents
          createApi={Service.createCarouselTrendingEvent}
          getApi={Service.getCarouseTrendingEvents}
          deleteApi={Service.deleteCarouselTrendingEvent}
        />
      </Suspense>
    )
  },
  {
    key: '3',
    label: 'For you event',
    children: (
      <Suspense fallback={<Spin />}>
        <TabsItemContents
          createApi={Service.createCarouselForYouEvent}
          getApi={Service.getCarouseForYouEvents}
          deleteApi={Service.deleteCarouselForYouEvent}
        />
      </Suspense>
    )
  }
]
export default function CarouseEvent() {
  return (
    <div className='mt-[24px]'>
      <Tabs
        type='card'
        defaultActiveKey='1'
        items={items}
        // onChange={onChange}
        // indicator={{ size: (origin) => origin - 20, align: alignValue }}
      />
    </div>
  )
}
