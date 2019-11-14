const express = require('express');
require('dotenv').config(); //to read the .env

const PORT = process.env.PORT || 8080;
const app = express();
let htmlRoutes = require('./routes/htmlRoutes');
let apiRoutes = require('./routes/apiRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

htmlRoutes(app);
apiRoutes(app);

app.listen(PORT, function () {
    console.log(`Listening at http://localhost:${PORT}`);

})