import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";

/* Endpoint */

const CHAT_URL = `${
  import.meta.env.VITE_SUPABASE_URL
}/functions/v1/ai-recommend`;


type Msg = {
  role: "user" | "assistant";
  content: string;
};

const AIChatRecommender = () => {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",

      content:
        "Hey! 👋 I'm your AI travel companion for India. Tell me what kind of experience you're looking for — adventure, culture, food, spiritual — and I'll suggest perfect destinations!",
    },
  ]);

  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const abortRef = useRef<AbortController | null>(null);

  /* Auto Scroll */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* Send Message */

  const send = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Msg = {
      role: "user",

      content: input,
    };

    const newMessages = [...messages, userMsg];

    setMessages(newMessages);

    setInput("");

    setIsLoading(true);

    /* Cancel previous */

    abortRef.current?.abort();

    const controller = new AbortController();

    abortRef.current = controller;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",

        signal: controller.signal,

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${
            import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
          }`,
        },

        body: JSON.stringify({
          messages: newMessages,

          mode: "chat",
        }),
      });

      if (!resp.ok) throw new Error("API failed");

      const data = await resp.text();

      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",

          content: data,
        },
      ]);
    } catch (e: any) {
      if (e.name === "AbortError") return;

      setMessages((prev) => [
        ...prev,

        {
          role: "assistant",

          content: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading]);

  return (
    <>
      {/* Floating Button */}

      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            exit={{
              scale: 0,
            }}
            onClick={() => setOpen(true)}
            className="
            fixed bottom-20 right-4
            z-50
            w-14 h-14
            rounded-full
            bg-primary
            text-primary-foreground
            shadow-lg
            flex items-center justify-center
            hover:bg-primary/90
            transition-colors
            md:bottom-6
            "
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            className="
            fixed bottom-20 right-4
            z-50
            w-80 sm:w-96
            h-[28rem]
            rounded-2xl
            bg-card
            border border-border
            shadow-2xl
            flex flex-col
            overflow-hidden
            md:bottom-6
            "
          >
            {/* Header */}

            <div
              className="
              flex items-center justify-between
              px-4 py-3
              bg-primary
              text-primary-foreground
              "
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />

                <span className="font-bold text-sm">AI Travel Guide</span>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="
                p-1
                hover:bg-primary-foreground/10
                rounded
                "
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}

            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask about destinations..."
                  className="
                  flex-1
                  rounded-full
                  bg-secondary
                  px-4 py-2
                  text-sm
                  focus:outline-none
                  "
                />

                <button
                  onClick={send}
                  disabled={!input.trim() || isLoading}
                  className="
                  w-9 h-9
                  rounded-full
                  bg-primary
                  text-primary-foreground
                  flex items-center justify-center
                  disabled:opacity-50
                  "
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatRecommender;
