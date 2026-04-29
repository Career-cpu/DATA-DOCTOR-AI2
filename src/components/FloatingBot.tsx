import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ai, strategyConsultantInstruction } from "../lib/gemini";
import ReactMarkdown from "react-markdown";
import { useSoundEffects } from "../hooks/useSoundEffects";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

export default function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "model",
      text: "Xin chào, tôi là AI Strategy Consultant. Tôi có thể giúp bạn tối ưu hóa các chỉ số kinh doanh (ROAS, NNS, COGS, P&L) và tư vấn quy trình bảo mật dữ liệu. Bạn cần hỗ trợ gì hôm nay?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { playHoverSound, playClickSound, playBotMessageSound } = useSoundEffects();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = ai.chats.create({
        model: "gemini-3.1-flash-lite-preview",
        config: {
          systemInstruction: strategyConsultantInstruction,
        }
      });
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: input });
      
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: response.text || "Xin lỗi, tôi không thể trả lời lúc này."
      };
      
      setMessages((prev) => [...prev, modelMessage]);
      playBotMessageSound();
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "model", text: "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau." }
      ]);
      playBotMessageSound();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col h-[500px]"
          >
            <div className="bg-slate-50 p-4 flex items-center justify-between text-slate-900 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Strategy Consultant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Online</p>
                  </div>
                </div>
              </div>
              <button onClick={() => { setIsOpen(false); playClickSound(); }} onMouseEnter={playHoverSound} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-white space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === "user" 
                      ? "bg-gradient-to-r from-yellow-500 to-purple-600 text-white rounded-tr-none shadow-md" 
                      : "bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none"
                  }`}>
                    {msg.role === "model" ? (
                      <div className="prose prose-sm prose-slate max-w-none prose-headings:text-slate-900 prose-p:leading-relaxed">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                      playClickSound();
                    }
                  }}
                  placeholder="Hỏi về ROAS, P&L, Bảo mật..."
                  className="flex-1 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                />
                <button
                  onClick={() => { handleSend(); playClickSound(); }}
                  onMouseEnter={playHoverSound}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setIsOpen(!isOpen); playClickSound(); }}
        onMouseEnter={playHoverSound}
        className="fixed bottom-6 right-6 w-14 h-14 bg-white text-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-900/10 z-50 border border-slate-200"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </motion.button>
    </>
  );
}
