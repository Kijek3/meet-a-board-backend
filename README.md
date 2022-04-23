# Backend for Meet a Board project
### How to run server locally
- Be sure that you have `npm` and `Node.js` installed on your machine.
- Open project root directory
- Install packages
```
npm i
```
- Create `.env` file with your variables
  - `API_PORT` - Server port, e.g. 8000
  - `MONGO_URI` - MongoDB URI (you can get it from MongoDB Atlas)
  - `TOKEN_KEY` - Random string for secret key JWT auth 
- Run server locally
```
npm run start-dev
```
