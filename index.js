require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

morgan.token("resData", (req, res) => JSON.stringify(req.body));

const app = express();
const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ err: "malformatted id" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).send({ err: err.message });
  }
  next(err);
};
app.use(express.json());
app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :resData"
  )
);
app.use(express.static("build"));

app.get("/api/persons", (req, res) => {
  Person.find({}).then((datas) => {
    res.json(datas);
    console.log(datas);
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then((dbRes) => {
    const now = new Date();
    res.send(
      `<p>Phonebook has info for ${dbRes.length} people</p><p>${now}</p>`
    );
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((dbRes) => {
      if (dbRes) {
        res.json(dbRes);
        return;
      }
      res.statusMessage = "Requested data is unavailable";
      res.status(404).end();
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((response) => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;
  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { runValidators: true, new: true }
  )
    .then((dbRes) => {
      console.log(`${name}\'s number is updated successfully.`);
      console.log(dbRes);
      res.status(201);
      res.json(dbRes);
    })
    .catch((err) => {
      next(err);
    });
});

app.post("/api/persons", (req, res, next) => {
  const data = req.body;
  if (data.name == false || data.number == false) {
    if (!data.name || !data.number) {
      res.statusMessage = "content missing";
      res.status(400).json({ error: "content missing" });
      return;
    }
  }
  const newPerson = new Person({
    name: data.name,
    number: data.number,
  });
  newPerson
    .save()
    .then((person) => {
      console.log("new person is added to database");
      res.status(201);
      res.json(person);
    })
    .catch((err) => next(err));
});

app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
