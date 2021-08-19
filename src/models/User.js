const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

UserSchema.methods.hash = (password) => {
  const hash = bcrypt.hashSync(password, 10);
  return hash;
};

UserSchema.methods.compare = function (password) {
  const compare = bcrypt.compareSync(password, this.password);
  return compare;
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
