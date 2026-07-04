import { useEffect, useState } from "react";
import { Bot, User } from "lucide-react";

// ---------------------------------------------------------------------------
// Inline formatter — handles **bold** within a single line.
// ---------------------------------------------------------------------------
function InlineText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-slate-800">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Block formatter — turns raw AI text into headings, bullets, paragraphs.
// ---------------------------------------------------------------------------
function formatBlocks(text) {
  const raw = text.split("\n");
  const blocks = [];
  let currentList = null;
  let prevWasHeading = false;

  const flushList = () => {
    if (currentList) {
      blocks.push({ type: "list", items: currentList });
      currentList = null;
    }
  };

  raw.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      prevWasHeading = false;
      return;
    }

    const isHeading = trimmed.endsWith(":") && trimmed.length < 80;
    const explicitBullet = /^[-*]\s+(.+)$/.exec(trimmed);
    const numberedBullet = /^\d+\.\s+(.+)$/.exec(trimmed);

    if (isHeading) {
      flushList();
      blocks.push({ type: "heading", text: trimmed.slice(0, -1) });
      prevWasHeading = true;
      return;
    }
    if (explicitBullet) {
      if (!currentList) currentList = [];
      currentList.push(explicitBullet[1]);
      prevWasHeading = false;
      return;
    }
    if (numberedBullet) {
      if (!currentList) currentList = [];
      currentList.push(numberedBullet[1]);
      prevWasHeading = false;
      return;
    }
    if (prevWasHeading || currentList) {
      if (!currentList) currentList = [];
      currentList.push(trimmed);
      prevWasHeading = false;
      return;
    }

    flushList();
    blocks.push({ type: "paragraph", text: trimmed });
    prevWasHeading = false;
  });

  flushList();
  return blocks;
}

function FormattedAnswer({ text }) {
  const blocks = formatBlocks(text);
  return (
    <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <p key={i} className="font-semibold text-slate-800 mt-1">
              <InlineText text={block.text} />
            </p>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>
                    <InlineText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            <InlineText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Typewriter hook
//
// Uses the "derived state reset" pattern to avoid calling setState inside an
// effect body (which causes the cascading-renders warning). When `fullText`
// changes we reset `index` during the render phase — React immediately
// re-renders with index=0 before committing, so there's no extra paint.
//
// The ticker uses self-scheduling setTimeout instead of setInterval so each
// tick always reads a fresh `index` value via the functional updater, with no
// stale-closure issues.
// ---------------------------------------------------------------------------
function useTypewriter(fullText, speed = 18) {
  const [index, setIndex] = useState(0);
  // Track the previous fullText value so we can detect when it changes.
  const [prevText, setPrevText] = useState(fullText);

  // Reset during render (not inside an effect) — this is React's recommended
  // pattern for resetting state in response to a prop change.
  if (prevText !== fullText) {
    setPrevText(fullText);
    setIndex(0);
  }

  useEffect(() => {
    if (!fullText || index >= fullText.length) return;

    const timeout = setTimeout(() => {
      // Functional updater — always based on the latest index,
      // never a stale closure value.
      setIndex((i) => Math.min(i + 3, fullText.length));
    }, speed);

    return () => clearTimeout(timeout);
  }, [fullText, index, speed]);

  const displayed = fullText ? fullText.slice(0, index) : "";
  const done = !fullText || index >= fullText.length;

  return { displayed, done };
}

// ---------------------------------------------------------------------------
// Blinking cursor shown while the typewriter is still going.
// ---------------------------------------------------------------------------
function Cursor() {
  return (
    <span className="inline-block w-[2px] h-[1em] bg-emerald-500 ml-0.5 align-middle animate-pulse" />
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
        <Bot size={16} className="text-emerald-600" />
      </div>
      <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-sm px-5 py-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function UserBubble({ message }) {
  return (
    <div className="flex items-end gap-3 justify-end">
      <div className="max-w-[85%] sm:max-w-[72%]">
        <div className="flex items-center justify-end gap-1.5 mb-1.5">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              message.mode === "full"
                ? "bg-slate-100 text-slate-500"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {message.mode === "full" ? "Full SOP" : "Quick"}
          </span>
        </div>
        <div className="bg-slate-900 text-white px-5 py-3.5 rounded-2xl rounded-br-sm text-sm leading-relaxed">
          {message.text}
        </div>
      </div>
      <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
        <User size={15} className="text-white" />
      </div>
    </div>
  );
}

function AIBubble({ message, animate }) {
  const { displayed, done } = useTypewriter(animate ? message.text : "");

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-1">
        <Bot size={16} className="text-emerald-600" />
      </div>
      <div
        className={`max-w-[88%] sm:max-w-[80%] px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl rounded-tl-sm border ${
          message.error
            ? "bg-red-50 border-red-100 text-red-600"
            : "bg-slate-50 border-slate-100"
        }`}
      >
        {message.error ? (
          <p className="text-sm">{message.text}</p>
        ) : animate ? (
          done ? (
            // Animation finished — render fully formatted blocks.
            <FormattedAnswer text={message.text} />
          ) : (
            // Still typing — plain text + blinking cursor.
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {displayed}
              <Cursor />
            </p>
          )
        ) : (
          // Older message — always show fully formatted, no animation.
          <FormattedAnswer text={message.text} />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <Bot size={26} className="text-emerald-500" />
      </div>
      <h3 className="text-sm font-bold text-slate-700 mb-1">No questions yet</h3>
      <p className="text-xs text-slate-400 max-w-xs">
        Type a question below and the AI will answer from your SOP knowledge base.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
function MessageThread({ messages, loading, bottomRef }) {
  if (messages.length === 0 && !loading) {
    return <EmptyState />;
  }

  const lastAiIndex = messages.reduce(
    (acc, msg, i) => (msg.role === "ai" ? i : acc),
    -1
  );

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-5 space-y-5 min-h-0">
      {messages.map((msg, i) =>
        msg.role === "user" ? (
          <UserBubble key={i} message={msg} />
        ) : (
          <AIBubble key={i} message={msg} animate={i === lastAiIndex} />
        )
      )}
      {loading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageThread;
