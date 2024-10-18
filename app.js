// DOM Elements
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');
const nameSection = document.getElementById('name-section');
const chatInterface = document.getElementById('chat-interface');
const nameInput = document.getElementById('name-input');
const startChatBtn = document.getElementById('start-chat-btn');

// Variable to store the user's name
let userName = null;

// Event listener for starting the chat when clicking button
startChatBtn.addEventListener('click', startChat);

// Event listener for starting the chat when pressing "Enter" in name input
nameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        startChat();
    }
});

// Event listener for sending a message when clicking button
sendBtn.addEventListener('click', sendMessage);

// Event listener for sending a message when pressing "Enter" in message input
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Event listener for clearing the chat
clearChatBtn.addEventListener('click', clearChat);

// Load existing messages from localStorage on page load
window.addEventListener('load', loadMessages);

// Listen for storage changes (for cross-tab communication)
window.addEventListener('storage', function(e) {
    if (e.key === 'chatMessages') {
        loadMessages();  // Reload chat when localStorage is updated
    }
});

function startChat() {
    let inputName = nameInput.value.trim();
    
    if (inputName !== '') {
        userName = inputName;  // Set userName directly from input
        localStorage.setItem('userName', userName);  // Store the user’s name in localStorage
        // Hide the name section and show the chat interface
        nameSection.style.display = 'none';
        chatInterface.style.display = 'block';
        loadMessages();  // Load existing messages
    } else {
        alert('Please enter your name!');
    }
}

function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (messageText !== '') {
        // Create a new message object, including the user's name
        const newMessage = {
            userName: userName,
            text: messageText,
            timestamp: new Date().getTime()
        };
        
        // Save message to localStorage
        saveMessage(newMessage);
        
        // Clear the input field
        messageInput.value = '';
    }
}

function saveMessage(message) {
    let messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    messages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    // Trigger the storage event manually for real-time updates
    localStorage.setItem('updateChat', Date.now()); // Dummy key to trigger the storage event
    loadMessages();  // Reload the messages immediately for the current tab
}

function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    
    // Clear the chat box
    chatBox.innerHTML = '';
    
    // Append each message to the chat box
    messages.forEach((message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        
        // Display the user's name with the message
        if (message.userName === userName) {
            messageElement.classList.add('sent');  // Align right for this user's messages
            messageElement.innerHTML = `<strong>You:</strong> ${message.text}`;
        } else {
            messageElement.classList.add('received');  // Align left for other users' messages
            messageElement.innerHTML = `<strong>${message.userName}:</strong> ${message.text}`;
        }
        
        chatBox.appendChild(messageElement);
    });
    
    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChat() {
    localStorage.removeItem('chatMessages');  // Remove all chat messages from localStorage
    localStorage.setItem('updateChat', Date.now()); // Dummy key to trigger the storage event across tabs
    loadMessages();  // Reload chat (it will be empty now)
}
