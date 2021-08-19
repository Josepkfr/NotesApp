const router = require("express").Router();
const Note = require("../models/Note");
const { isAuthenticated } = require("../helpers/auth");

router.get("/notes", isAuthenticated, async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ date: "desc" });
  res.render("notes/allNotes", { notes });
});

router.get("/notes/add", isAuthenticated, (req, res) => {
  res.render("notes/add");
});

router.post("/notes/add", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({ text: "Porfavor escriba un titulo" });
  }
  if (!description) {
    errors.push({ text: "Porfavor escriba una descripcion" });
  }
  if (errors.length > 0) {
    res.render("notes/add", { errors, title, description });
  } else {
    const newNote = new Note({ title, description });
    newNote.user = req.user.id;
    await newNote.save();
    req.flash("successMessage", "Nota agregada");
    res.redirect("/notes");
  }
});

router.get("/notes/edit/:id", isAuthenticated, async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render("notes/edit", { note });
});
router.put("/notes/edit/:id", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("successMessage", "Actualizado correcto");
  res.redirect("/notes");
});
router.delete("/notes/delete/:id", isAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("successMessage", "Eliminado correcto");
  res.redirect("/notes");
});

module.exports = router;
