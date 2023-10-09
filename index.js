require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Contact = require("./model/phonebook");


app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

app.get("/api/persons", (req, res) => {
  Contact.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/info", (req, res) => {
  Contact.countDocuments({})
    .then((count) => {
      res.send(`<p>Phonebook has info for ${count} people</p>
            <p>${date}</p>`);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Contact.find({ _id: id })
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.status(401).send(`<p>No Phonebook found</p>`);
    });
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "name is missing" });
  }
  if (!req.body.number) {
    return res.status(400).json({ error: "number is missing" });
  }

  Contact.find({ name: req.body.name })
    .then((result) => {
      if (result.length > 0) {
        return res.status(400).json({ error: "names must be unique" });
      } else {
        const contact = new Contact({
          name: req.body.name,
          number: req.body.number,
        });
        contact
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json(result);
          })
          .catch((err) => {
            res.status(400).json({ error: err });
          });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);
  res.send(phonebook);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
