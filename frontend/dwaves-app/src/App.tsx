import { useEffect, useState } from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { Player } from './Pages/Player';
import { Explorer } from './Pages/Explorer';
import { Loader } from './Components/Loader';
import { Banner } from './Components/Banner';


function App() {

  const [loader , setLoader] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 3000)
  })

  return loader ? ( <Loader/> ) : (
    <div className="App">
      <Router>
          {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Routes>
            <Route path="/app/player" element={<Player/>} />
            <Route path="/app" element={<Explorer/>} />
            <Route path="/app/test" element={<Banner/>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
