
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Greeting from "./components/Greeting";
import AlignmentSection from "./components/AlignmentSection";
import PromptSection from "./components/PromptSection";
import StarsCanvas from "./components/Stars";
import SabaPage from "./pages/SabaPage";

function App() {
  return (
    <div className="relative w-screen h-full text-white bg-black">
  <StarsCanvas transparent={false} />

  <div className="relative z-10">
    <Routes>
        {/* Default Home Page */}
        <Route
          path="/"
          element={
            <div className="flex flex-col items-center justify-center h-screen">
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
