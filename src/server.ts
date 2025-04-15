import { Request, Response, Router } from "express";

const express = require('express');
const app = express();
const PORT = 3000;

const root = Router();

root.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use(root);

app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT}`);
});