"use client";

import React, { useState, useEffect } from "react";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

export default function TestPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! This is a test chat. How can I help you?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isAIResponding, setIsAIResponding] = useState(false);

  async function fetchAIResponse() {
    try {
      const formattedMessages = messages.map(msg => ({
        role: msg.sender === 'ai' ? 'assistant' : 'user',
        content: msg.text
      }));
      const response = await fetch(`/api/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          chat_log: formattedMessages
        }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: messages.length + 1,
        text: data.response,
        sender: "ai",
      }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, {
        id: messages.length + 1,
        text: "Sorry, there was an error. Please try again.",
        sender: "ai",
      }]);
    } finally {
      setIsAIResponding(false);
    }
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, {
      id: messages.length + 1,
      text: input,
      sender: "user",
    }]);
    setInput("");
  }



  useEffect(() => {
    if (messages[messages.length - 1]?.sender === "user") {
      setIsAIResponding(true);
      fetchAIResponse();
    }
  }, [messages]);



  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="border rounded-lg p-4 h-[500px] overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 p-2 rounded ${
              msg.sender === "user" 
                ? "bg-blue-100 ml-auto max-w-[80%]" 
                : "bg-gray-100 max-w-[80%]"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type a message..."
          disabled={isAIResponding}
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isAIResponding}
        >
          Send
        </button>
      </form>
    </div>
  );
}