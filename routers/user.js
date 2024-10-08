import express from "express";
import { User } from "../models/models.js";
import database from "../db/database.js"
import create_token from "../utils/generator.js"

const router = express.Router();

// /user/login - авторизация пользователя
router.post("/login", function (req, res) {
  let login = req.body.login;
  let password = req.body.password;
  database.isRegisteredLogin(login, password, function (key) { // проверка, что пользователь уже зарегистрирован
    if (key === undefined) {
      res.status(403).json({}) // 403 с сообщением, что пользователь не найден
    }
    else {
      res.status(200).json({ key: key }) // возвращается 200 статус и ключ авторизация пользователя
    }
  })
});

// /user/register - регистрация пользователя
router.post("/register", function (req, res) {
  let user = req.body.user;
  let user_ = new User(
    user
  );
  database.isRegistered(user_.login, user_.password, function (key) { // проверка, что пользователь уже зарегистрирован
    if (key === undefined) {
      create_token(user_) // создание ключа для авторизации
      database.addUser(user_, function (error) {
        if (error) res.json({ error: error })
        else res.json({ message: "Регистрация успешно пройдена!" }); // пользователь успешно добавлен в БД
      })
    }
    else {
      res.json({ error: "Пользователь уже зарегистрирован!" }); // пользователь уже был добавлен в БД
    }
  })

});

export default { router };
