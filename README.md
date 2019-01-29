<!-- Description: Scientific Initiation project of HCI (Human-Computer Interface) and IA (Information Architecture) about the relationship of users with software privacy policies -->

# Joker

A React app based on [React Kanban](https://github.com/markusenglund/react-kanban) to make use of Card Sorting technique for a Scientific Iniciation project about the relationship of users with software privacy policies.


## Running the app:
1. On root folder, you should run `npm install`.
2. Access /apiResearcher folder, right below root folder, and run `npm install`.
3. Still on /apiResearcher folder, but on another terminal, `run mongod` to start a local database server.
4. On the first temrinal, run `npm run api` to connect our api to the database server.
5. Finally, open two other terminals, both on the root folder. In either one of them, you should run `npm run build` and, after receiving a success message, run on the other one `npm run serve` to start our server side rendering and last part of the application. 