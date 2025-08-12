import React from "react";
import { createRoot } from "react-dom/client";
import BasicUsageExample from "./basic-usage";
import FetchStreamExample from "./fetch-stream";
import ChatStreamExample from "./chat-stream";
import FileUploadProgressExample from "./file-upload-progress";

function Demo() {
  return (
    <div>
      {/* Basic Usage Example */}
      <div id="basic-content">
        <BasicUsageExample />
      </div>

      {/* Fetch Stream Example */}
      <div id="fetch-content">
        <FetchStreamExample />
      </div>

      {/* Chat Stream Example */}
      <div id="chat-content">
        <ChatStreamExample />
      </div>

      {/* Upload Progress Example */}
      <div id="upload-content">
        <FileUploadProgressExample />
      </div>
    </div>
  );
}

// Mount each example to its respective container
const basicRoot = createRoot(document.getElementById("basic-content")!);
basicRoot.render(<BasicUsageExample />);

const fetchRoot = createRoot(document.getElementById("fetch-content")!);
fetchRoot.render(<FetchStreamExample />);

const chatRoot = createRoot(document.getElementById("chat-content")!);
chatRoot.render(<ChatStreamExample />);

const uploadRoot = createRoot(document.getElementById("upload-content")!);
uploadRoot.render(<FileUploadProgressExample />);
