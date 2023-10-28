<p align="center">
  <img src="https://raw.githubusercontent.com/FravonDev/social-media-frontend/develop/src/assets/logo.png" width="200" alt="Social Media Logo" />
</p>
<br>
<p align="center">
<a href="./LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-MIT-success" alt="Mit License" /></a>
<img src="https://img.shields.io/badge/status-building-blueviolet" alt="Status Building" />
<img src="https://img.shields.io/badge/npm-v9.6.7-blue.svg" alt="NPM Version 9.6.7" />
</p>

# Social Media

Welcome to the Social Media project! This is a custom social media platform developed using [Node](https://nodejs.org/) and [Nest](https://nestjs.com). this platform aims to provide a complete social media experience with features such as user registration, authentication, image hosting, real-time chat using WebSockets, and much more.

## Features

- User registration and authentication 🔐
- Image hosting system for users to share photos 📷
- Real-time chat functionality using WebSockets 💬
- Follow and Unfollow other users to stay updated with their activities 👥

## Installation

To get started with the project, follow these steps:

```bash
#clone the project
$ git clone https://github.com/FravonDev/social-media.git

#install packages
$ npm install

```

## Running the App

#### Development mode

To run the project in development mode, use the following command:

```bash
# Run migrations
$ npx prisma migrate dev

#run server
$ npm run start:dev
```

### Technologies Used

The Social Media project utilizes the following technologies:

- Node.js - JavaScript runtime
- Nest - Progressive Node.js framework
- Swagger - API documentation
- WebSockets - Real-time communication protocol

## API Documentation

To explore the API endpoints and their documentation, you should run the server and visit the [Swagger documentation](http://localhost:3000/api#/api-docs) page.

## WebSockets

### Chat

- **Authentication:** Clients must send a valid `access_token` code in the header to connect to the server via WebSockets.

## Events

#### getPreviewMessages (listen)

**Event:** `getPreviewMessages`

**Description:** Clients should listen for this event after establishing the connection. The server will send the last message of each chat as a preview.

**Usage:**

```javascript
socket.on('getPreviewMessages', (previewMessages) => {
  console.log(previewMessages);
});
```

<br>

#### sendMessage (emit)

**Event:** `sendMessage`

**Description:** Clients can use this event to send messages to other users.

**Usage:**

```javascript
// Emit the sendMessage event
socket.emit('sendMessage', {
  recipientId: 'd4c1a2b3c4d5e',
  text: 'Hello, Johnny 👋',
});
```

<br>

#### getMessage (listen)

**Event:** `getMessage`

**Description:** The recipient of the message should listen for this event to receive messages sent to them.

**Usage:**

```javascript
// Listen for the getMessage event
socket.on('getMessage', (message) => {
  // Handle received message
  console.log(message);
});
```

<br>

#### getChatMessages (emit)

**Event:** `getChatMessages`

**Description:** Clients can emit this event to request messages from a specific chat with another user.

**Usage:**

```javascript
// Emit the getChatMessages event
socket.emit('getChatMessages', {
  recipientId: 'f85b935e-87d0-4b4b-86b1-b51084454f6a',
  offset: 0,
  limit: 20,
});
```

<br>

#### receiveChatMessages (listen)

**Event:** `receiveChatMessages`

**Description:** Listen for this event to receive messages from a specific chat.

**Usage:**

```javascript
// Listen for the receiveChatMessages event
socket.on('receiveChatMessages', (chatMessages) => {
  // Handle received chatMessages
  console.log(chatMessages);
});
```

<br>

#### typing (emit)

**Event:** `typing`

**Description:** Emit this event to notify other users that you are currently typing a message.

**Usage:**

```javascript
// Emit the typing event
socket.emit('typing', { recipientId: 'f85b935e-87d0-4b4b-86b1-b51084454f6a' });
```

<br>

#### isTyping (listen)

**Event:** `isTyping`

**Description:** Listen for this event to receive information about whether someone is currently typing a message in your chat.

**Usage:**

```javascript
// Listen for the isTyping event
socket.on('isTyping', (isTyping) => {
  // Handle isTyping
  console.log(isTyping);
});
```

## Stay Connected

- Linkedin: [Flávio Adriano](https://www.linkedin.com/in/flavioadriano/)
- GitHub Repository: [FravonDev](https://github.com/FravonDev)

## License

This project is licensed under the MIT License. See the [LICENCE](./LICENSE) file for more information. 📜
