// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Greeting from "./components/Greeting";
import StarsCanvas from "./components/Stars";
import SabaPage from "./pages/SabaPage";

function App() {
  return (
    <div className="relative w-screen min-h-screen text-white bg-black overflow-x-hidden">
      <StarsCanvas transparent={false} />

      <div className="relative z-10">
        <Routes>
          {/* Default Home Page */}
          <Route
            path="/"
            element={
              <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <Navbar />
                <Greeting />
              </div>
            }
          />

          {/* Dynamic Job-Specific Saba Page */}
          <Route path="/saba/:jobId" element={<SabaPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
