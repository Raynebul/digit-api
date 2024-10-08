const SQL_CREATE_DOCUMENTS = `CREATE TABLE documents (
    documentID INTEGER PRIMARY KEY AUTOINCREMENT,
    series number,
    number number,
    issueDate text
    )`;
const SQL_CREATE_JOBS = `CREATE TABLE jobs (
        jobID INTEGER PRIMARY KEY AUTOINCREMENT,
        name text,
        telephone text,
        address text
        )`;
const SQL_CREATE_USERS = `CREATE TABLE users (
        userID INTEGER PRIMARY KEY AUTOINCREMENT,
        login text NOT NULL UNIQUE,
        password text NOT NULL,
        surname text,
        name text,
        patronymic text,
        birthDate text,
        telephone text,
        key text,
        documentID number,
        jobID number,
        FOREIGN KEY(documentID) REFERENCES documents(documentID),
        FOREIGN KEY(jobID) REFERENCES jobs(jobID)
        )`;
const SQL_ADD_DOCUMENT = `INSERT INTO documents (
    series, 
    number, 
    issueDate
    ) 
    VALUES (?,?,?)`;
const SQL_ADD_JOB = `INSERT INTO jobs (
    name, 
    telephone, 
    address
    ) 
    VALUES (?,?,?)`
const SQL_ADD_USER = `INSERT INTO users (
    login,
    password,
    surname, 
    name, 
    patronymic, 
    birthDate,
    telephone, 
    key,
    documentID,
    jobID
    ) 
    VALUES (?,?,?,?,?,?,?,?,?,?)`


const SQL_FIND_USER = `SELECT password, key FROM users
    WHERE login = ?`

const SQL_FIND_JOB = `SELECT jobID FROM jobs
    WHERE name = ? and telephone = ? and address = ?`

const SQL_FIND_DOCUMENT = `SELECT documentID FROM documents
    WHERE series = ? and number = ? and issueDate = ?`

const SQL_FIND_LAST_DOCUMENT = `SELECT documentID FROM documents ORDER BY documentID DESC LIMIT 1;`

const SQL_DROP_TABLE_JOBS = `DROP TABLE IF EXISTS jobs`
const SQL_DROP_TABLE_DOCUMENTS = `DROP TABLE IF EXISTS documents`
const SQL_DROP_TABLE_USERS = `DROP TABLE IF EXISTS users`

export {
    SQL_CREATE_DOCUMENTS, SQL_CREATE_JOBS, SQL_CREATE_USERS,
    SQL_ADD_DOCUMENT, SQL_ADD_JOB, SQL_ADD_USER,
    SQL_FIND_USER, SQL_FIND_JOB, SQL_FIND_DOCUMENT,
    SQL_FIND_LAST_DOCUMENT,
    SQL_DROP_TABLE_JOBS, SQL_DROP_TABLE_DOCUMENTS, SQL_DROP_TABLE_USERS
}