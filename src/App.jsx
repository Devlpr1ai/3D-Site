import ScrollVideo from './components/ScrollVideo'
import ScrollFloat from './components/ScrollFloat'
import GlassPanel from './components/GlassPanel'
import PillNav from './components/PillNav'

export default function App() {
  return (
    <>
      <ScrollVideo src="https://stream.mux.com/43NlHXsaMrmyzWamMk87m01fNyxSTekAD669BBAPBNm00.m3u8" />
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
