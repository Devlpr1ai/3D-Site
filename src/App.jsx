import ScrollVideo from './components/ScrollVideo'
import ScrollFloat from './components/ScrollFloat'
import GlassPanel from './components/GlassPanel'
import PillNav from './components/PillNav'

export default function App() {
  return (
    <>
      <ScrollVideo src="/Flowers.mp4" />
      <PillNav />
      <div style={{ position: 'relative', height: '500vh' }}>
        <div className="fixed inset-0 flex flex-col justify-end p-4 md:p-8 pointer-events-none z-10">
          <ScrollFloat>{`Unleash The\nFull Power`}</ScrollFloat>
        </div>
        <GlassPanel />
      </div>
    </>
  )
}
