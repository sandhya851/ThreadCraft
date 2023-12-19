import Canvas from "./canvas"
import Customizer from "./pages/Customizer"

import Home from "./pages/Home"
function App() {
  return (
    <main className="app transition-all ease-in">
      {/* <h1 className='head-text'>Street Style</h1> */}
      <Home/>
      <Canvas></Canvas>
      <Customizer></Customizer>
    </main>
  )
}

export default App
