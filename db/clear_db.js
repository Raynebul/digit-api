import database from "./database.js";
import {
    SQL_DROP_TABLE_JOBS, SQL_DROP_TABLE_DOCUMENTS, SQL_DROP_TABLE_USERS
  } from "./sql_queries.js"

database.db.run(SQL_DROP_TABLE_JOBS) // удаление таблицы jobs
database.db.run(SQL_DROP_TABLE_DOCUMENTS) // удаление таблицы documents
database.db.run(SQL_DROP_TABLE_USERS) // удаление таблицы users