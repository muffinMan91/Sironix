const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

//route to get the main page
// router.get('/main', (req, res) => {
//     res.render('main');
// });


module.exports = router;



