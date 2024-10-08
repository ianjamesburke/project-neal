"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Message = {
  id: number
  text: string
  sender: "user" | "ai"
  suggestions?: string[]
}

interface ChatSectionProps {
  onRenderIdChange: (renderId: string | null) => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({ onRenderIdChange }) => {
  const initialMessage = "Hello! Welcome to Project-Neal. I'm here to help you create high converting video creative. Tell me what is your product called and tell me a bit about it. \n\n i only know about one product right now shhhh"
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: initialMessage, sender: "ai", suggestions: ["Enter debug mode"] }
  ])
  const [input, setInput] = useState("")
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [chatLog, setChatLog] = useState<{ role: string, content: string }[]>([
    { role: "assistant", content: initialMessage }
  ])
  const [isAIResponding, setIsAIResponding] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [backendError, setBackendError] = useState(false);
  const [askForUploads, setAskForUploads] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [uploadMessageId, setUploadMessageId] = useState<number | null>(null);

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
      const response = await fetch(`flask/message-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ chat_log: chatLog, thread_id: threadId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
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

      if (data.ask_for_uploads && !filesUploaded && uploadMessageId === null) {
        setAskForUploads(true);
        setUploadMessageId(aiResponse.id);
      }


    } catch (error) {
      console.error("Error fetching AI response:", error);
      let errorMessage = "Sorry, there was an error processing your request. The backend might be unavailable. Please try again later.";
      
      if (error instanceof Error) {
        errorMessage += ` Error details: ${error.message}`;
      }
      
      setMessages(prevMessages => [...prevMessages, {
        id: messages.length + 1,
        text: errorMessage,
        sender: "ai"
      }]);
      setBackendError(true);
    } finally {
      setIsAIResponding(false);
    }
  }

  async function scriptReady(chatLog: { role: string, content: string }[]) {
    console.log("Script is ready! Sending fetch to build payload...");
    try {
      const response = await fetch(`flask/build-payload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ chat_log: chatLog }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const render_id = data.render_id;
      const video_url = data.video_url;
      console.log("build-payload data:", render_id, video_url);
      
      if (data.render_id) {
        onRenderIdChange(data.render_id);
      }

    } catch (error) {
      console.error("Error generating video:", error);
    }
  }

  const handleFileUpload = () => {
    console.log("Upload button clicked");
    // Logic to handle file upload
    setFilesUploaded(true);
    // Do not set askForUploads to false here
  };

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
                <div className="flex shrink-0 self-start w-8 h-8">
                  {message.sender === 'user' ? (
                    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd4368c4193fe4718cfa135c8756b207c6c60327fb1b953e7cc4b74b0e20c21b?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4" alt="User avatar" className="object-contain w-8 h-8 rounded-full" />
                  ) : (
                    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/dc4cb80a02a243578c9954e82786edefd12c5ff04884d7847e26ef6f467d0be6?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4" alt="Logo" className="object-contain w-8 h-8 rounded-half"/>
                  )}
                </div>
                <div className={`mx-2 p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-neutral-800'
                    : 'bg-neutral-800 bg-opacity-50'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
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
                  {message.sender === 'ai' && message.id === uploadMessageId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 transition-transform duration-200 ease-in-out hover:scale-105 bg-neutral-700 text-white border-neutral-600 hover:bg-neutral-600"
                      onClick={handleFileUpload}
                    >
                      Upload Files
                    </Button>
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