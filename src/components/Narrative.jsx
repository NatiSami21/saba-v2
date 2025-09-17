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
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const fullText = `${greeting}${text || ""}`;
          let i = 0;

          const interval = setInterval(() => {
            setDisplayText((prev) => {
              if (i < fullText.length) {
                return fullText.slice(0, i + 1);
              }
              clearInterval(interval);
              return prev;
            });
            i++;
          }, 30);

          // trigger fade-in animation
          controls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });

          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect(); // cleanup observer on unmount
  }, [text, jobData, controls, greeting]);

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="max-w-3xl text-lg sm:text-xl leading-relaxed px-4 text-left"
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
