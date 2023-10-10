require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Contact = require("./model/phonebook");

const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
  }

  next(err)
};

const unknownEndpoint = (req, res)=>{
  res.status(404).send({error: "unknown endpoint"})
}

app.use(express.json());
app.use(cors());
app.use(requestLogger);
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

app.get("/api/persons/:id", (req, res,next) => {
  const id = req.params.id;
  Contact.findById(id)
    .then((result) => {
      if(result){
        res.json(result);
      }else{
        res.status(404).end()
      }
      
    })
    .catch((err) => {
      next(err)
    });
});

app.post("/api/persons", (req, res, next) => {
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
            res.status(201).json(result);
          })
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  Contact.findByIdAndRemove(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

app.use(unknownEndpoint)
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
