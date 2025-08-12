import React, { useState } from "react";
import { useReadableStream } from "../index";

function FetchStreamExample() {
  const [stream, setStream] = useState<ReadableStream<string>>();
  const [value, done, error] = useReadableStream(stream);

  const startFetchStream = async () => {
    try {
      // Create a stream that simulates fetching data
      const fetchStream = new ReadableStream({
        async start(controller) {
          // Simulate API responses
          const responses = [
            { id: 1, name: "Alice", status: "online" },
            { id: 2, name: "Bob", status: "busy" },
            { id: 3, name: "Charlie", status: "offline" },
          ];

          for (const response of responses) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            controller.enqueue(JSON.stringify(response, null, 2));
          }

          controller.close();
        },
      });

      setStream(fetchStream);
    } catch (err) {
      console.error("Error creating stream:", err);
    }
  };

  const resetStream = () => {
    setStream(undefined);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Fetch Stream Example</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={startFetchStream} disabled={!!stream && !done}>
          Start Fetch Stream
        </button>
        <button onClick={resetStream} style={{ marginLeft: "10px" }}>
          Reset
        </button>
      </div>

      <div>
        <h3>Stream Status:</h3>
        <p>
          <strong>Done:</strong> {done ? "Yes" : "No"}
        </p>
        <p>
          <strong>Error:</strong> {error ? String(error) : "None"}
        </p>

        <h3>Latest Data:</h3>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            minHeight: "100px",
          }}
        >
          {value || "Waiting for data..."}
        </pre>
      </div>
    </div>
  );
}

export default FetchStreamExample;
