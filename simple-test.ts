import { test, expect } from "bun:test";

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

test("ReadableStream works with basic functionality", async () => {
  const testItems = ["apple", "banana", "cherry"];
  const stream = createTestStream(testItems);

  const reader = stream.getReader();
  const results: string[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    results.push(value);
  }

  expect(results).toEqual(testItems);
});

test("Stream error handling works", async () => {
  const errorStream = new ReadableStream({
    start(controller) {
      setTimeout(() => {
        controller.error(new Error("Test error"));
      }, 10);
    },
  });

  const reader = errorStream.getReader();
  let caughtError: Error | null = null;

  try {
    await reader.read();
  } catch (error) {
    caughtError = error as Error;
  }

  expect(caughtError?.message).toBe("Test error");
});
