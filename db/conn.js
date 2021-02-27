const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userauthentication", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true,
}).then(()=>{
    console.log('Connection is successfully created')
}).catch((error)=>{
    console.log(error)
});
