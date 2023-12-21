import express from "express";
import { HydratedText } from "./public/component.js";
import fs from "node:fs/promises";
import { h } from "preact";
import renderToString from "preact-render-to-string";

const app = express();

app.use(
  "/public",
  express.static("./public", {
    index: false,
  })
);

app.use("/", async (req, res, next) => {
  const str = renderToString(h(HydratedText, { value: "from ssr" }));
  console.log({str});
  const html = await fs.readFile("./public/index.html", "utf8");
  return res.send(html.replace("<!-- app-populate -->", str));
});

app.listen(3000, () => {
  console.log("listening");
});
