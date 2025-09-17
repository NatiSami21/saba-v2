// pages/SabaPage.jsx
import { useParams } from "react-router-dom";
import jobAlignments from "../data/job-alignments.json";
import Navbar from "../components/Navbar";
import Greeting from "../components/Greeting";
import Narrative from "../components/Narrative";
import RadarChartComponent from "../components/RadarChart";

const SabaPage = () => {
  const { jobId } = useParams();
  const jobData = jobAlignments[jobId];

  if (!jobData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <Navbar />
        <p className="text-lg text-gray-300 mt-10">
          ❌ No alignment data found for <span className="font-bold">{jobId}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-6 py-10">
      {/* Navbar */}
      <Navbar />

      {/* Greeting */}
      <div className="mt-6 w-full max-w-3xl">
        <Greeting jobData={jobData} />
      </div>

      {/* Job Alignment Section */}
      <div id="job-alignment" className="flex flex-col items-center w-full">
        <h1 className="text-3xl sm:text-4xl font-bold mt-10 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> 
            {jobData.meta?.role} Alignment
        </h1>

        <Narrative text={jobData.narrative} jobData={jobData} />

        <div className="mt-10 w-full flex justify-center">
            <RadarChartComponent skills={jobData.alignment.skills} />
        </div>
        </div>
    </div>
  );
};

export default SabaPage;
