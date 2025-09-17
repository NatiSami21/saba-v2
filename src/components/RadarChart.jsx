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
  Advanced: 80,
  Expert: 100,
};

const RadarChartComponent = ({ skills = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false); // trigger chart rendering
  const chartRef = useRef(null);
  const controls = useAnimation();

  const sortedSkills = [...skills].sort((a, b) => b.matchScore - a.matchScore);
  const visibleSkills = expanded ? sortedSkills : sortedSkills.slice(0, 5);
  const chartData = visibleSkills.map((s) => ({
    skill: s.skillName,
    "My Proficiency": s.myProficiency,
    "Job Requirement": levelMap[s.jobRequirementLevel] || 50,
  }));

  // Observer to trigger rendering when chart enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          controls.start({ opacity: 1, y: 0 });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, [controls]);

  return (
    <motion.div
      ref={chartRef}
      initial={{ opacity: 0, y: 30 }}
      animate={controls}
      className="w-full max-w-3xl bg-black/30 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10"
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-white/90">
        Skills Alignment
      </h2>

      <div className="w-full h-80">
        {visible && (
          <ResponsiveContainer>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis
                dataKey="skill"
                stroke="rgba(245,245,255,0.9)"
                tick={{ fill: "rgba(245,245,255,0.9)" }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(200,200,255,0.3)" />
              <Radar
                name="My Proficiency"
                dataKey="My Proficiency"
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
              <Legend wrapperStyle={{ color: "rgba(245,245,255,0.9)" }} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      <ul className="mt-6 space-y-3">
        {visibleSkills.map((s, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
          >
            <span className="font-medium text-white/90">{s.skillName}</span>
            <span className="text-sm text-gray-400/80">
              Me: {s.myProficiency} | Req: {s.jobRequirementLevel} | Match: {s.matchScore}%
            </span>
          </motion.li>
        ))}
      </ul>

      {sortedSkills.length > 5 && (
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileHover={{ scale: 1.05, opacity: 0.9 }}
          className="mt-4 px-4 py-2 text-sm font-medium text-white/90 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transition"
        >
          {expanded ? "Show Less" : "Show More"}
        </motion.button>
      )}
    </motion.div>
  );
};

export default RadarChartComponent;
