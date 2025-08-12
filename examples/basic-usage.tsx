import React, { useState } from "react";
import { useReadableStream } from "../index";

function BasicUsageExample() {
  const [stream, setStream] = useState<ReadableStream<string>>();
  const [value, done, error] = useReadableStream(stream, "No data yet");

  const createTextStream = () => {
    const textStream = new ReadableStream({
      start(controller) {
        const messages = ["Hello", "World", "from", "ReadableStream"];
        let index = 0;

        const interval = setInterval(() => {
          if (index < messages.length) {
            controller.enqueue(messages[index]);
            index++;
          } else {
            controller.close();
            clearInterval(interval);
          }
        }, 1000);
      },
    });

    setStream(textStream);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Basic useReadableStream Example</h2>

      <button onClick={createTextStream} disabled={!!stream && !done}>
        Start Stream
      </button>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Current Value:</strong> {value}
        </p>
        <p>
          <strong>Stream Done:</strong> {done ? "Yes" : "No"}
        </p>
        <p>
          <strong>Error:</strong> {error ? String(error) : "None"}
        </p>
      </div>
    </div>
  );
}

export default BasicUsageExample;
