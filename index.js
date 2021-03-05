const express = require('express');
const cors = require('cors');
const router = require('./routes');

const app = express();

// const corsConfig = {
//   origin: 'http://localhost:3000',
// };

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(4000, () => {
  console.log('Server lives!');
});
