<p align="center">
  <img src="https://github.com/FravonDev/social-media/assets/62142146/46b1c3c0-e413-4e49-99ed-9f27266fb336" width="200" alt="Social Media Logo" />
</p>
<br>
<p align="center">
<a href="./LICENSE" target="_blank"><img src="https://img.shields.io/badge/license-MIT-success" alt="Mit License" /></a>
<img src="https://img.shields.io/badge/status-building-blueviolet" alt="Status Building" />
<img src="https://img.shields.io/badge/npm-v9.6.7-blue.svg" alt="NPM Version 9.6.7" />
</p>

# Social Media
Welcome to the Social Media project! This is a custom social media platform developed using [Node](https://nodejs.org/) and [Nest](https://nestjs.com). this platform aims to provide a complete social media experience with features such as user registration, authentication, image hosting, real-time chat using WebSockets, and much more.

##  Features 

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

##  WebSockets

### Chat 

- **Authentication:** Clients must send a valid `access_token` code in the header to connect to the server via WebSockets.

### Events:

- **getPreviousMessages (listen):** Clients should listen for this event after establishing the connection. The server will send the previous messages.

- **sendMessage (emit):** Clients can send messages using this event. Messages should have the following properties:

  - **`recipientId`**: ID of the user who will receive the message.
  - **`text`**: Content of the message.

  Example payload:

  ```json
  {
    "recipientId": "12345",
    "text": "Hello, Johnny! 👋"
  }
  ```

- **getMessage (listen):** The recipient of the message should listen to this event to receive the messages sent to them.

## Stay Connected

- Linkedin: [Flávio Adriano](https://www.linkedin.com/in/flavioadriano/)
- GitHub Repository: [FravonDev](https://github.com/FravonDev)

## License
This project is licensed under the MIT License. See the [LICENCE](./LICENSE) file for more information. 📜 
