const inputText = document.getElementById("input-text");

const sendButton = document.getElementById("send-button");

const userWrapper = document.getElementById("user");

const messagesBoard = document.getElementById("messages");

const socket = io();

let messages = [];

let userScreenName = "";

const formatMessageDateTime = (date) => {
  const options = {
    timeZone: "America/Mexico_City",
    dateStyle: "short",
    timeStyle: "short",
  };

  const displayFormat = new Intl.DateTimeFormat("es-MX", options).format(date);

  return displayFormat;
};

const getSenderMessageNode = (args) => {
  const containerFragment = document.createDocumentFragment();

  const messageItemDiv = document.createElement("div");
  messageItemDiv.classList.add("message-item");

  const messageHeader = document.createElement("div");
  messageHeader.classList.add("message-header");

  const messageSender = document.createElement("p");
  messageSender.classList.add("message-sender");
  messageSender.innerText = args.sender;
  messageHeader.appendChild(messageSender);

  const messageTimestamp = document.createElement("p");
  messageTimestamp.classList.add("message-timestamp");
  messageTimestamp.innerText = formatMessageDateTime(Date.parse(args.time));
  messageHeader.appendChild(messageTimestamp);

  messageItemDiv.appendChild(messageHeader);

  const messageText = document.createElement("p");
  messageText.classList.add("message-text");
  messageText.textContent = args.message.trim();
  messageItemDiv.appendChild(messageText);
  containerFragment.appendChild(messageItemDiv);

  return containerFragment;
};

sendButton.addEventListener("click", (event) => {
  const userMessage = inputText.value.trim();

  if (userMessage) {
    inputText.value = "";
    const messageTime = new Date(Date.now());

    socket.emit("message", {
      sender: userScreenName,
      message: userMessage,
      time: messageTime,
    });
  }
});

window.addEventListener("load", async (event) => {
  const swalOptions = {
    titleText: "¡Bienvenid@!",
    icon: "question",
    input: "text",
    inputLabel: "Nombre de usuari@",
    inputAttributes: {
      maxlength: 10,
      autocapitalize: "on",
      autocorrect: "on",
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
    inputValidator: (value) => !value && "Introduce un nombre de usuari@.",
  };

  const { value: userName } = await Swal.fire(swalOptions);

  if (userName) {
    userScreenName = userName;

    socket.emit("login", { userName: userScreenName });
  }
});

socket.on("welcome", (args) => {
  messages = args.messages ?? [];

  for (const message of messages) {
    messagesBoard.appendChild(getSenderMessageNode(message));
  }
});

socket.on("setUser", (newUser) => {
  userWrapper.innerText = `User: ${newUser.userName}`;
});

socket.on("echo", (args) => {
  messagesBoard.innerText = "";
  for (const message of args.messages) {
    messagesBoard.appendChild(getSenderMessageNode(message));
  }
});

socket.on("newUser", (args) => {
  const userName = args.userName;

  const swalOptions = {
    titleText: "Nuev@ usuari@",
    text: `Se unió ${userName} a la conversación.`,
    icon: "info",
    toast: true,
    position: "top-right",
    timer: 2700,
  };

  Swal.fire(swalOptions);
});
