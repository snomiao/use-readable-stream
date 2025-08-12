import React, { useState, useRef } from "react";
import { useReadableStream } from "../index";

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
}

function ChatStreamExample() {
  const [stream, setStream] = useState<ReadableStream<ChatMessage>>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const controllerRef =
    useRef<ReadableStreamDefaultController<ChatMessage>>(null);

  const [value, done, error] = useReadableStream(stream);

  // Update messages when new value arrives
  React.useEffect(() => {
    if (value) {
      setMessages((prev) => [...prev, value]);
    }
  }, [value]);

  const startChatStream = () => {
    const chatStream = new ReadableStream<ChatMessage>({
      start(controller) {
        controllerRef.current = controller;
      },
    });

    setStream(chatStream);
    setMessages([]);
  };

  const sendMessage = (text: string) => {
    if (controllerRef.current) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        text,
        timestamp: new Date(),
      };
      controllerRef.current.enqueue(message);
    }
  };

  const endChat = () => {
    if (controllerRef.current) {
      controllerRef.current.close();
    }
  };

  const resetChat = () => {
    setStream(undefined);
    setMessages([]);
    controllerRef.current = null;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Chat Stream Example</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={startChatStream} disabled={!!stream && !done}>
          Start Chat
        </button>
        <button
          onClick={endChat}
          disabled={!stream || done}
          style={{ marginLeft: "10px" }}
        >
          End Chat
        </button>
        <button onClick={resetChat} style={{ marginLeft: "10px" }}>
          Reset
        </button>
      </div>

      {stream && !done && (
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => sendMessage("Hello there!")}
            style={{ margin: "5px" }}
          >
            Send "Hello there!"
          </button>
          <button
            onClick={() => sendMessage("How are you?")}
            style={{ margin: "5px" }}
          >
            Send "How are you?"
          </button>
          <button
            onClick={() => sendMessage("Nice weather today!")}
            style={{ margin: "5px" }}
          >
            Send "Nice weather today!"
          </button>
        </div>
      )}

      <div>
        <h3>Chat Messages:</h3>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            minHeight: "200px",
            maxHeight: "400px",
            overflowY: "auto",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.length === 0 ? (
            <p style={{ color: "#666" }}>No messages yet...</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: "8px",
                  marginBottom: "8px",
                  backgroundColor: "white",
                  borderRadius: "4px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{msg.text}</div>
                <div style={{ fontSize: "0.8em", color: "#666" }}>
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: "10px", fontSize: "0.9em", color: "#666" }}>
          <p>
            <strong>Stream Status:</strong> {done ? "Ended" : "Active"}
          </p>
          <p>
            <strong>Total Messages:</strong> {messages.length}
          </p>
          {Boolean(error) && (
            <p style={{ color: "red" }}>
              <strong>Error:</strong> {String(error)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatStreamExample;
