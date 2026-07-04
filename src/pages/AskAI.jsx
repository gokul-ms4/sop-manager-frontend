import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import api from "../api/axios";

import ChatInput from "../components/ai/ChatInput";
import MessageThread from "../components/ai/MessageThread";

function AskAI() {
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState("quick");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const location = useLocation();
const navigate = useNavigate();
const autoAsked = useRef(false);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const saveRecentQuestion = (text, mode) => {
    const current = JSON.parse(localStorage.getItem("recent_questions") || "[]");

    const updated = [
      { text, mode },
      ...current.filter((item) => item.text !== text),
    ].slice(0, 8);

    localStorage.setItem("recent_questions", JSON.stringify(updated));
  };

 const askQuestion = async (e, forcedQuestion = null, forcedMode = null) => {
  if (e) e.preventDefault();

  const text = forcedQuestion ?? question.trim();
  const selectedMode = forcedMode ?? mode;

  if (!text || loading) return;

  const userMsg = {
    role: "user",
    text,
    mode: selectedMode,
  };

  setMessages((prev) => [...prev, userMsg]);

  setQuestion("");

  setLoading(true);

  try {
    const res = await api.post("/api/v1/sop_heading/ask_question", {
      question: text,
      mode: selectedMode,
    });

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: res.data.answer,
        question: res.data.question,
      },
    ]);

    saveRecentQuestion(text, selectedMode);
  } catch (err) {
    console.error(err.response?.data || err);

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: "Something went wrong. Please try again.",
        question: text,
        error: true,
      },
    ]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (autoAsked.current) return;

  const autoQuestion = location.state?.autoQuestion;
  if (!autoQuestion) return;

  autoAsked.current = true;

  const autoMode = location.state?.autoMode || "quick";

  setTimeout(() => {
    askQuestion(null, autoQuestion, autoMode);
  });

  navigate(location.pathname, {
    replace: true,
    state: null,
  });
}, [location.state, navigate]);

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="bg-slate-900 rounded-2xl p-7 text-white relative overflow-hidden shrink-0">
        <div className="absolute w-64 h-64 bg-emerald-600/20 rounded-full -right-16 -top-16" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            <Sparkles size={13} />
            SOP AI Assistant
          </div>

          <h1 className="text-2xl font-bold mb-1">
            Ask questions from your SOP knowledge base
          </h1>

          <p className="text-slate-400 text-sm max-w-xl">
            Use quick mode for direct answers, or full SOP mode for
            process-based responses.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden min-h-0">
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Conversation
          </p>

          <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode("quick")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === "quick"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Quick Answer
            </button>

            <button
              type="button"
              onClick={() => setMode("full")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === "full"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Full SOP
            </button>
          </div>
        </div>

        <MessageThread
          messages={messages}
          loading={loading}
          bottomRef={bottomRef}
        />

        <ChatInput
          question={question}
          setQuestion={setQuestion}
          loading={loading}
          onSubmit={askQuestion}
        />
      </div>
    </div>
  );
}

export default AskAI;