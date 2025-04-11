const container = require("./Infrastructures/container");
const createServer = require("./Infrastructures/http/createServer");


const start = async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`HTTP server running at ${server.info.uri}`);
};

start();