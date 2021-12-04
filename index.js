var persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

morgan.token("resData", (req, res) => JSON.stringify(req.body));

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :resData"
  )
);
app.use(express.static("build"));

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const now = new Date();
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${now}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const validPerson = persons.find((p) => p.id === id);
  if (validPerson) {
    res.json(validPerson);
    return;
  }
  res.statusMessage = "Requested data is unavailable";
  res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  console.log(persons);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const data = req.body;
  const invalidName = persons.find((p) => p.name === data.name);
  if (data.name == false || data.number == false || invalidName) {
    if (!data.name || !data.number) {
      res.statusMessage = "content missing";
      res.status(400).json({ error: "content missing" });
      return;
    }
    res.statusMessage = "name duplication";
    res.status(400).json({ error: "name must be unique" });
    return;
  }
  const newPerson = {
    id: Number((Math.random() * 1000).toFixed(0)),
    name: data.name,
    number: data.number,
  };
  console.log("new person is created");
  res.json(newPerson);
  persons = persons.concat(newPerson);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
