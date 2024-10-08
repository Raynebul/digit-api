import jwt from "jsonwebtoken";
const SECRET_KEY = "TESTSECRETKEYTEST";
const ALGORITHM = {
  algorithm: "HS256",
};

function create_token(user) {
  let access_token = jwt.sign(user.returnJSON(), SECRET_KEY, ALGORITHM);
  user.key = access_token
}

export default create_token;
