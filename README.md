# useReadableStream

A React hook for consuming ReadableStreams with real-time updates, error handling, and completion detection.

## Installation

```bash
bun install use-readable-stream
```

## Usage

```tsx
import { useReadableStream } from 'use-readable-stream';

function StreamingComponent() {
  const stream = new ReadableStream({
    start(controller) {
      let count = 0;
      const interval = setInterval(() => {
        if (count < 5) {
          controller.enqueue(`Message ${count++}`);
        } else {
          controller.close();
          clearInterval(interval);
        }
      }, 1000);
    }
  });

  const [value, done, error] = useReadableStream(stream, 'Loading...');

  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <p>{value}</p>
      {done && <p>Stream completed!</p>}
    </div>
  );
}
```

## API

### `useReadableStream<T>(stream?, defaultValue?)`

**Parameters:**
- `stream?: ReadableStream<T>` - The readable stream to consume
- `defaultValue?: T` - Initial value before stream starts emitting

**Returns:**
```typescript
[value: T | undefined, done: boolean, error: unknown]
```

- `value` - Latest value emitted by the stream
- `done` - `true` when stream has completed
- `error` - Any error that occurred during processing

## Features

- ✅ Real-time stream consumption
- ✅ Automatic cleanup on unmount
- ✅ Error handling
- ✅ Completion detection
- ✅ TypeScript support
- ✅ Works with any ReadableStream

## Examples

Interactive examples are available in the `examples/` directory:

```bash
cd examples
bun server.ts
```

Then visit http://localhost:3000 to see:

- **Basic Usage** - Simple text streaming
- **Fetch Stream** - API response streaming
- **Chat Stream** - Interactive messaging
- **File Upload** - Progress tracking

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build for production
bun run build

# Run examples server
cd examples && bun server.ts
```

## License

MIT
