import sqlite3 from "sqlite3";
import {
  SQL_CREATE_DOCUMENTS, SQL_CREATE_JOBS, SQL_CREATE_USERS,
  SQL_ADD_DOCUMENT, SQL_ADD_JOB, SQL_ADD_USER,
  SQL_FIND_USER, SQL_FIND_JOB, SQL_FIND_DOCUMENT,
  SQL_FIND_LAST_DOCUMENT
} from "./sql_queries.js"
import bcrypt from "bcrypt";

let salt = bcrypt.genSaltSync(10);

sqlite3.verbose();

const DBSOURCE = "./db/database.db";

// Создание БД и таблиц users, jobs и documents
let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    // Создание таблицы jobs
    db.serialize(function () {
      db.run(SQL_CREATE_JOBS, (err) => {
        if (err) {
          console.log("Table jobs already created");
        } else {
          console.log("Table jobs just created, creating some rows");
        }
      });
      // Создание таблицы documents
      db.run(SQL_CREATE_DOCUMENTS, (err) => {
        if (err) {
          console.log("Table documents already created");
        } else {
          console.log("Table documents just created, creating some rows");
        }
      });
      // Создание таблицы users
      db.run(SQL_CREATE_USERS, (err) => {
        if (err) {
          console.log("Table users already created");
        } else {
          console.log("Table users just created, creating some rows");
        }
      });
    })
  }
});

// проверка, что пользователь уже зарегистрирован при POST-запросе /user/login
function isRegisteredLogin(login, password, callback) {
  db.get(SQL_FIND_USER, [login], function (error, answer) {
    if (!answer) callback(answer?.key)
    else {
      bcrypt.compare(password, answer?.password, function (err, result) { // сравнение паролей
        if (!result) callback(undefined);
        else callback(answer?.key)
      });
    }
  })
}

// проверка, что пользователь уже зарегистрирован при POST-запросе /user/register
function isRegistered(login, password, callback) {
  db.get(SQL_FIND_USER, [login], function (error, answer) {
    callback(answer?.key)
  })
}

// Регистрация нового пользователя в БД
function addUser(user, callback) {
  user.password = bcrypt.hashSync(user.password, salt); // шифрование пароля
  let [userParams, documentParams, jobParams] = createAllParams(user);
  checkJob(jobParams, function (error, jobID) {
    if (jobID) {
      db.run(SQL_ADD_DOCUMENT, documentParams, function (documentError) { // Добавление документа в БД
        if (documentError) return callback(documentError)
        db.get(SQL_FIND_LAST_DOCUMENT, [], function (documentError1, answer) { // Возвращение последней строки в таблице documents
          userParams = [...userParams, answer?.documentID, jobID]
          db.run(SQL_ADD_USER, userParams, function (userError) { // Добавление пользователя в БД
            if (userError) return callback(userError)
            callback("")
          });
        })
      });
    } else {
      callback(" ")
    }
  })
}

// Проверка, что работа уже добавлена в БД
function checkJob(jobParams, callback) {
  db.get(SQL_FIND_JOB, jobParams, function (error, answer) { // Нахождение строки с работой
    if (answer?.jobID) {
      callback(error, answer?.jobID)
    }
    else {
      db.run(SQL_ADD_JOB, jobParams, function (jobError) { // Добавление работы в БД
        if (jobError) return callback(jobError, answer?.jobID)
        db.get(SQL_FIND_JOB, jobParams, function (jobError1, answer) {
          if (jobError1) return callback(jobError1, answer?.jobID)
          callback(jobError1, answer?.jobID)
        })
      })
    }
  })
}

// Создание массивов данных для запросов SQL
function createAllParams(user) {
  let userParams = createParams(user);
  let documentParams = createParams(user["document"]);
  let jobParams = createParams(user["job"]);
  return [userParams, documentParams, jobParams];
}

function createParams(array) {
  let params = Object.keys(array)
    .map((key) => {
      if (typeof array[key] != "function" && typeof array[key] != "object") { return array[key] }
    }).filter(function (item) {
      return item != undefined;
    });
  return params;
}

export default { isRegistered, isRegisteredLogin, addUser, db };
