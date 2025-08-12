import React, { useState } from "react";
import { useReadableStream } from "../index";

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: string;
}

function FileUploadProgressExample() {
  const [stream, setStream] = useState<ReadableStream<UploadProgress>>();
  const [value, done, error] = useReadableStream(stream);

  const simulateFileUpload = () => {
    const fileSize = 10 * 1024 * 1024; // 10MB
    let uploaded = 0;
    const startTime = Date.now();

    const uploadStream = new ReadableStream<UploadProgress>({
      start(controller) {
        const interval = setInterval(() => {
          // Simulate upload chunks
          const chunkSize = Math.random() * 500000 + 100000; // 100KB - 600KB chunks
          uploaded += chunkSize;

          if (uploaded >= fileSize) {
            uploaded = fileSize;
            clearInterval(interval);
          }

          const elapsed = (Date.now() - startTime) / 1000;
          const speed = uploaded / elapsed;
          const percentage = Math.round((uploaded / fileSize) * 100);

          const progress: UploadProgress = {
            loaded: uploaded,
            total: fileSize,
            percentage,
            speed: formatBytes(speed) + "/s",
          };

          controller.enqueue(progress);

          if (uploaded >= fileSize) {
            setTimeout(() => controller.close(), 500);
          }
        }, 200);
      },
    });

    setStream(uploadStream);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const resetUpload = () => {
    setStream(undefined);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>File Upload Progress Example</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={simulateFileUpload} disabled={!!stream && !done}>
          Start Upload Simulation
        </button>
        <button onClick={resetUpload} style={{ marginLeft: "10px" }}>
          Reset
        </button>
      </div>

      {value && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h3>Upload Progress</h3>

          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                width: "100%",
                backgroundColor: "#e9ecef",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${value.percentage}%`,
                  height: "20px",
                  backgroundColor:
                    value.percentage === 100 ? "#28a745" : "#007bff",
                  transition: "width 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                {value.percentage}%
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <strong>Uploaded:</strong> {formatBytes(value.loaded)}
            </div>
            <div>
              <strong>Total:</strong> {formatBytes(value.total)}
            </div>
            <div>
              <strong>Speed:</strong> {value.speed}
            </div>
            <div>
              <strong>Status:</strong> {done ? "Complete" : "Uploading..."}
            </div>
          </div>

          {done && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "4px",
                color: "#155724",
              }}
            >
              ✅ Upload completed successfully!
            </div>
          )}
        </div>
      )}

      {Boolean(error) && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
            color: "#721c24",
          }}
        >
          ❌ Upload failed: {String(error)}
        </div>
      )}
    </div>
  );
}

export default FileUploadProgressExample;
