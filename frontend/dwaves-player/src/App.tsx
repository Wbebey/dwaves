import { useEffect, useState } from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { Player } from './Pages/Player';
import { Loader } from './Components/Loader';


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
            <Route path="/" element={<Player/>} />
            {/* <Route path="/loading" element={<Loader/>} /> */}
          </Routes>
      </Router>
    </div>
  );
}

export default App;
