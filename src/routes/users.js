const router = require("express").Router();
const User = require("../models/User");
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.get("/register", (req, res) => {
  res.render("user/register");
});

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];
  if (password != confirmPassword) {
    errors.push({ text: "Las contraseñas no cinciden" });
  }
  if (password.length < 4) {
    errors.push({ text: "Deberia ser de al menos 4 digitos" });
  }
  if (errors.length > 0) {
    res.render("user/register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  } else {
    const emailUser = await User.findOne({ email });
    if (emailUser) {
      req.flash("errorMessage", "Ya esta en uso");
      res.redirect("/user/register");
    } else {
      const user = new User({ name, email, password });
      user.password = await user.hash(password);
      await user.save();
      req.flash("successMessage", "You are register");
      res.redirect("/user/login");
    }
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});
module.exports = router;
