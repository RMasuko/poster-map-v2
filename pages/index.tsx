import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('../components/LeafletMap'), {
  ssr: false,
})

export default function HomePage() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <DynamicMap />
    </div>
  )
}
