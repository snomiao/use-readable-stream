import React from "react";
import {
  useReadableStream,
  ReadableStreamComponent,
} from "./use-readable-stream";

function createTextStream(
  text: string,
  delay: number = 100,
): ReadableStream<string> {
  const chunks = text.split(" ");
  let index = 0;

  return new ReadableStream({
    start(controller) {
      const sendNextChunk = () => {
        if (index < chunks.length) {
          controller.enqueue(chunks[index]);
          index++;
          setTimeout(sendNextChunk, delay);
        } else {
          controller.close();
        }
      };
      sendNextChunk();
    },
  });
}

export function StreamExample() {
  const [stream, setStream] = React.useState<ReadableStream<string> | null>(
    null,
  );
  const [text, setText] = React.useState("");

  const startStream = () => {
    setText("");
    const newStream = createTextStream(
      "Hello world! This is a streaming text example. Each word appears with a delay.",
    );
    setStream(newStream);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>ReadableStream Component Example</h2>

      <button onClick={startStream} style={{ marginBottom: "20px" }}>
        Start Stream
      </button>

      <ReadableStreamComponent
        stream={stream}
        onChunk={(word) => {
          setText((prev) => (prev ? `${prev} ${word}` : word));
          console.log("Received chunk:", word);
        }}
        onDone={() => console.log("Stream finished")}
        onError={(error) => console.error("Stream error:", error)}
      >
        {({ value, done, error }) => (
          <div>
            <div
              style={{
                minHeight: "60px",
                padding: "10px",
                border: "1px solid #ccc",
              }}
            >
              {text && <div style={{ color: "#333" }}>{text}</div>}
              {value && !done && (
                <div style={{ color: "#666", fontStyle: "italic" }}>
                  Latest: {value}
                </div>
              )}
              {!done && !error && !value && (
                <div style={{ color: "#666", fontStyle: "italic" }}>
                  Waiting for stream...
                </div>
              )}
            </div>
            {error && (
              <div style={{ color: "red", marginTop: "10px" }}>
                Error: {error.message}
              </div>
            )}
            {done && (
              <div style={{ color: "green", marginTop: "10px" }}>
                ✓ Stream completed
              </div>
            )}
          </div>
        )}
      </ReadableStreamComponent>
    </div>
  );
}

export function HookExample() {
  const [stream, setStream] = React.useState<ReadableStream<number> | null>(
    null,
  );
  const { value, done, error } = useReadableStream(stream);

  const startNumberStream = () => {
    let count = 0;
    const numberStream = new ReadableStream({
      start(controller) {
        const interval = setInterval(() => {
          if (count < 10) {
            controller.enqueue(count++);
          } else {
            clearInterval(interval);
            controller.close();
          }
        }, 500);
      },
    });
    setStream(numberStream);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>useReadableStream Hook Example</h2>

      <button onClick={startNumberStream} style={{ marginBottom: "20px" }}>
        Start Number Stream
      </button>

      <div>
        <p>Current value: {value !== null ? value : "None"}</p>
        {!done && !error && <p style={{ color: "#666" }}>Streaming...</p>}
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
        {done && <p style={{ color: "green" }}>Stream completed!</p>}
      </div>
    </div>
  );
}
