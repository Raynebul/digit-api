import database from "./database.js";
import filled_db from "./database.json"  with { type: "json" };
import create_token from "../utils/generator.js"
import { User } from "../models/models.js";

let i = 0;
let interval = setInterval(function () {
    let user = filled_db[i]
    let user_ = new User(
        user
    );
    create_token(user_)
    database.addUser(user_, function (error) {
        if (error) console.log({ error: error })
        else console.log({ user: user_ });
    })
    i++;
    if(i === 3) clearInterval(interval)
}, 500);



