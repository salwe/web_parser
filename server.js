const express = require('express');
const pixelRouter = require('./routers/pixel');
const mailRouter = require('./routers/mail');
const userRouter = require('./routers/user');

const app = express();

app.use(express.json());
app.use(pixelRouter);
app.use(mailRouter);
app.use(userRouter);

app.listen(8080, () => console.log('Express server listening on 8080'));