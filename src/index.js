const express = require("express"); 
const v1MainRouter = require("./v1/routes/mainRoutes"); 
const v1CardRouter = require("./v1/routes/cardRoutes"); 


const app = express()
const PORT = process.env.PORT || 3000; 


app.use("/api/v1",v1MainRouter)
app.use("/api/v1/cards",v1CardRouter)


app.listen(PORT, () => { 
    console.log(`API is listening on port ${PORT}`); 
});

app.get("/", (req, res) => { 
    res.send("<h2>It's Work!!!</h2>"); 
}); 

