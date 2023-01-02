import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("home", {
    title: "Websockets Chat",
    style: "/public/css/style.css",
    handler: "/public/js/ChatSocket.js",
    socketClient: "/socket.io/socket.io.js",
  });
});

export default router;
