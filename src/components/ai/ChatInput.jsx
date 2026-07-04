import { SendHorizonal } from "lucide-react";

function ChatInput({ question, setQuestion, loading, onSubmit }) {
  const handleKeyDown = (e) => {
    // Shift+Enter adds a newline; plain Enter submits.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-slate-100 shrink-0">
      <form onSubmit={onSubmit} className="flex items-end gap-3">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything from your SOP knowledge base…"
          rows={2}
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-700 placeholder:text-slate-400 disabled:opacity-60 transition"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="w-11 h-11 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white flex items-center justify-center transition disabled:opacity-40 shrink-0"
        >
          <SendHorizonal size={17} />
        </button>
      </form>
      <p className="text-[10px] text-slate-400 mt-2 text-right">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}

export default ChatInput;
