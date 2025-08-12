# useReadableStream Examples

This directory contains interactive examples demonstrating the `useReadableStream` React hook.

## Running the Examples

To view the interactive examples in your browser:

```bash
cd examples
bun server.ts
```

Then open http://localhost:3000 in your browser.

## Example Files

### 1. Basic Usage (`basic-usage.tsx`)

Demonstrates the fundamental usage of the `useReadableStream` hook with a simple text stream that emits messages over time.

### 2. Fetch Stream (`fetch-stream.tsx`)

Shows how to use the hook with data fetching scenarios, simulating API responses streamed over time.

### 3. Chat Stream (`chat-stream.tsx`)

Interactive chat example where you can send messages through a ReadableStream and see them appear in real-time.

### 4. File Upload Progress (`file-upload-progress.tsx`)

Simulates file upload progress with a visual progress bar, demonstrating how to track upload status and speed.

### 5. Demo Server (`server.ts`)

A Bun server that serves the interactive examples with hot module reloading enabled.

## Features Demonstrated

- ✅ Basic stream consumption
- ✅ Error handling
- ✅ Stream completion detection
- ✅ Real-time UI updates
- ✅ Progress tracking
- ✅ Interactive stream control
- ✅ Multiple data types (strings, objects, progress data)

## API Reference

The `useReadableStream` hook returns a tuple:

```typescript
const [value, done, error] = useReadableStream(stream, defaultValue);
```

- `value`: The latest value emitted by the stream
- `done`: Boolean indicating if the stream has completed
- `error`: Any error that occurred during stream processing
