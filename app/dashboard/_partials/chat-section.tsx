"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/lib/utils/uploadthing";
import { MoveRight, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ScrollArea } from "@/components/ui/scroll-area";


type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
  suggestions?: string[];
};

interface ChatSectionProps {
  onRenderIdChange: (renderId: string | null) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  onRenderIdChange,
  messages,
  setMessages,
}) => {
  const initialMessage =
    "Welcome to Splice AI! I can help you create engaging video content. Where would you like to start?";

  // States
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [backendError, setBackendError] = useState(false);
  const [askForUploads, setAskForUploads] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [uploadMessageId, setUploadMessageId] = useState<number | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  async function fetchAIResponse() {
    try {
      const formattedMessages = messages.map(msg => ({
        role: msg.sender === 'ai' ? 'assistant' : 'user',
        content: msg.text
      }));

      console.log("FETCHING... formattedMessages:", formattedMessages);
      const response = await fetch(`/api/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ 
          chat_log: formattedMessages, 
          thread_id: threadId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(
            errorData
          )}`
        );
      }

      const data = await response.json();

      console.log("AI response data:", data);

      const newThreadId = data.thread_id || null;

      const aiResponse: Message = {
        id: messages.length + 1,
        text: data.response,
        sender: "ai",
        suggestions: data.suggestions || [],
      };

      setMessages(prevMessages => [...prevMessages, aiResponse]);

      setThreadId(newThreadId);

      if (data.script_ready) {
        scriptReady();
      }

      if (data.ask_for_uploads && !filesUploaded && uploadMessageId === null) {
        setAskForUploads(true);
        setUploadMessageId(aiResponse.id);
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      let errorMessage =
        "Sorry, there was an error processing your request. The backend might be unavailable. Please try again later.";

      if (error instanceof Error) {
        errorMessage += ` Error details: ${error.message}`;
      }

      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: messages.length + 1,
          text: errorMessage,
          sender: "ai",
        },
      ]);
      setBackendError(true);
    } finally {
      setIsAIResponding(false);
    }
  }

  async function sendMessage(text: string, isSuggestion: boolean = false) {
    const newUserMessage: Message = {
      id: messages.length + 1,
      text,
      sender: "user",
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInput("");
  }

  async function scriptReady() {
    if (isGeneratingVideo) return;
    setIsGeneratingVideo(true);

    try {
      const response = await fetch(`/api/build-payload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ 
          chat_log: messages.map(msg => ({
            role: msg.sender === 'ai' ? 'assistant' : 'user',
            content: msg.text
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("build-payload data:", data.render_id, data.video_url);

      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Your video is being generated! You'll see it appear on the right soon.",
        sender: "ai"
      }]);

      if (data.render_id) {
        onRenderIdChange(data.render_id);
      }
    } catch (error) {
      console.error("Error generating video:", error);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Sorry, there was an error generating your video. Please try again.",
        sender: "ai"
      }]);
    } finally {
      setIsGeneratingVideo(false);
    }
  }



  const handleFileUpload = () => {
    console.log("Upload button clicked");
    // Logic to handle file upload
    setFilesUploaded(true);
    // Do not set askForUploads to false here
  };

  const handleSendClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAIResponding) return;

    setMessages(prev => [...prev, {
      id: messages.length + 1,
      text: input,
      sender: "user",
    }]);
    setInput("");
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion, true);
  };



  // Effects
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (
      !isAIResponding &&
      messages.length > 0 &&
      messages[messages.length - 1].sender === "user"
    ) {
      setIsAIResponding(true);
    }
  }, [messages, isAIResponding]);

  useEffect(() => {
    if (isAIResponding && !backendError) {
      fetchAIResponse();
    }
  }, [isAIResponding, backendError]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: initialMessage,
          sender: "ai",
          suggestions: [
            "Transcribe a TikTok",
            "Open previous project",
            "Create a new project"
          ],
        },
      ]);
    }
  }, []);

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-dark-700 bg-dark-800 text-sm text-white">
      <ScrollArea className="pb-8">
        <div
          ref={messagesContainerRef}
          className="flex flex-col px-4 pb-12 pt-8"
        >
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } ${index > 0 && messages[index - 1].sender !== message.sender ? "mt-4" : "mt-1"}`}
            >
              <div
                className={`flex max-w-[80%] items-start gap-4 ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 self-start",
                    message.sender === "user" && "hidden"
                  )}
                >
                  {message.sender === "ai" && (
                    <div className="h-8 w-8 rounded-full bg-purple-400"></div>
                  )}
                </div>
                <div
                  className={` ${
                    message.sender === "user" && "rounded-lg bg-dark-700 p-3"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-base font-normal">
                    {message.text}
                  </p>
                  {message.suggestions && (
                    <div className="mt-2 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="mr-2 mt-2 border-neutral-600 bg-neutral-700 text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-neutral-600 hover:text-white"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  {message.sender === "ai" &&
                    message.id === uploadMessageId && (
                      <div className="mt-4">
                        <UploadButton
                          endpoint="videoUploader"
                          onClientUploadComplete={async (res) => {
                            console.log("Files: ", res);
                            for (const file of res) {
                              try {
                                const encodedUrl = encodeURIComponent(file.url);
                                console.log("Uploading URL to DB: ", encodedUrl);
                                const response = await fetch('/api/put-footage-url', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ footage_url: encodedUrl }),
                                });

                                if (!response.ok) {
                                  throw new Error(`HTTP error! status: ${response.status}`);
                                }

                                const data = await response.json();
                                console.log("DB response: ", data);
                              } catch (error) {
                                console.error("Error uploading footage URL to DB: ", error);
                              }
                            }
                          }}
                          onUploadError={(error: Error) => {
                            alert(`ERROR! ${error.message}`);
                          }}
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="absolute bottom-4 left-0 right-0 mx-4 z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendClick(e);
          }}
          className="flex h-10 w-full items-center rounded-lg border border-dark-700 bg-dark-800 p-1.5"
        >
          <div onClick={() => document.getElementById("file-input")?.click()}>
            <Paperclip className="h-6 w-6" />
          </div>
          <input type="file" id="file-input" className="hidden" />
          <Input
            type="text"
            placeholder="Respond to the AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mr-2 border-none bg-transparent pl-2.5 text-sm text-white focus:outline-none"
          />
          <Button 
            type="submit" 
            variant={"white"} 
            className="h-[30px] w-12"
            disabled={isAIResponding}
          >
            <MoveRight className="h-6 w-6" />
          </Button>
        </form>
      </div>
    </section>
  );
};
