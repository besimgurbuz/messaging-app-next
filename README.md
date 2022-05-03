## Messaging App

![Node.js CI](https://github.com/besimgurbuz/messaging-app-next/workflows/Node.js%20CI/badge.svg?branch=master)

A messaging App created with Node.js, MongoDB and Socket.io.

## Table of contents

- [Installation and First Run](#installation-and-first-run)
  - [With Docker](#with-docker)
  - [Without Docker](#without-docker)
- [API Documentation](#api-documentation)
- [Author](#author)

## Installation And First Run

### With Docker

Clone this(back-end) repository

```
git clone https://github.com/besimgurbuz/messaging-app-next.git
```

After cloning you should change `.env.sample` file name to `.env` file and paste correct secrets which I send you:

```
cd messaging-app-next
mv .env.sample .env
```

Now you are ready to clone front-end. Don't forget both of these repos should be in the same directory. So:

```
cd ..
```

Clone front-end [repository](https://github.com/besimgurbuz/messaging-app-ui)

```
git clone https://github.com/besimgurbuz/messaging-app-ui.git
```

### ⚠ Important ⚠

You should clone both of these repositories into the same directory.

#### Running

There are same `docker-compose.yml` files both of these repos. You can use any of these `docker-compose.yml` file for running. But first you should move `docker-compose.yml` file into the upper directory which includes both repositories.
```
$ mv ./messaging-app-next/docker-compose.yml ./docker-compose.yml
```

##### You should see this output when you command `ls`

```
$ ls
  messaging-app-next
  messaging-app-ui
  docker-compose.yml
```

In this directory run:

```
docker-compose up
```

After docker-compose install and run our both back-end and front-end now you can open [localhost:4200](http://localhost:4200).

Another **important note** I recommend you to open app in Chrome or close any cookie & local storage browser blocker.

### Without Docker

```
git clone https://github.com/besimgurbuz/messaging-app-next.git
```

Create `.env` file. And paste secrets which I send.

```
$ cd messaging-app-next
$ mv .env.sample .env
```

#### Installing dependecies and running.

```
# You should be in the messaging-app-next folder
$ pwd
  $YOUR_CLONE_DIRECTORY/messaging-app-next

# Installing dependencies
$ npm install

# Running
$ npm run start

# With nodemon
$ npm run dev
```

Now open another terminal and clone front-end [repository](https://github.com/besimgurbuz/messaging-app-ui).

```
$ git clone https://github.com/besimgurbuz/messaging-app-ui.git
```

#### Installing dependencies and running.

```
$ cd messaging-app-ui

$ npm install

$ npm run start

```

Now you are ready to open [app](http://localhost:4200). Horay!!

## API Documentation

Available endpoints in application

- GET `/`

  - Response <br>
    Endpoint responds with json
    ```json
    {
      "message": "APP is up and running!"
    }
    ```

- GET `/api/v1`

  - Response <br>
    Endpoint responds with json
    ```json
    {
      "message": "API - 🤘"
    }
    ```

- POST `/api/v1/login`

  - Expected Request Body <br>
    - _username_
    - _password_
    ```json
    {
      "username": "username",
      "password": "password"
    }
    ```
  - Response <br>
    Endpoint responds with in json format. If given crediantials are correct sends:
    - token: A token which created and assigned by JWT.
    - user: A object which contains user's username and email.
    ```json
    {
      "token": "JWT",
      "user": {
        "username": "username",
        "email": "example@email.com"
      }
    }
    ```
  - Errors <br>
    - `400` - Request body validations:
      - username and email should be given
    - `400` - There is no user with this username - \$username
    - `500` - Cannot logged in. Try again.

- POST `/api/v1/register`

  - Expected Request Body <br>
    - _username_
    - _password_
    - _email_
    ```json
    {
      "username": "username",
      "email": "example@email.com",
      "password": "password"
    }
    ```
  - Response <br>
    Endpoint responds with in json format. If given crediantials are correct creates new user and sends saved user data:
    ```json
    {
      "blockedList": [],
      "username": "username",
      "email": "example@email.com"
    }
    ```
  - Errors <br>
    - `400` - Request body validations:
      - username must be between 5 and 20 characters
      - email must be a valid email
      - password must be between 8 and 50 characters
    - `400` - There is already a registered user with this email - \$email
    - `400` - There is already a registered user with this username - \$username
    - `500` - User cannot be saved

- GET `/api/v1/chat`

  - Expected Headers<br>
    - 'Auth-Token': JWT_TOKEN
  - Response <br>
    Endpoint response in json format. If given token is found it sends user's chats data.
  - Errors <br>
    - `400` - Access Denied

- GET `/api/v1/chat/:id`

  - Expected Headers<br>
    - 'Auth-Token': JWT_TOKEN
  - Expected Parameters
    - id - Chat id
  - Response <br>
    Endpoint response in json format. If given token is found it sends user's chats data.
  - Errors <br>
    - `400` - Access Denied

- POST `/api/v1/chat`

  - Expected Request Body <br>
    - receiver
    ```json
    {
      "receiver": "receiver"
    }
    ```
  - Response <br>
    Endpoint responds with in json format. If the username is verified and the receiver is a user and doesn't already exist, they'll create a new chat.
    ```json
    {
      "subscribers": ["username", "receiver"],
      "lastActivity": "2020-09-22T13:28:29.043Z",
      "messages": []
    }
    ```
  - Errors <br>
    - `400` - Please enter a user who is not yourself
    - `400` - Unknown receiver
    - `400` - Sorry you cannot chat with this user, he/she blocked you..
    - `500` - Chat cannot be created'

- POST `/api/v1/block-user`
  - Expected Request Body <br>
    - block
    ```json
    {
      "block": "block_username"
    }
    ```
  - Response <br>
    Endpoint responds with in json format. If the username is verified and the block_usernmae is a user and doesn't already blocked, updates verified users `blockList`.
    ```json
    {
      "message": "User blocked."
    }
    ```
  - Errors <br>
    - `400` - The user to be blocked was not found on the system.
    - `400` - You already blocked this user
    - `400` - Body sould contain a username who is gonna be blocked.
    - `500` - User cannot be blocked.

## Author

besimgurbuz - [besimgurbuz.dev](http://besimgurbuz.dev)
