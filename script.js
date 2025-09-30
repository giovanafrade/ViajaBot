document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const endpoint = "";
  const apiKey = "";
  const deployment = "";
  const apiVersion = "";
  const welcomeMessage = document.getElementById("welcome-message");

  // Função para adicionar mensagens ao chat
  function addMessage(text, sender) {
    const message = document.createElement("div");
    message.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    message.textContent = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Função para chamar a Azure OpenAI
  function callAzureOpenAI(userText) {
    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    const loadingMessage = document.createElement("div");
    loadingMessage.classList.add("message", "bot-message");
    loadingMessage.textContent = "Digitando...";
    chatBox.appendChild(loadingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    const config = {
      messages: [
        {
          role: "system",
          content: `You are a travel assistant specialized in helping users plan trips, solve travel-related problems, and offer recommendations. You can create personalized itineraries, suggest accommodations, give travel tips, and answer questions about destinations, transportation, and safety. Always be friendly, helpful, and concise in your responses.`
        },
        {
          role: "user",
          content: userText
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify(config)
    })
      .then((response) => response.json())
      .then((result) => {
        const botReply = result.choices[0].message.content;

        //Remove "Digitando..." e adiciona resposta real
        chatBox.removeChild(loadingMessage);
        addMessage(botReply, "bot");
        console.log(botReply);
      })
      .catch((error) => {
        chatBox.removeChild(loadingMessage);
        addMessage(`Erro: ${error.message}`, "bot");
        console.error(error);
      });
  }

  // Evento de envio do formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const userText = input.value.trim();

    if (userText !== "") {
      // Oculta a saudação e mostra o chat-box
      if (welcomeMessage) {
        welcomeMessage.style.display = "none";
      }

      // Exibe o chat-box apenas após o primeiro envio
      if (chatBox.style.display === "none") {
        chatBox.style.display = "flex";
      }
      
      addMessage(userText, "user");
      callAzureOpenAI(userText);
      input.value = "";
    }
  });
  //Função para ajustar altura do Chat-Box
  function ajustarAlturaChatBox() {
    const header = document.querySelector("header");
    const footer = document.querySelector(".footer");
    const chatBox = document.querySelector(".chat-box");

    const alturaHeader = header.offsetHeight;
    const alturaFooter = footer.offsetHeight;
    const alturaDisponivel = window.innerHeight - alturaHeader - alturaFooter;

    chatBox.style.maxHeight = `${alturaDisponivel}px`;
  }

  // Ajusta ao carregar
  window.addEventListener("load", ajustarAlturaChatBox);

  // Ajusta ao redimensionar a janela
  window.addEventListener("resize", ajustarAlturaChatBox);

  // Oculta o chat-box ao carregar a página
  chatBox.style.display = "none";
});
