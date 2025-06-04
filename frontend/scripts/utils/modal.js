export const createModal = ({
  text,
  closeText = "Cerrar",
  sendText = "Enviar",
}) => {
  const modal = document.createElement("dialog");
  modal.classList.add("modal");
  modal.setAttribute("closedby", "any");
  document.body.appendChild(modal);

  const textElement = document.createElement("p");
  textElement.textContent = text;

  const closeButton = document.createElement("input");
  closeButton.type = "button";
  closeButton.value = closeText;
  closeButton.classList.add("button", "--red");

  const sendButton = document.createElement("input");
  sendButton.type = "button";
  sendButton.value = sendText;
  sendButton.classList.add("button", "--yellow");

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("modal-buttons");
  buttonContainer.appendChild(closeButton);
  buttonContainer.appendChild(sendButton);

  modal.appendChild(textElement);
  modal.appendChild(buttonContainer);

  return { modal, closeButton, sendButton };
};
