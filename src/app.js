import express from "express";
import { engine } from "express-handlebars";
import ChatRouter from "./routes/chat.routes.js";

const staticOptions = {
  dotfiles: "deny",
};

const app = express();
app.use("/public", express.static("static", staticOptions));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "src/views");

app.use("/chat/", ChatRouter);

export const PORT = 8080;

export default app;
