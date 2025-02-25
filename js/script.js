// Пример данных пользователей
const users = [
    { name: "Иван Иванов", id: 1 },
    { name: "Мария Петрова", id: 2 },
    { name: "Алексей Смирнов", id: 3 },
    { name: "Ольга Кузнецова", id: 4 },
    { name: "Дмитрий Васильев", id: 5 },
];

// Текущий выбранный пользователь
let selectedUser = null;

// Сообщения (в реальном приложении они будут храниться на сервере)
const messages = {};

// Функция для отображения списка пользователей
function renderUserList(filter = "") {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";

    users
        .filter(user => user.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(user => {
            const li = document.createElement("li");
            li.textContent = user.name;
            li.addEventListener("click", () => selectUser(user));
            userList.appendChild(li);
        });
}

// Функция для выбора пользователя
function selectUser(user) {
    selectedUser = user;
    document.getElementById("selectedUserName").textContent = user.name;

    // Активируем поле ввода и кнопку отправки
    document.getElementById("messageInput").disabled = false;
    document.getElementById("sendButton").disabled = false;

    document.getElementById('chat-input').style.opacity = 1;

    document.getElementById('Hello_Header').style.opacity = 0;
    document.getElementById('Hello_Header').style.height = 0;

    document.getElementById('chatWindow').style.opacity = 1;
    document.getElementById('chatWindow').style.height = "82vh";

    // Очищаем окно чата и отображаем сообщения
    const chatWindow = document.getElementById("chatWindow");
    chatWindow.innerHTML = "";

    if (!messages[user.id]) {
        messages[user.id] = [];
    }

    messages[user.id].forEach(message => {
        const messageElement = document.createElement("div");
        messageElement.className = `message-${message.sender === "user" ? "user" : "other"}`;
        messageElement.textContent = message.text;
        chatWindow.appendChild(messageElement);
    });

    // Прокручиваем окно чата вниз
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Функция для отправки сообщения
function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    if (message && selectedUser) {
        if (!messages[selectedUser.id]) {
            messages[selectedUser.id] = [];
        }

        // Добавляем сообщение в список
        messages[selectedUser.id].push({ text: message, sender: "user" });

        // Отображаем сообщение в окне чата
        const chatWindow = document.getElementById("chatWindow");
        const messageElement = document.createElement("div");
        messageElement.className = "message-user";
        messageElement.textContent = message;
        chatWindow.appendChild(messageElement);

        // Очищаем поле ввода
        messageInput.value = "";

        // Прокручиваем окно чата вниз
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}

// Поиск пользователей
document.getElementById("searchInput").addEventListener("input", (e) => {
    renderUserList(e.target.value);
});

// Отправка сообщения по нажатию кнопки
document.getElementById("sendButton").addEventListener("click", sendMessage);

// Отправка сообщения по нажатию Enter
document.getElementById("messageInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// Инициализация списка пользователей
renderUserList();