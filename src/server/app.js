import express from 'express';
let app = express();
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html')});
const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);