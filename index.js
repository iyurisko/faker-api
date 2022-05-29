const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const {
  postController,
  deleteController,
  getAllController,
  updateController,
  getByIdController,
} = require('./controller.js')
const { loginController, registerController, verifyToken } = require('./auth/controller.js')

const app = express();
const port = 7777;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/', (req, res) => res.send('hello'));

/* Auth Routing */
app.post('/login', (req, res) => loginController(req, res));
app.post('/register', (req, res) => registerController(req, res));
/* Auth Routing */

/* Dynamic Routing */
fs.readdir(path.join(__dirname, 'db'), (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } else {
    files.forEach((file) => {
      const route = `/${file.replace(".json", "")}`;

      app.get(route, (req, res) => getAllController(req, res, file));
      app.get(`${route}/:id`, (req, res) => getByIdController(req, res, file));
      app.post(route, (req, res) => postController(req, res, file));
      app.put(`${route}/:id`, (req, res) => updateController(req, res, file));
      app.delete(`${route}/:id`, (req, res) => deleteController(req, res, file));
    });
  }
});
/* Dynamic Routing */

app.listen(port, () => console.log(`running on port:${port}`));