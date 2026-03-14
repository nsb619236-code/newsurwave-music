const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
r8_WEXQVdSzYAdPhgQHisxth2B34XLbM233G3YqP
const TOKEN = " ";

app.post("/generate-song", async (req,res)=>{

const prompt = req.body.prompt;

const response = await fetch(
"https://api.replicate.com/v1/predictions",
{
method:"POST",
headers:{
"Authorization":`Token ${TOKEN}`,
"Content-Type":"application/json"
},
body:JSON.stringify({
version:"musicgen-version-id",
input:{
prompt:prompt,
duration:15
}
})
});

const data = await response.json();

res.json(data);

});

app.listen(3000,()=>{
console.log("AI music server running");
});
