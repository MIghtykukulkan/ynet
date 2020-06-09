

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const port = process.env.PORT || 3001;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//app.use(passport.session());
//connecting mongo

require('./routes')(app);

module.exports = app.listen(port, () => console.log(`Example app listening on port ${port}!`))




