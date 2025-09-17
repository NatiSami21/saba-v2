import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const Narrative = ({ text, jobData }) => {
  const [displayText, setDisplayText] = useState("");
  const ref = useRef(null);
  const controls = useAnimation();
  const companyName = jobData?.meta?.company;
  const greeting = companyName
    ? `Hello hiring team of ${companyName}, I'm Saba: `
    : `Hello hiring team, I'm Saba: `;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // start typing when in view
          let i = 0;
          const fullText = `${greeting}${text || ""}`;
          const interval = setInterval(() => {
            setDisplayText(fullText.slice(0, i + 1));
            i++;
            if (i === fullText.length) clearInterval(interval);
          }, 20);

          controls.start({ opacity: 1, y: 0 });
          observer.disconnect();
          return () => clearInterval(interval);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
  }, [text, jobData, controls, greeting]);

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="max-w-3xl text-lg sm:text-xl leading-relaxed"
    >
      {displayText.startsWith(greeting) ? (
        <>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
            {displayText.slice(0, greeting.length)}
          </span>
          <span className="text-white/90">{displayText.slice(greeting.length)}</span>
        </>
      ) : (
        <span className="text-white/90">{displayText}</span>
      )}
    </motion.p>
  );
};

export default Narrative;
