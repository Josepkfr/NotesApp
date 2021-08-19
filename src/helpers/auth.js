const helpers = {
  isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error", "Not authorized");
      res.redirect("/user/login");
    }
  },
};

module.exports = helpers;
