## Тестовое задание Digit-разработчика

### Команды

`npm run start` - запуск API, после которого можно будет присылать запросы

`npm run clear_db` - очищает БД

`npm run fill_db` - заполняет БД данными из database.json (на данный момент БД заполнена данными)

### Архитектура

- index.js - запускает сервер
- /routers
- - user.js - содержит /user/register и /user/login
- /utils
- -   utils.js - генератор ключа
- /models
- -   models.js - функции-конструкторы для User, Job и Document
- /db
- - database.db - БД, в которой хранится вся информация о пользователей
- - database.json - json-файл, в котором хранится информация для заполнения БД командой `npm run fill_db` 
- - sql_queries.js - все SQL-запросы
- - clear_db.js - очищает БД
- - fill_db - заполняет БД данными из database.json
- - database.js - создает БД и таблицы + содержит функции для работы с БД.

### Модель данных (хранится в models/models.js)

#### User

- login: string
- password: string
- surname: string
- name: string
- patronymic: string
- birthDate: string
- telephone: string
- document: object Document
- job: object Job
- key: string

#### Document

- series: number
- number: number
- issueDate: string

#### Job

- name: string
- telephone: string
- address: string

### Связи

- Между User и Document — связь один-к-одному (каждый человек имеет один документ).

- Между Job и User — связь один-ко-многим (на одной работе может быть несколько людей).

### Как эти данные хранятся в БД

Изображено на 'Модель данных.drawio.png

### Заполненная БД (командой `npm run fill_db`)

#### Таблица User

| id   | login | password | surname | name | patronymic | birthDate | telephone | key | documentID | jobID |
| -------- | ------- | -------- | ------- | -------- | ------- | -------- | ------- | -------- | ------- | ------- |
| 1  | qwerty   | зашифрованный/`12345`/ | Иванов | Иван | Иванович | 01.01.2000 | +79001234567 | /генерируется JWT-токен/ | 1 | 1 |
| 2 | petr  | зашифрованный/`qwerty`/ | Кузнецов | Пётр | Дмитриевич | 07.11.2001 | +79001234588 | /генерируется JWT-токен/ | 2 | 2 |
| 3    | sasha11   | зашифрованный/`123456789`/ | Веселова | Александра | Сергеевна | 02.02.2002 | +79166788511 | /генерируется JWT-токен/ | 3 | 1 |


#### Таблица Documents

| documentID   | series | number | issueDate |
| -------- | ------- | -------- | ------- |
| 1  | 1111 | 111111 | 01.04.2020 |
| 2 | 1112 | 111112 | 15.01.2022 | 
| 3    | 1113 | 111114 | 04.05.2022 |

#### Таблица Jobs

| jobID   | name | telephone | address |
| -------- | ------- | -------- | ------- |
| 1  | Компания 1 | +79000000000 | г. Москва, ул. Ленина, д. 1 |
| 2 | Компания 2 | +79000000011 | г. Москва, ул. Ленина, д. 2 | 

### Ключ для авторизации (генератор ключа хранится в utils/utils.js)

Ключ для авторизации представляет из себя JWT-токен (JSON Web Token), который генерируется из вводимых данных пользователем для регистрации.

### routes

##### `/user/register`

Пример входных данных:
```json
{
    "user": {
        "login": "sergey",
        "password": "1234512345",
		"surname": "Болдырев",
		"name": "Сергей",
		"patronymic": "Дмитриевич",
		"birthDate": "21.12.2001",
		"telephone": "+79000000000",
        "job": {
	        "name": "Компания 3",
	        "telephone": "+79000000011",
	        "address": "Новосибирск"
        },
        "document": {
	        "series": 1119,
	        "number": 111119,
	        "issueDate": "17.02.2021"
	    } 
    }
}
```


##### `/user/login`

POST-запрос:

Пример входных данных:
```json

{
        "login": "sergey",
        "password": "12345",
}

```

### Тесты

##### `/user/register`

Тест 1: Добавление нового пользователя

###### Вход
```json
{
    "user": {
        "login": "sergey",
        "password": "1234512345",
		"surname": "Болдырев",
		"name": "Сергей",
		"patronymic": "Дмитриевич",
		"birthDate": "21.12.2001",
		"telephone": "+79000000000",
        "job": {
	        "name": "Компания 3",
	        "telephone": "+79000000011",
	        "address": "Новосибирск"
        },
        "document": {
	        "series": 1119,
	        "number": 111119,
	        "issueDate": "17.02.2021"
	    } 
    }
}
```


###### Выход
```json
{
    "message": "Регистрация успешно пройдена!"
}
```

Тест 2: Добавление уже зарегистрированного пользователя

###### Вход
```json
{
    "user": {
        "login": "sergey",
        "password": "1234512345",
		"surname": "Болдырев",
		"name": "Сергей",
		"patronymic": "Дмитриевич",
		"birthDate": "21.12.2001",
		"telephone": "+79000000000",
        "job": {
	        "name": "Компания 3",
	        "telephone": "+79000000011",
	        "address": "Новосибирск"
        },
        "document": {
	        "series": 1119,
	        "number": 111119,
	        "issueDate": "17.02.2021"
	    } 
    }
}
```

###### Выход

```json
{
    "error": "Пользователь уже зарегистрирован!"
}
```


Тест 3: Добавление нового пользователя, но с уже добавленной работой в БД.

###### Вход

```json
{
    "user": {
        "login": "elena_11",
        "password": "1234512345",
		"surname": "Васенина",
		"name": "Светлана",
		"patronymic": "Сергеевна",
		"birthDate": "10.11.2001",
		"telephone": "+79000000000",
        "job": {
	        "name": "Компания 3",
	        "telephone": "+79000000011",
	        "address": "Новосибирск"
        },
        "document": {
	        "series": 1120,
	        "number": 111120,
	        "issueDate": "17.03.2021"
	    } 
    }
}
```

###### Выход

```json
{
    "message": "Регистрация успешно пройдена!"
}

```
`Информация о работе не была добавлена, так как она уже хранится в таблице jobs `

##### `/user/login`

Тест 1: Авторизация зарегистрированного пользователя

###### Вход

```json
{
        "login": "sergey",
        "password": "1234512345"
}

```

###### Выход

```diff
+ OK: Status 200
```

```json
{
    "key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IjEyMzR3ZTMzdzU2Njc0NDQiLCJwYXNzd29yZCI6IjEyMzRlZTUiLCJzdXJuYW1lIjoid2V3ZXMiLCJuYW1lIjoid3d3IiwicGF0cm9ueW1pYyI6ItCU0Lx3ZWVl0LXQstC40YciLCJiaXJ0aERhdGUiOiIwMS4wMS4yMDAwIiwidGVsZXBob25lIjoiMTExIiwiam9iIjp7Im5hbWUiOiJTQyIsInRlbGVwaG9uZSI6IjExMSIsImFkZHJlc3MiOiLQndC-0LLQvtGB0LjQsdC40YDRgdC6In0sImRvY3VtZW50Ijp7InNlcmllcyI6MTExLCJudW1iZXIiOjExMSwiaXNzdWVEYXRlIjoiMTcuMDkuMjAyMyJ9LCJpYXQiOjE3MjgyOTg0Mzd9.xYfFQ_1TIs_ih4gJoiv6aIZJ00YdGpZuKtdMHdmBv9k"
}
```

Тест 2: Авторизация НЕзарегистрированного пользователя (логина нет в БД)

###### Вход

```json
{
        "login": "sergey123",
        "password": "1234512345"
}

```

###### Выход

```diff
- Error: Status 403
```
```json
{}
```

Тест 3: Авторизация зарегистрированного пользователя, но с неверным паролем

###### Вход

```json
{
        "login": "sergey",
        "password": "12345123451"
}

```

###### Выход

```diff
- Error: Status 403
```
```json
{}
```