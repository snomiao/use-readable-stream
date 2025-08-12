import { test, expect } from "bun:test";
import { useReadableStream } from "./use-readable-stream";

function createTestStream<T>(
  items: T[],
  delay: number = 10,
): ReadableStream<T> {
  let index = 0;
  return new ReadableStream({
    start(controller) {
      const sendNext = () => {
        if (index < items.length) {
          controller.enqueue(items[index]);
          index++;
          setTimeout(sendNext, delay);
        } else {
          controller.close();
        }
      };
      sendNext();
    },
  });
}

test("ReadableStream processes values correctly", async () => {
  const testItems = ["apple", "banana", "cherry"];
  const stream = createTestStream(testItems);

  const reader = stream.getReader();
  const results: string[] = [];
  let isDone = false;

  while (!isDone) {
    const { done, value } = await reader.read();
    if (done) {
      isDone = true;
    } else {
      results.push(value);
    }
  }

  expect(results).toEqual(testItems);
  expect(isDone).toBe(true);
});

test("ReadableStream handles errors correctly", async () => {
  const errorStream = new ReadableStream({
    start(controller) {
      setTimeout(() => {
        controller.error(new Error("Test error"));
      }, 10);
    },
  });

  const reader = errorStream.getReader();
  let caughtError: any = null;

  try {
    await reader.read();
  } catch (err) {
    caughtError = err;
  }

  expect(caughtError).toBeInstanceOf(Error);
  expect(caughtError.message).toBe("Test error");
});

test("useReadableStream hook exports correctly", () => {
  expect(typeof useReadableStream).toBe("function");
});

test("useReadableStream function signature is correct", () => {
  expect(useReadableStream).toBeDefined();
  expect(typeof useReadableStream).toBe("function");
  expect(useReadableStream.length).toBe(2); // Expects 2 parameters
});
