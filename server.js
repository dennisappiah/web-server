const http = require("http");
const fs = require("fs/promises");

const server = http.createServer();

server.on("request", async (request, response) => {
  // home route
  if (request.url === "/" && request.method === "GET") {
    response.setHeader("Content-Type", "text/html");

    const fileHandle = await fs.open("./public/index.html", "r");
    const fileReadStream = fileHandle.createReadStream(); // stream to read from

    // read filestream and write response data to the client
    fileReadStream.on("data", (chunk) => {
      response.write(chunk);
    });

    fileReadStream.on("end", () => {
      response.end();
    });

    fileReadStream.on("error", (err) => {
      response.statusCode = 500;
      response.end("Internal Server Error");
    });
  }

  // css route
  if (request.url === "/styles.css" && request.method === "GET") {
    response.setHeader("Content-Type", "text/css");
    const fileHandle = await fs.open("./public/styles.css", "r");

    const fileReadStream = fileHandle.createReadStream();

    // read from fileReadstream and write to response writable
    fileReadStream.pipe(response);
  }

  if (request.url === "/script.js" && request.method === "GET") {
    response.setHeader("Content-Type", "text/javascript");

    const fileHandle = await fs.open("./public/script.js", "r");
    const fileReadStream = fileHandle.createReadStream();

    fileReadStream.pipe(response);
  }

  // login route
  if (request.url === "/login" && request.method === "POST") {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = 200;

    const res_body = {
      message: "Logging you in",
    };

    response.write(JSON.stringify(res_body));
  }

  // upload route
  if (request.url === "/upload" && request.method === "POST") {
    response.setHeader("Content-Type", "application/json");

    const fileHandle = await fs.open("./storage/wallpaper.jpeg", "w");
    const fileWriteStream = fileHandle.createWriteStream(); //stream to write to

    // read from request and write to file writable stream
    request.pipe(fileWriteStream);

    request.on("end", () => {
      response.end(
        JSON.stringify({ message: "File was uploaded successfully" })
      );
    });
  }
});

server.listen(8050, () => {
  console.log("Web server is live at http://localhost:8050");
});
