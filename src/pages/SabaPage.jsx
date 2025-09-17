// pages/SabaPage.jsx
import { useParams } from "react-router-dom";
import jobAlignments from "../data/job-alignments.json";

const SabaPage = () => {
  const { jobId } = useParams();
  const jobData = jobAlignments[jobId];

  if (!jobData) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <p className="text-lg text-gray-300">
          ❌ No alignment data found for <span className="font-bold">{jobId}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">
        {jobData.title} Alignment
      </h1>
      <p className="text-gray-300 max-w-2xl mb-6">{jobData.narrative}</p>
      {/* Step 3: Radar Chart & Narrative Components will go here */}
    </div>
  );
};

export default SabaPage;
