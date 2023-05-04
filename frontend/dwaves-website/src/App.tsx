import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.scss";

import { HeroSection } from "./components/HeroSection";
import { IcoSection } from "./components/IcoSection";
import { Wave } from "./components/svg/Wave";

const App = () => {
  return (
    <section className="relative">
      <div className="navbar justify-between sticky z-50 left-0 right-0 top-0 translate-x-auto rounded w-[95%] mx-auto bg-base-100 static">
        <a className="btn btn-ghost normal-case text-xl">
          <img
            className="w-28"
            src={`./logo-dwaves-white.png`}
            alt=""
          />
        </a>
        <div className="w-4/5">
          <a className="" href={`${import.meta.env.VITE_APP_DWAVESAPURL}`}>
            App
          </a>
        </div>
      </div>
      <div className="absolute z-[-1] top-0 left-0 w-full h-screen bg-primary-800">
        <Wave />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IcoSection />} />
        </Routes>
      </BrowserRouter>
    </section>
  );
};

export default App;
