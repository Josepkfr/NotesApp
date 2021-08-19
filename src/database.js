const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URI,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(db=>{
    console.log("DataBase Connected")
})
.catch(err=>{
    console.log(err)
})