import demoHtml from "./demo.html";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": demoHtml,
    "/examples": demoHtml,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(
  `🌊 useReadableStream examples server running at http://localhost:${server.port}`,
);
console.log("Visit http://localhost:3000 to see the interactive examples");
