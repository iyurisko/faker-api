const { randomId, apiError } = require('../helper.js');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//bad idea
const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}"

module.exports = {
  login: async (req, res) => {
    try {

      if (!req.body.email || !req.body.password) {
        return apiError({ req, res, err: "email or password is missing!" })
      }

      let user = JSON.parse(fs.readFileSync(`./auth/user.json`));
      user = user.find(v => v.email === req.body.email)
      const succesHash = await bcrypt.compare(req.body.password, user.password)

      if (!succesHash) {
        return apiError({ req, res, err: "password/username invalid" })
      }

      const payLoad = { "username": user.email.split('@')[0] }

      const token = jwt.sign(payLoad, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1d' })
      const users = JSON.parse(fs.readFileSync(`./auth/user.json`));
      const idx = users.findIndex((user) => user.email === req.body.email);

      users[idx] = { ...users[idx], token };
      fs.writeFileSync(`./auth/user.json`, JSON.stringify(users, null, 2), 'utf8')

      logger({ type: 'success', msg: `POST /login -->  success` });
      res.status(200).json({ status: "success", token })
    } catch (err) {
      logger({ type: 'err', msg: `POST /login --> ${err}` });
      apiError({ req, res, err: 'service error' })
    }
  },
  register: async (req, res) => {
    try {
      const users = JSON.parse(fs.readFileSync(`./auth/user.json`));
      const user = users.find(v => v.username === req.body.username);

      if (user) {
        logger({ type: 'err', msg: `POST /register --> already registered` });
        return res.status(409).json({ message: "already registered" });
      };

      const hash = await bcrypt.hash(req.body.password, 10)

      const newUser = { id: randomId(), ...req.body, password: hash };
      users.push(newUser);
      fs.writeFileSync(`./auth/user.json`, JSON.stringify(users, null, 2), 'utf8')

      logger({ type: 'success', msg: `POST /register -->  success` });
      res.status(200).json({ message: "success" });
    } catch (err) {
      logger({ type: 'err', msg: `POST /register --> ${err}` });
      apiError({ req, res, err: 'service error' })
    }
  },
  verifyToken: (req, res, next) => {
    try {
      const token = req.headers['authorization'];

      jwt.verify(token, JWT_SECRET, (err) => {
        if (err) {
          logger({ type: 'err', msg: `POST /verifyToken --> ${err}` });
          res.status(403).send("Forbidden!");
        } else {
          next();
        }
      });

    } catch (err) {
      logger({ type: 'err', msg: `POST /verifyToken --> ${err}` });
      apiError({ req, res, err: 'service error' })
    }
  },
}

