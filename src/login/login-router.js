const express = require("express");
const LoginService = require("./login-services");
const { requireAuth } = require("../middleware/jwt-auth");

const loginRouter = express.Router();
const jsonBodyParser = express.json();

loginRouter.post("/", jsonBodyParser, (req, res, next) => {
  const { email, user_password } = req.body;
  const loginUser = { email, user_password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });
  // get user by email from database
  LoginService.getUserWithEmail(req.app.get("db"), loginUser.email)
    .then((dbUser) => {
      // check email
      if (!dbUser)
        return res.status(400).json({
          error: "Incorrect email or password",
        });
      // check password
      return LoginService.comparePasswords(
        loginUser.user_password,
        dbUser.user_password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res.status(400).json({
            error: "Incorrect email or password",
          });

        // create auth token
        const sub = dbUser.email;
        const payload = { user_id: dbUser.id };
        res.send({
          authToken: LoginService.createJwt(sub, payload),
        });
      });
    })
    .catch(next);
});

module.exports = loginRouter;
