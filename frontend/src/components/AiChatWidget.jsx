import { useState } from "react";
import axios from "axios";

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "🌾 Ask me agriculture related questions",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/ai/chat", {
        message,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "AI is temporarily unavailable",
        },
      ]);
    }

    setMessage("");

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setOpen(!open)}
        className="
          fixed
          bottom-6
          right-6
          z-50
          bg-green-600
          text-white
          px-5
          py-3
          rounded-full
          shadow-lg
        "
      >
        🌾 AI Help
      </button>

      {/* Chat Window */}

      {open && (
        <div
          className="
            fixed
            bottom-20
            right-6
            w-[340px]
            h-[500px]
            bg-white
            rounded-2xl
            shadow-2xl
            z-50
            flex
            flex-col
            overflow-hidden
          "
        >
          {/* Header */}

          <div className="bg-green-600 text-white p-4 font-bold">
            Agriculture AI Assistant
          </div>

          {/* Messages */}

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`
                  p-3
                  rounded-xl
                  text-sm
                  max-w-[85%]
                  ${
                    msg.role === "user" ? "bg-green-100 ml-auto" : "bg-gray-100"
                  }
                `}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500">AI is typing...</div>
            )}
          </div>

          {/* Input */}

          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              placeholder="Ask farming question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="
                flex-1
                border
                rounded-lg
                px-3
                py-2
                outline-none
              "
            />

            <button
              onClick={sendMessage}
              className="
                bg-green-600
                text-white
                px-4
                rounded-lg
              "
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
