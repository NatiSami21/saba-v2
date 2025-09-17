import Navbar from "./components/Navbar";
import Greeting from "./components/Greeting";
import AlignmentSection from "./components/AlignmentSection";
import PromptSection from "./components/PromptSection";
import StarsCanvas from "./components/Stars";

function App() {
  return (
    <div className="relative w-screen h-screen text-white bg-black">
  <StarsCanvas transparent={false} />

  <div className="relative z-10">
    <Navbar />
    <Greeting />
    <AlignmentSection />
    <PromptSection />
  </div>
</div>
  );
}

export default App;
