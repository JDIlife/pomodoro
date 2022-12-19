const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('staticMainPage'));
app.use(express.static('staticRecordPage'));

app.use(express.json);
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "staticMainPage/index.html");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

app.post('/recordPage', (req, res) => {
  res.send("post");
})
