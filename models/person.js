const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const url = process.env.MONGODB_URL;
console.log(url);
mongoose
  .connect(url)
  .then(() => {
    console.log("Database has been connected.");
  })
  .catch((err) => {
    console.log("Unable to connect to database: ", err.message);
  });
const personScheme = new mongoose.Schema({
  name: { type: String, unique: true, minlength: 3 },
  number: { type: String, minlength: 8 },
});

personScheme.plugin(uniqueValidator);
personScheme.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});
// if (pw) {
//   if (name && number) {
//     const person = new Person({
//       id: Number(Math.random() * 10000),
//       name: name,
//       number: number,
//     });
//     person.save().then((res) => {
//       console.log(`Added ${res.name} number ${res.number} to phonebook`);
//       mongoose.connection.close();
//       process.exit();
//     });
//   } else {
//     console.log("Phonebook:");
//     Person.find().then((res) => {
//       res.forEach((person) => {
//         console.log(person.name, person.number);
//       });
//       mongoose.connection.close();
//       process.exit();
//     });
//   }
// }

module.exports = mongoose.model("Person", personScheme);
