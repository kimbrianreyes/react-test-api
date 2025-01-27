import React, { useState } from "react";

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResponse = async (userMessage: string) => {
    setLoading(true);
    const url = "https://chat-gpt26.p.rapidapi.com/";
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": "b6e720ba2bmsh76d33c150b57096p1f52b0jsn747d76de4211",
        "x-rapidapi-host": "chat-gpt26.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const botMessage = result.choices[0].message.content;
      setMessages([
        ...messages,
        { role: "user", content: userMessage },
        { role: "bot", content: botMessage },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResponse(input);
    setInput("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">AI Chat Bot</h1>
      <div className="mb-4 h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded flex items-start ${
              message.role === "user" ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <img
              src={message.role === "user" ? "/user.png" : "/bot.png"}
              alt={message.role}
              className="w-8 h-8 mr-2 rounded-full"
            />
            <div>
              <strong>{message.role}:</strong> {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center justify-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-l"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-r">
          Enter
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
