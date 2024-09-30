"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://project-neal-flask.vercel.app';

type Message = {
  id: number
  text: string
  sender: "user" | "ai"
  suggestions?: string[]
}

interface ChatSectionProps {
  onVideoReady: (url: string) => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({ onVideoReady }) => {
  const initialMessage = "Hello! Welcome to Storytime. We help you create winning product videos. I currently come pre-loaded with free footage of popular products on TikTok shop. Select a product below to begin..."
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: initialMessage, sender: "ai", suggestions: ["No BS Toothpaste", "Product 2", "Product 3", "I just like buttons"] }
  ])
  const [input, setInput] = useState("")
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [chatLog, setChatLog] = useState<{ role: string, content: string }[]>([
    { role: "assistant", content: initialMessage }
  ])
  const [isAIResponding, setIsAIResponding] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [backendError, setBackendError] = useState(false);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isAIResponding && chatLog.length > 0 && chatLog[chatLog.length - 1].role === "user") {
      setIsAIResponding(true)
    }
  }, [chatLog, isAIResponding])

  useEffect(() => {
    if (isAIResponding && !backendError) {
      fetchAIResponse()
    }
  }, [isAIResponding, backendError])

  async function fetchAIResponse() {
    try {
      const response = await fetch(`api/message-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ chat_log: chatLog, thread_id: threadId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();

      console.log("AI response data:", data);

      const newThreadId = data.thread_id || null;

      const aiResponse: Message = {
        id: messages.length + 1,
        text: data.response,
        sender: "ai",
        suggestions: []
      }
      setMessages(prevMessages => [...prevMessages, aiResponse]);

      setChatLog(prevChatLog => {
        const updatedChatLog = [...prevChatLog, { role: "assistant", content: data.response }]
        console.log("Updated chat log after AI response:", updatedChatLog)
        return updatedChatLog
      });

      setThreadId(newThreadId);

      if (data.script_ready) {
        scriptReady(chatLog)
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages(prevMessages => [...prevMessages, {
        id: messages.length + 1,
        text: "Sorry, there was an error processing your request. The backend might be unavailable. Please try again later.",
        sender: "ai"
      }]);
      setBackendError(true);
    } finally {
      setIsAIResponding(false);
    }
  }

  async function scriptReady(chatLog: { role: string, content: string }[]) {
    console.log("Script is ready! Sending fetch to render video...")
    try {
      const response = await fetch(`${API_BASE_URL}/render-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ chat_log: chatLog }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      console.log("generate video response data:", data)

      const renderId = data.render_id;
      // You might want to do something with renderId here

    } catch (error) {
      console.error("Error generating video:", error)
    }
  }

  async function sendMessage(text: string, isSuggestion: boolean = false) {
    const newUserMessage: Message = { id: messages.length + 1, text, sender: "user" }
    setMessages(prevMessages => [...prevMessages, newUserMessage])
    setInput("")

    setChatLog(prevChatLog => {
      const updatedChatLog = [...prevChatLog, { role: "user", content: text }]
      console.log("Updated chat log after user message:", updatedChatLog)
      return updatedChatLog
    })
  }

  const handleSendClick = () => {
    if (input.trim()) {
      sendMessage(input)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion, true)
  }
  
  return (
    <section className="flex flex-col h-full w-full text-sm text-white bg-neutral-800 bg-opacity-30 overflow-hidden rounded-2xl border border-neutral-800">
      <div ref={messagesContainerRef} className="flex-grow overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex shrink-0 self-start w-8 h-8 bg-white rounded-full" aria-hidden="true"></div>
                <div className={`mx-2 p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-neutral-800'
                    : 'bg-neutral-800 bg-opacity-50'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  {message.suggestions && (
                    <div className="mt-2 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="mr-2 mt-2 transition-transform duration-200 ease-in-out hover:scale-105 bg-neutral-700 text-white border-neutral-600 hover:bg-neutral-600"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleSendClick(); }} className="flex items-center px-4 py-3 w-full bg-neutral-800 rounded-b-2xl">
        <Input
          type="text"
          placeholder="Respond to the AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-transparent border-none focus:outline-none text-white text-sm mr-2"
        />
        <Button type="submit" aria-label="Send message" className="bg-transparent border-none p-0">
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/579006c474f7fd0463e8d5c08fe8fd4ed4a766705cb8b34c72e15d8db8c5fbf8?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4" alt="" className="object-contain w-8 h-8" />
        </Button>
      </form>
    </section>
  );
};

export default ChatSection;