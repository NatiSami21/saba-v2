// components/Greeting.jsx
import { motion } from "framer-motion";

const Greeting = () => {
  return (
    <section className="w-full h-screen flex flex-col justify-center items-center text-center px-4">
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
        className="mt-6 max-w-3xl text-lg sm:text-xl text-gray-300"
      >
        I am <span className="text-purple-400 font-semibold">Saba</span>, Natinael Samuel’s AI portfolio. 
        Explore how his skills, projects, and experience align with your job description in real time.
      </motion.p>

      {/* Call-to-action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-8"
      >
        <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:scale-105 transition-transform">
          Interact with Saba
        </button>
      </motion.div>
    </section>
  );
};

export default Greeting;
