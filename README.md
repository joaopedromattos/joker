<!-- Description: Scientific Initiation project of HCI (Human-Computer Interface) and IA (Information Architecture) about the relationship of users with software privacy policies -->

# Joker
![MIT License Badge](https://img.shields.io/github/license/joaopedromattos/joker?style=for-the-badge)

A React app based on [React Kanban](https://github.com/markusenglund/react-kanban) to make use of Card Sorting technique for a Scientific Iniciation project about the relationship of users with software privacy policies.

## Requirements
* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)
* [Firebase free account](https://firebase.google.com/?hl=pt-br)

## Running the app:
1. On the root folder, create a `.env` file and put your credentials in It as explained in the section below.
2. On the `apiResearcher` folder, create another `.env` and put your credentials in It as explained below.
3. On root folder, you should run `npm install`.
4. Access /apiResearcher folder, right below root folder, and run `npm install`.
5. Still on /apiResearcher folder, but on another terminal, `run mongod` to start a local database server.
6. On the first temrinal, run `npm run api` to connect our api to the database server.
7. Finally, open two other terminals, both on the root folder. In either one of them, you should run `npm run build` and, after receiving a success message, run on the other one `npm run serve` to start our server side rendering and last part of the application.

## src .env
Inside the `.env` file, paste the text below, adding your keys to the corresponding atributes

```
# Admin api
REACT_APP_ADMIN_API=http://localhost:3000

# Home URL
REACT_APP_HOME_URL=http://localhost:1337

# Firebase api configs
REACT_APP_FIREBASE_API_KEY="YOUR FIREBASE API KEY"
REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR FIREBASE AUTH DOMAIN"
REACT_APP_FIREBASE_DATABASE_URL="YOUR FIREBASE DATA URL"
REACT_APP_FIREBASE_PROJECT_ID="YOUR FIREBASE PROJECT ID"
REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR FIREBASE STORAGE BUCKET"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR FIREBASE MESSAGING SENDER ID"
```

## apiResearcher .env
```
RESULTS_HOST_ADDRESS=http://localhost:3000/
```
