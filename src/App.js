import { BrowserRouter } from "react-router-dom"
import Router from "./router"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Router />
      </div>
    </BrowserRouter>
  )
}

export default App
