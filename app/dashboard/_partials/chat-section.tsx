"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/lib/utils/uploadthing";
import { MoveRight, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
  suggestions?: string[];
};

type ChatLog = {
  role: "user" | "assistant";
  content: string;
};

interface ChatSectionProps {
  onRenderIdChange: (renderId: string | null) => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  onRenderIdChange,
}) => {
  const initialMessage =
    "Hello! Welcome to Project-Neal. I'm here to help you create high converting video creative. Tell me what is your product called and tell me a bit about it. \n\n i only know about one product right now shhhh";

  // States
  const [messages, setMessages] = useState<Message[]>([
    /* {
      id: 1,
      text: initialMessage,
      sender: "ai",
      suggestions: ["Enter debug mode"],
    }, */
    {
      id: 2,
      text: "People are tired of chemical-heavy skincare products, so we introduced our totally organic facial cream.",
      sender: "ai",
    },
    {
      id: 3,
      text: "People are tired of chemical-heavy skincare products.",
      sender: "user",
    },
    {
      id: 4,
      text: "Hello bro",
      sender: "user",
    },
    {
      id: 5,
      text: "People are tired of chemical-heavy skincare products, so we introduced our totally organic facial cream.",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [chatLog, setChatLog] = useState<ChatLog[]>([
    { role: "assistant", content: initialMessage },
  ]);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [backendError, setBackendError] = useState(false);
  const [askForUploads, setAskForUploads] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [uploadMessageId, setUploadMessageId] = useState<number | null>(null);

  async function fetchAIResponse() {
    try {
      const response = await fetch(`flask/message-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ chat_log: chatLog, thread_id: threadId }),
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

      setMessages((prevMessages) => [...prevMessages, aiResponse]);

      setChatLog((prevChatLog) => {
        const updatedChatLog: ChatLog[] = [
          ...prevChatLog,
          { role: "assistant", content: data.response },
        ];
        console.log("Updated chat log after AI response:", updatedChatLog);
        return updatedChatLog;
      });

      setThreadId(newThreadId);

      if (data.script_ready) {
        scriptReady(chatLog);
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

      setMessages((prevMessages) => [
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
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput("");

    setChatLog((prevChatLog) => {
      const updatedChatLog: ChatLog[] = [
        ...prevChatLog,
        { role: "user" as const, content: text },
      ];
      console.log("Updated chat log after user message:", updatedChatLog);
      return updatedChatLog;
    });
  }

  async function scriptReady(chatLog: { role: string; content: string }[]) {
    console.log("Script is ready! Sending fetch to build payload...");
    try {
      const response = await fetch(`flask/fetch-quincy-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
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

  const handleSendClick = () => {
    if (input.trim()) {
      sendMessage(input);
    }
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
      chatLog.length > 0 &&
      chatLog[chatLog.length - 1].role === "user"
    ) {
      setIsAIResponding(true);
    }
  }, [chatLog, isAIResponding]);

  useEffect(() => {
    if (isAIResponding && !backendError) {
      fetchAIResponse();
    }
  }, [isAIResponding, backendError]);

  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-dark-700 bg-dark-800 px-4 pb-4 pt-8 text-sm text-white">
      <div ref={messagesContainerRef} className="grow overflow-y-auto">
        <div className="flex flex-col">
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
                          onClientUploadComplete={(res) => {
                            console.log("Files: ", res);
                            alert("Upload Completed");
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
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendClick();
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
        <Button type="submit" variant={"white"} className="h-[30px] w-12">
          <MoveRight className="h-6 w-6" />
        </Button>
      </form>
    </section>
  );
};
