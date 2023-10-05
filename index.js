const express = require('express');
const app = express()
const cors = require('cors')

let phonebook = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

const date = new Date()

function getLength(){
    return phonebook.length
}

function genId(){
    const id = Math.floor(Math.random() * (100 - 5) + 5)
    return id
}

app.use(express.json())
app.use(cors())

app.get("/api/persons",(req,res)=>{
    res.json(phonebook)
})

app.get("/info",(req,res)=>{
    res.send(`<p>Phonebook has info for ${getLength()} people</p>
                 <p>${date}</p>`)
})

app.get("/api/persons/:id",(req,res)=>{
    const id = Number(req.params.id)
    const person = phonebook.find((person)=>person.id ===id)
    if(!person){
        return res.status(404).send(`<p>Phonebook not found</p>`)
    }
    res.send(person)
})

app.post("/api/persons",(req,res)=>{

    if (!req.body.name || !req.body.number){
        if (!req.body.name){
            return res.status(404).json({error: 'name is missing'})
        }
        else{
            return res.status(404).json({error: 'number is missing'})
        }
    }

    const findPerson = phonebook.find((person)=> person.name === req.body.name)

    if (findPerson){
        return res.status(400).json({error: 'name must be unique'})
    }

    const person = {
        "id": genId(),
        "name": req.body.name,
        "number": req.body.number
    }

    phonebook = phonebook.concat(person)
    res.send(phonebook)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    phonebook = phonebook.filter((person)=> person.id !== id)
    res.send(phonebook)
})

const port = process.env.PORT || 3001
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})