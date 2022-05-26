const { randomId, writeFile } = require('../helper.js');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//bad idea
const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}"

module.exports = {
  loginController: async (req, res, file) => {
    try {
      let user = JSON.parse(fs.readFileSync(`./auth/user.json`));
      user = user.find(v => v.email === req.body.email)

      // if (user) {
        const saltedPassword = user.password;
        const successResult = await bcrypt.compare(req.body.password, saltedPassword)
        
        console.log(successResult)
        if (successResult) {
          const payLoad = {
            "username": user.usename,
          }

          const token = jwt.sign(payLoad, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1d' })
          const users = JSON.parse(fs.readFileSync(`./auth/user.json`));
          const idx = users.findIndex((user) => user.usename === req.body.usename);

          users[idx] = { ...users[idx], token };
          fs.writeFileSync(`./auth/user.json`, JSON.stringify(users, null, 2), 'utf8')

          res.status(200).json({ status: "success", token })
        } else {
          res.status(404).json({ message: "password/username invalid" })
        }
      // } else {
      //   res.status(409).json({ message: "already registered" });
      // }
    } catch (error) {
      res.status(500).json({ status: false, msg: 'service error' });
    }
  },
  registerController: async (req, res) => {
    try {
      const users = JSON.parse(fs.readFileSync(`./auth/user.json`));
      const user = users.find(v => v.username === req.body.username);

      if (!user) {
        const hash = await bcrypt.hash(req.body.password, 10)
        
        const newUser = { id: randomId(), ...req.body, password: hash };
        users.push(newUser);
        
        fs.writeFileSync(`./auth/user.json`, JSON.stringify(users, null, 2), 'utf8')
        
        res.status(200).json({ message: "success" });
      } else {
        res.status(409).json({ message: "already registered" });
      }
    } catch (error) {
      res.status(500).json({ status: false, msg: error });
    }
  },
  verifyToken: (req, res, next) => {
    try {
      const token = req.headers['authorization'];

      if (!token ) return res.status(403).send("Forbidden!");

      jwt.verify(token, JWT_SECRET, (err) => {
        if (err) {
          res.status(403).send("Forbidden!");
        } else {
          next();
        }
      });

    } catch (error) {
      console.log("err")
      res.status(500).json({ status: false, msg: error });
    }
  },
}

