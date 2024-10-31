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
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  onRenderIdChange,
}) => {
  const initialMessage =
    "Hey! Welcome to Splice AI. Here’s how it works. I’ll ask you to upload some b-roll footage of the product you’re advertising, and then I’ll ask you a few questions about the product itself. Then, I’ll chop up the footage, generate a script, and edit it into a full blown ad creative. Let’s begin!";

  // States
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: initialMessage,
      sender: "ai",
      // suggestions: ["Enter debug mode"],
    }
  ]);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [backendError, setBackendError] = useState(false);
  const [askForUploads, setAskForUploads] = useState(true);
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [uploadMessageId, setUploadMessageId] = useState<number | null>(1);

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
        suggestions: [],
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
    const formattedMessages = messages.map(msg => ({
      role: msg.sender === 'ai' ? 'assistant' : 'user',
      content: msg.text
    }));

    try {
      const response = await fetch(`/api/flask/build-payload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ chat_log: formattedMessages }),
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

  return (
    <section className=" relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-dark-700 bg-dark-800 text-sm text-white">
      <ScrollArea className=" pb-8">
        <div
          ref={messagesContainerRef}
          className="flex flex-col px-4  pb-12  pt-8"
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
                  {/* {message.sender === "ai" && (
                    <Image
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd4368c4193fe4718cfa135c8756b207c6c60327fb1b953e7cc4b74b0e20c21b?placeholderIfAbsent=true&apiKey=63d274d5dd09415cb8f5e51781b306a4"
                      alt="User avatar"
                      width={32}
                      height={32}
                      className=" rounded-full object-contain"
                    />
                  )} */}
                  {message.sender === "ai" && (
                    <div className="h-8 w-8 rounded-full bg-gray"></div>
                  )}
                </div>
                {/* MESSAGE CONTENT */}
                <div
                  className={` ${
                    message.sender === "user" && "rounded-lg  bg-dark-700  p-3"
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
                          className="mr-2 mt-2 border-neutral-600 bg-neutral-700 text-white transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-neutral-600"
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
