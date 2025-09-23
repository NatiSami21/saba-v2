import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

const levelMap = {
  Beginner: 40,
  Intermediate: 60,
  Strong: 70,
  Advanced: 80,
  Expert: 100,
};

const RadarChartComponent = ({ skills = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const chartRef = useRef(null);
  const controls = useAnimation();

  const sortedSkills = [...skills].sort((a, b) => b.matchScore - a.matchScore);
  const visibleSkills = expanded ? sortedSkills : sortedSkills.slice(0, 5);

  const chartData = visibleSkills.map((s) => ({
    skill: s.skillName,
    "His Proficiency": s.myProficiency,
    "Job Requirement": levelMap[s.jobRequirementLevel] || 50,
  }));

  // Observer to trigger rendering when chart enters viewport
  useEffect(() => {
    if (!chartRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          controls.start({
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(chartRef.current);

    return () => observer.disconnect();
  }, [controls]);

  return (
    <motion.div
      ref={chartRef}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="w-full max-w-4xl bg-black/40 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">
        Skills Alignment
      </h2>

      <div className="w-full h-80 sm:h-96">
        {visible && (
          <ResponsiveContainer>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="rgba(255,255,255,0.15)" />
              <PolarAngleAxis
                dataKey="skill"
                stroke="rgba(245,245,255,0.9)"
                tick={{ fill: "rgba(245,245,255,0.9)", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="rgba(200,200,255,0.3)"
                tick={{ fill: "rgba(200,200,255,0.7)", fontSize: 11 }}
              />
              <Radar
                name="His Proficiency"
                dataKey="His Proficiency"
                stroke="#d8b4fe"
                fill="#d8b4fe"
                fillOpacity={0.5}
              />
              <Radar
                name="Job Requirement"
                dataKey="Job Requirement"
                stroke="#a5b4fc"
                fill="#a5b4fc"
                fillOpacity={0.3}
              />
              <Legend wrapperStyle={{ color: "rgba(245,245,255,0.9)", fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Skills List */}
      <ul className="mt-8 space-y-3">
        {visibleSkills.map((s, idx) => (
            <motion.li
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex justify-between items-center p-3 sm:p-4 bg-white/5 rounded-lg"
            >
            <span className="font-medium text-white">{s.skillName}</span>
            <span className="text-xs sm:text-sm text-gray-300">
                Req: {s.jobRequirementLevel} | Match: {s.matchScore}%
            </span>
            </motion.li>
        ))}
        </ul>

      {/* Expand Button */}
      {sortedSkills.length > 5 && (
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-5 py-2 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md"
        >
          {expanded ? "Show Less" : "Show More"}
        </motion.button>
      )}
    </motion.div>
  );
};

export default RadarChartComponent;
