// src/components/PromptSection.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Fuse from "fuse.js";
import knowledgeBase from "../data/knowledge-base.json"; // adjust path if needed

// --- helpers ---------------------------------------------------------------
const proficiencyLabel = (n) => {
  if (n >= 90) return "expert-level";
  if (n >= 75) return "advanced";
  if (n >= 50) return "intermediate";
  return "familiar";
};

function craftNarrativeFromResults(results, query) {
  // results: array from Fuse (each has item and matches)
  if (!results || results.length === 0) {
    return `Natinael has a strong, diverse background in web and AI development. He specializes in MERN-stack web apps, backend APIs, and AI/ML solutions that integrate with production systems. Ask about a specific skill or project to see matching evidence.`;
  }

  // pick top match
  const top = results[0].item;
  if (top._type === "project") {
    const title = top.title || top.name || "the project";
    const techs = (top.technologies || top.technologies || []).join(", ");
    const accom = (top.accomplishments && top.accomplishments.slice(0, 2)) || [];
    const accomText = accom.length ? ` Notable achievements include: ${accom.join("; ")}.` : "";
    const live = top.liveUrl ? ` You can view it here: ${top.liveUrl}.` : "";
    return `Natinael led ${title}, a project built with ${techs}. ${accomText} ${live} He played a hands-on role designing and implementing the solution and ensuring reliability in production.`;
  }

  if (top._type === "skill") {
    const skill = top.name;
    const prof = proficiencyLabel(top.proficiency ?? 0);
    // find projects that mention this skill (brief)
    const related = (knowledgeBase.projects || []).filter((p) => {
      const techs = (p.technologies || []).map((t) => String(t).toLowerCase());
      return techs.some((t) => t.includes(skill.toLowerCase()) || skill.toLowerCase().includes(t));
    }).slice(0, 3);
    const projectsText = related.length ? ` He used ${skill} heavily in projects such as ${related.map(r => r.title).join(", ")}.` : "";
    return `Natinael has ${prof} proficiency in ${skill}.${projectsText} He applies this skill to deliver performant, maintainable solutions.`;
  }

  if (top._type === "experience") {
    const role = top.role || top.title || "a role";
    const company = top.company ? ` at ${top.company}` : "";
    const accomplishments = (top.accomplishments || []).slice(0, 2);
    const accText = accomplishments.length ? ` Key accomplishments: ${accomplishments.join("; ")}.` : "";
    return `Natinael served as ${role}${company}. ${accText} He led technical efforts and coordinated cross-functional teams to deliver results.`;
  }

  // fallback build from first couple of textual snippets
  const snippets = [];
  for (let i = 0; i < Math.min(results.length, 3); i++) {
    const it = results[i].item;
    if (it._type === "project") snippets.push(`${it.title}`);
    else if (it._type === "skill") snippets.push(`${it.name}`);
    else if (it._type === "experience") snippets.push(`${it.role}`);
  }
  return `I found relevant items: ${snippets.join(", ")} — ask a follow-up for details on any of them.`;
}

function makeFollowUps(topItem) {
  if (!topItem) return [
    "Which projects best showcase Natinael's frontend skills?",
    "Which projects demonstrate backend scalability?",
  ];

  if (topItem._type === "project") {
    return [
      `What were the specific accomplishments on "${topItem.title}"?`,
      `Which technologies were used in "${topItem.title}"?`,
    ];
  }
  if (topItem._type === "skill") {
    return [
      `Which projects used ${topItem.name} most heavily?`,
      `How does ${topItem.name} relate to other skills like ${topItem.synonyms?.[0] || "related skills"}?`,
    ];
  }
  if (topItem._type === "experience") {
    return [
      `Tell me more about accomplishments in ${topItem.role}.`,
      `Which projects came out of ${topItem.company || topItem.role}?`,
    ];
  }
  return [
    "Can you show projects that match this?",
    "How does this relate to Natinael's experience?",
  ];
}

// --- component -------------------------------------------------------------
export default function PromptSection({ jobData = null }) {
  const [fuse, setFuse] = useState(null);
  const [messages, setMessages] = useState([]); // {id, role: 'user'|'saba', text}
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const fuseRef = useRef(null);
  const containerRef = useRef(null);

  // Build flattened index from knowledgeBase
  useEffect(() => {
    const items = [];

    // projects
    (knowledgeBase.projects || []).forEach((p) => {
      items.push({ ...p, _type: "project" });
    });

    // skills
    (knowledgeBase.skills || []).forEach((s) => {
      items.push({ ...s, _type: "skill" });
    });

    // experience
    (knowledgeBase.experience || []).forEach((e) => {
      items.push({ ...e, _type: "experience" });
    });

    // testimonials
    (knowledgeBase.testimonials || []).forEach((t, i) => {
      items.push({ ...t, _type: "testimonial", title: `Testimonial ${i + 1}` });
    });

    const options = {
      includeMatches: true,
      threshold: 0.3,
      keys: [
        "name", "synonyms",
        "title", "description", "technologies", "accomplishments",
        "role", "company", "description",
        "quote", "author",
      ],
    };

    const f = new Fuse(items, options);
    fuseRef.current = f;
    setFuse(f);
  }, []);

  // voice recognition setup (optional)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      // auto-send after recognition:
      handleSend(transcript);
    };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    // cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper: push message
  const pushMessage = (role, text) => {
    setMessages((m) => [...m, { id: Date.now() + Math.random(), role, text }]);
    // scroll to bottom
    setTimeout(() => {
      if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, 50);
  };

  // typewriter for Saba's text
  const typeOut = (text, speed = 18) =>
    new Promise((resolve) => {
      setIsTyping(true);
      let i = 0;
      const timer = setInterval(() => {
        setMessages((prev) => {
          // replace last assistant placeholder or append
          const last = prev[prev.length - 1];
          if (!last || last.role !== "saba") {
            return [...prev, { id: Date.now() + Math.random(), role: "saba", text: text.slice(0, i + 1) }];
          } else {
            const updated = [...prev];
            updated[updated.length - 1] = { ...last, text: text.slice(0, i + 1) };
            return updated;
          }
        });
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          setIsTyping(false);
          resolve();
        }
      }, speed);
    });

  // main send handler
  const handleSend = async (raw) => {
    const q = (raw || input || "").trim();
    if (!q) return;

    // push user message and clear input
    pushMessage("user", q);
    setInput("");

    // run search
    if (!fuseRef.current) {
      // fallback message
      await typeOut("Saba is indexing data. Please try again in a moment.");
      return;
    }

    // show typing placeholder quickly
    pushMessage("saba", ""); // placeholder while computing
    setIsTyping(true);

    const res = fuseRef.current.search(q, { limit: 8 });
    // craft narrative
    const narrative = craftNarrativeFromResults(res, q);

    // push with typewriter animation (replace placeholder)
    // remove the placeholder assistant message (we will replace via typeOut)
    setMessages((m) => m.filter((mm) => !(mm.role === "saba" && mm.text === "")));
    await typeOut(narrative, 14);

    // prepare follow-ups (based on top item)
    const top = res[0] ? res[0].item : null;
    const followUps = makeFollowUps(top);
    setSuggestions(followUps);
  };

  // suggestion click
  const handleSuggestionClick = (s) => {
    // send suggestion as a user message
    handleSend(s);
    // clear suggestions
    setSuggestions([]);
  };

  // voice toggle
  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        // ignore start errors
        setListening(false);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mt-10 px-4 sm:px-6">
      <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-semibold text-white/90 mb-3">Ask Saba</h3>

        {/* messages list */}
        <div
          ref={containerRef}
          className="h-64 sm:h-72 overflow-y-auto space-y-3 py-2 px-2 rounded-md bg-black/20"
        >
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[85%] px-4 py-2 rounded-lg ${
                  m.role === "user" ? "bg-white/10 text-white/90" : "bg-gradient-to-r from-purple-700/60 to-pink-600/40 text-white"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm sm:text-base">{m.text}</div>
              </motion.div>
            </div>
          ))}

          {isTyping && (
            <div className="text-sm text-gray-400 italic">Saba is typing…</div>
          )}
        </div>

        {/* suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.slice(0, 4).map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className="px-3 py-1.5 bg-white/6 text-white/90 rounded-md text-sm hover:bg-white/10 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* input row */}
        <div className="mt-4 flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder="Ask about skills, projects, or experience — e.g. 'React performance examples'"
            className="flex-1 bg-white/5 placeholder-gray-400 text-white rounded-lg px-3 py-2 outline-none"
          />

          {/* mic */}
          {(window.SpeechRecognition || window.webkitSpeechRecognition) ? (
            <button
              onClick={toggleListen}
              className={`px-3 py-2 rounded-md ${listening ? "bg-red-500/80" : "bg-white/6"} text-white`}
              title="Voice input"
            >
              {listening ? "Listening..." : "🎙"}
            </button>
          ) : null}

          <button
            onClick={() => handleSend()}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
