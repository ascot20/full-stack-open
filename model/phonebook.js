const mongoose = require('mongoose');

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then((res) => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(`could not connect to database: ${err.message}`);
  });

mongoose.set("strictQuery", false)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: Number
})

phonebookSchema.set("toJSON",{
    transform: (doc,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Contact", phonebookSchema)