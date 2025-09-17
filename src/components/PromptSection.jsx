// src/components/PromptSection.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Fuse from "fuse.js";
import knowledgeBase from "../data/knowledge-base.json";

// --- Enhanced Helpers ------------------------------------------------------
const proficiencyLabel = (n) => {
  if (n >= 90) return "expert-level";
  if (n >= 75) return "advanced";
  if (n >= 50) return "intermediate";
  return "familiar";
};

// Enhanced keyword extraction with comprehensive tech and experience mapping
function extractKeywords(query) {
  const stopWords = new Set([
    'tell', 'me', 'about', 'his', 'the', 'a', 'an', 'is', 'are', 'what', 
    'which', 'how', 'can', 'you', 'show', 'demonstrate', 'projects', 'skills',
    'experience', 'tell me', 'show me', 'what are', 'which projects', 'describe',
    'tell me about', 'what is', 'what was', 'how about', 'give me'
  ]);
  
  // Comprehensive tech and experience term mapping
  const termMapping = {
    // Technical skills
    'ml': 'machine learning',
    'ai': 'artificial intelligence',
    'ci/cd': 'continuous integration',
    'rest api': 'RESTful APIs',
    'rest': 'RESTful APIs',
    'api': 'RESTful APIs',
    'mern': 'MERN Stack',
    'react': 'React',
    'node': 'Node.js',
    'python': 'Python',
    'js': 'JavaScript',
    'javascript': 'JavaScript',
    'sql': 'SQL',
    'nosql': 'MongoDB',
    'mongodb': 'MongoDB',
    'docker': 'Docker',
    'tensorflow': 'TensorFlow',
    'pytorch': 'PyTorch',
    'cv': 'Computer Vision',
    'webrtc': 'WebRTC',
    'websockets': 'WebSockets',
    'jwt': 'JWT',
    'oauth': 'OAuth',
    'tailwind': 'Tailwind CSS',
    'redux': 'Redux',
    'three.js': 'Three.js',
    'git': 'Git',
    'agile': 'Agile Methodology',
    
    // Experience and roles
    'ai experience': 'artificial intelligence machine learning',
    'machine learning experience': 'artificial intelligence machine learning',
    'backend experience': 'backend development',
    'frontend experience': 'frontend development',
    'fullstack experience': 'full-stack development',
    'devops experience': 'DevOps',
    'project management experience': 'project management',
    'startup experience': 'startup founder',
    'entrepreneurship experience': 'entrepreneurship',
    'lead developer experience': 'lead developer',
    'educational background': 'education degree university',
    'education': 'education degree university',
    'strongest skills': 'proficiency expert advanced',
    'strongest technical skills': 'proficiency expert advanced',
    
    // Projects
    'myfayda': 'MyFayda eKYC',
    'medhub': 'MedHub Ethiopia',
    'wolayita': 'Wolayita Zone',
    'st mary': 'St. Mary Finance',
    'wa-leba': 'Wa-Leba & Wa-Leba+',
    'bible trivia': 'Bible Trivia Game',
    'book store': 'Offline Book Store',
    'vehicle management': 'Vehicle Management System'
  };
  
  let processedQuery = query.toLowerCase();
  
  // Replace terms with mapped equivalents
  Object.entries(termMapping).forEach(([short, full]) => {
    const regex = new RegExp(`\\b${short}\\b`, 'gi');
    processedQuery = processedQuery.replace(regex, full);
  });
  
  return processedQuery
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .join(' ');
}

// Enhanced context-aware narrative crafting
function craftNarrativeFromResults(results, query, lastTopic = null) {
  // Handle specific common queries directly
  if (query.toLowerCase().includes('strongest skill') || 
      query.toLowerCase().includes('strongest technical skill')) {
    const topSkills = knowledgeBase.skills
      .sort((a, b) => b.proficiency - a.proficiency)
      .slice(0, 5);
    return `Natinael's strongest technical skills are: ${topSkills.map(s => `${s.name} (${proficiencyLabel(s.proficiency)})`).join(', ')}. He has applied these skills across various projects like ${knowledgeBase.projects.slice(0, 3).map(p => p.title).join(', ')}.`;
  }
  
  if (query.toLowerCase().includes('education') || 
      query.toLowerCase().includes('educational background') ||
      query.toLowerCase().includes('degree')) {
    const { education } = knowledgeBase.bio;
    return `Natinael holds a ${education.degree} from ${education.institution} (${education.period}).`;
  }
  
  if (query.toLowerCase().includes('ai experience') || 
      query.toLowerCase().includes('machine learning experience')) {
    const aiSkills = knowledgeBase.skills.filter(s => 
      s.category === "AI/ML" || s.name.includes("TensorFlow") || s.name.includes("PyTorch")
    );
    const aiProjects = knowledgeBase.projects.filter(p => 
      p.technologies.some(t => t.includes("TensorFlow") || t.includes("PyTorch") || t.includes("AI"))
    );
    return `Natinael has ${aiSkills.length > 0 ? proficiencyLabel(aiSkills[0].proficiency) : 'advanced'} experience in AI and machine learning. He has worked with technologies like ${aiSkills.slice(0, 3).map(s => s.name).join(', ')} on projects such as ${aiProjects.slice(0, 2).map(p => p.title).join(' and ')}.`;
  }
  
  if (!results || results.length === 0) {
    // Try to provide more specific default responses based on query
    if (query.toLowerCase().includes('project') || query.toLowerCase().includes('app')) {
      return "Natinael has developed several projects including MyFayda eKYC, MedHub Ethiopia, Wolayita Zone SIT Web-App, and more. Would you like to know about a specific project?";
    } else if (query.toLowerCase().includes('skill') || query.toLowerCase().includes('technology')) {
      return "Natinael has expertise in React, Node.js, Python, TensorFlow, and many other technologies. Which specific skill would you like to know about?";
    } else if (query.toLowerCase().includes('experience') || query.toLowerCase().includes('role')) {
      return "Natinael has experience as a Startup Founder, Project Manager, Lead Developer, and more. What specific role are you interested in?";
    }
    return `Natinael has a strong, diverse background in web and AI development. He specializes in MERN-stack web apps, backend APIs, and AI/ML solutions that integrate with production systems. Ask about a specific skill or project to see matching evidence.`;
  }

  // Use multiple results for richer narrative
  const topResults = results.slice(0, 3);
  const top = topResults[0].item;
  
  // Handle follow-up questions about accomplishments
  if (query.toLowerCase().includes('accomplishment') || query.toLowerCase().includes('achievement')) {
    if (top._type === "project" && top.accomplishments && top.accomplishments.length > 0) {
      return `In ${top.title}, Natinael's key accomplishments were: ${top.accomplishments.join('; ')}.`;
    } else if (top._type === "experience" && top.accomplishments && top.accomplishments.length > 0) {
      return `As ${top.role} at ${top.company}, Natinael's key accomplishments were: ${top.accomplishments.join('; ')}.`;
    }
  }
  
  // Handle follow-up questions about technologies
  if (query.toLowerCase().includes('technolog') || query.toLowerCase().includes('stack') || 
      query.toLowerCase().includes('tool') || query.toLowerCase().includes('framework')) {
    if (top._type === "project" && top.technologies && top.technologies.length > 0) {
      return `${top.title} was built using: ${top.technologies.join(', ')}.`;
    }
  }

  // For projects
  if (top._type === "project") {
    const title = top.title || top.name || "the project";
    const techs = (top.technologies || []).join(", ");
    const accom = (top.accomplishments || []).slice(0, 2);
    const accomText = accom.length ? ` Notable achievements include: ${accom.join("; ")}.` : "";
    const live = top.liveUrl ? ` You can view it here: ${top.liveUrl}.` : "";
    return `Natinael led ${title}, a project built with ${techs}.${accomText}${live} He played a hands-on role designing and implementing the solution and ensuring reliability in production.`;
  }

  // For skills
  if (top._type === "skill") {
    const skill = top.name;
    const prof = proficiencyLabel(top.proficiency ?? 0);
    
    // Find projects that use this skill
    const related = (knowledgeBase.projects || []).filter((p) => {
      const techs = (p.technologies || []).map((t) => String(t).toLowerCase());
      return techs.some((t) => t.includes(skill.toLowerCase()) || skill.toLowerCase().includes(t));
    }).slice(0, 2);
    
    const projectsText = related.length ? 
      ` He used ${skill} in projects like ${related.map(r => r.title).join(", ")}.` : "";
    
    return `Natinael has ${prof} proficiency in ${skill}.${projectsText} He applies this skill to deliver performant, maintainable solutions.`;
  }

  // For experience
  if (top._type === "experience") {
    const role = top.role || top.title || "a role";
    const company = top.company ? ` at ${top.company}` : "";
    const accomplishments = (top.accomplishments || []).slice(0, 2);
    const accText = accomplishments.length ? ` Key accomplishments: ${accomplishments.join("; ")}.` : "";
    return `Natinael served as ${role}${company}.${accText} He led technical efforts and coordinated cross-functional teams to deliver results.`;
  }

  // For testimonials
  if (top._type === "testimonial") {
    return `"${top.quote}" - ${top.author}, ${top.position} at ${top.company}`;
  }

  // For bio/education
  if (top._type === "bio") {
    const { education } = top;
    return `Natinael holds a ${education.degree} from ${education.institution} (${education.period}).`;
  }

  // Fallback - combine information from multiple results
  const snippets = [];
  for (let i = 0; i < Math.min(results.length, 3); i++) {
    const it = results[i].item;
    if (it._type === "project") snippets.push(`Project: ${it.title}`);
    else if (it._type === "skill") snippets.push(`Skill: ${it.name} (${proficiencyLabel(it.proficiency)})`);
    else if (it._type === "experience") snippets.push(`Role: ${it.role} at ${it.company}`);
    else if (it._type === "testimonial") snippets.push(`Testimonial from ${it.author}`);
    else if (it._type === "bio") snippets.push(`Education: ${it.education.degree}`);
  }
  return `Based on your query, I found: ${snippets.join("; ")}. Ask a follow-up for details on any of these.`;
}

// Enhanced follow-up suggestions with context awareness
function makeFollowUps(topItem, query = "") {
  if (!topItem) return [
    "Which projects best showcase Natinael's frontend skills?",
    "Which projects demonstrate backend scalability?",
    "Tell me about Natinael's AI experience",
    "What are Natinael's strongest technical skills?"
  ];

  if (topItem._type === "project") {
    return [
      `What were the specific accomplishments on "${topItem.title}"?`,
      `Which technologies were used in "${topItem.title}"?`,
      `Tell me more about the development process for "${topItem.title}"`,
      `How does "${topItem.title}" relate to Natinael's other projects?`
    ];
  }
  if (topItem._type === "skill") {
    return [
      `Which projects used ${topItem.name} most heavily?`,
      `How does ${topItem.name} relate to other skills like ${topItem.synonyms?.[0] || "related skills"}?`,
      `What is Natinael's proficiency level in ${topItem.name}?`,
      `Show me projects that combine ${topItem.name} with other technologies`
    ];
  }
  if (topItem._type === "experience") {
    return [
      `Tell me more about accomplishments in ${topItem.role}.`,
      `Which projects came out of ${topItem.company || topItem.role}?`,
      `What skills did Natinael use in ${topItem.role}?`,
      `How long did Natinael work as ${topItem.role}?`
    ];
  }
  return [
    "Can you show projects that match this?",
    "How does this relate to Natinael's experience?",
    "What skills are relevant to this?",
    "Are there any testimonials about this?"
  ];
}

// --- Enhanced Component ----------------------------------------------------
export default function PromptSection({ jobData = null }) {
  const [fuse, setFuse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [listening, setListening] = useState(false);
  const [lastTopic, setLastTopic] = useState(null);
  const [conversationContext, setConversationContext] = useState({});

  const recognitionRef = useRef(null);
  const fuseRef = useRef(null);
  const containerRef = useRef(null);

  // Build comprehensive index from knowledgeBase
  useEffect(() => {
    const items = [];

    // Bio and education
    items.push({ 
      ...knowledgeBase.bio, 
      _type: "bio",
      _searchText: `${knowledgeBase.bio.fullName} ${knowledgeBase.bio.title} ${knowledgeBase.bio.summary} ${knowledgeBase.bio.education.degree} ${knowledgeBase.bio.education.institution} ${knowledgeBase.bio.education.period}`.toLowerCase()
    });

    // Enhanced project indexing
    (knowledgeBase.projects || []).forEach((p) => {
      items.push({ 
        ...p, 
        _type: "project",
        _searchText: `${p.title} ${p.description} ${(p.technologies || []).join(' ')} ${(p.accomplishments || []).join(' ')} ${(p.synonyms || []).join(' ')}`.toLowerCase()
      });
    });

    // Enhanced skill indexing
    (knowledgeBase.skills || []).forEach((s) => {
      items.push({ 
        ...s, 
        _type: "skill",
        _searchText: `${s.name} ${(s.synonyms || []).join(' ')} ${s.category} ${s.name} proficiency`.toLowerCase()
      });
    });

    // Enhanced experience indexing with skillsUsed
    (knowledgeBase.experience || []).forEach((e) => {
      items.push({ 
        ...e, 
        _type: "experience",
        _searchText: `${e.role} ${e.company} ${e.description} ${(e.skillsUsed || []).join(' ')} ${(e.accomplishments || []).join(' ')} ${e.period}`.toLowerCase()
      });
    });

    // Enhanced testimonial indexing
    (knowledgeBase.testimonials || []).forEach((t, i) => {
      items.push({ 
        ...t, 
        _type: "testimonial", 
        title: `Testimonial ${i + 1}`,
        _searchText: `${t.quote} ${t.author} ${t.position} ${t.company} feedback review`.toLowerCase()
      });
    });

    // Enhanced Fuse.js configuration with weighted fields
    const options = {
      includeMatches: true,
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
      keys: [
        { name: "name", weight: 0.6 },
        { name: "title", weight: 0.6 },
        { name: "synonyms", weight: 0.5 },
        { name: "technologies", weight: 0.5 },
        { name: "role", weight: 0.5 },
        { name: "company", weight: 0.4 },
        { name: "description", weight: 0.4 },
        { name: "accomplishments", weight: 0.4 },
        { name: "skillsUsed", weight: 0.4 },
        { name: "quote", weight: 0.3 },
        { name: "_searchText", weight: 0.4 }
      ],
    };

    const f = new Fuse(items, options);
    fuseRef.current = f;
    setFuse(f);
  }, []);

  // Voice recognition setup
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
      handleSend(transcript);
    };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  // Helper: push message
  const pushMessage = (role, text) => {
    setMessages((m) => [...m, { id: Date.now() + Math.random(), role, text }]);
    setTimeout(() => {
      if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, 50);
  };

  // Typewriter effect for Saba's text
  const typeOut = (text, speed = 18) =>
    new Promise((resolve) => {
      setIsTyping(true);
      let i = 0;
      const timer = setInterval(() => {
        setMessages((prev) => {
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

  // Enhanced main send handler with context tracking
  const handleSend = async (raw) => {
    const q = (raw || input || "").trim();
    if (!q) return;

    // Push user message and clear input
    pushMessage("user", q);
    setInput("");

    // Run search
    if (!fuseRef.current) {
      await typeOut("Saba is indexing data. Please try again in a moment.");
      return;
    }

    // Show typing placeholder quickly
    pushMessage("saba", "");
    setIsTyping(true);

    // Enhanced query processing with context awareness
    let processedQuery = extractKeywords(q);
    
    // If we have context from previous messages, use it to enhance the query
    if (lastTopic) {
      if (lastTopic._type === "project") {
        processedQuery += ` ${lastTopic.title}`;
      } else if (lastTopic._type === "skill") {
        processedQuery += ` ${lastTopic.name}`;
      } else if (lastTopic._type === "experience") {
        processedQuery += ` ${lastTopic.role} ${lastTopic.company}`;
      }
    }
    
    const searchQuery = processedQuery || q;
    
    // Perform search with multiple strategies
    let finalResults = fuseRef.current.search(searchQuery, { limit: 10 });
    
    // If no results, try a broader search
    if (finalResults.length === 0) {
      const broaderSearch = fuseRef.current.search(searchQuery, { 
        limit: 5, 
        threshold: 0.5
      });
      finalResults = broaderSearch;
    }

    // Craft narrative with context awareness
    const narrative = craftNarrativeFromResults(finalResults, q, lastTopic);
    
    // Update last topic for context
    if (finalResults.length > 0) {
      setLastTopic(finalResults[0].item);
    }

    // Push with typewriter animation
    setMessages((m) => m.filter((mm) => !(mm.role === "saba" && mm.text === "")));
    await typeOut(narrative, 14);

    // Prepare follow-ups (based on top item and query context)
    const top = finalResults[0] ? finalResults[0].item : null;
    const followUps = makeFollowUps(top, q);
    setSuggestions(followUps);
  };

  // Suggestion click
  const handleSuggestionClick = (s) => {
    handleSend(s);
    setSuggestions([]);
  };

  // Voice toggle
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
        setListening(false);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mt-10 px-4 sm:px-6">
      <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-semibold text-white/90 mb-3">Ask Saba</h3>

        {/* Messages list */}
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

        {/* Suggestions */}
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

        {/* Input row */}
        <div className="mt-4 flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder="Ask about skills, projects, or experience — e.g. 'React performance examples'"
            className="flex-1 bg-white/5 placeholder-gray-400 text-white rounded-lg px-3 py-2 outline-none"
          />

          {/* Microphone button */}
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