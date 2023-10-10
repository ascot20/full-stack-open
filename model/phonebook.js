const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((res) => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(`could not connect to database: ${err.message}`);
  });

mongoose.set("strictQuery", false);

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number:{
    type: String,
    minLength: 8,
    validate:{
      validator: function(phone){
        const pattern = /^\d{2,3}-\d+$/
        return pattern.test(phone)
      },
      message: 'Invalid phone number format.".'
    }
  }
});

phonebookSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", phonebookSchema);
