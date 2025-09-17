import { motion } from "framer-motion";
import { useEffect } from "react";

const Greeting = () => {
  useEffect(() => {
    // Auto-scroll to job alignment after 3 seconds
    const timer = setTimeout(() => {
      const jobSection = document.getElementById("job-alignment");
      if (jobSection) {
        jobSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full h-screen flex flex-col justify-center items-center text-center px-4 relative">
      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
      >
        Hi Hiring Team
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-6 max-w-3xl text-lg sm:text-xl text-white/90"
      >
        I am <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 font-medium">Saba</span>, Natinael Samuel’s AI portfolio. 
        Explore how his skills, projects, and experience align with your job description in real time.
      </motion.p>

      {/* Mouse scroll animation */}
      <div className="absolute xs:bottom-5 bottom-32 w-full flex justify-center items-center">
        <a href="#job-alignment">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-gradient-to-r from-purple-500 to-pink-500 flex justify-center items-start p-2 cursor-pointer shadow-lg hover:scale-105 transition-transform">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Greeting;
