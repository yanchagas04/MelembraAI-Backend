import { Request, Response, Router } from "express";
import { PrismaClient } from "../lib/prisma";
import { users } from "./usuarios/users";

export const prisma = new PrismaClient();
const express = require('express');
const app = express();
const PORT = 3000;

const root = Router();

root.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use(root);
app.use('/usuarios', users);

app.listen(PORT, () => {
    console.log(`Servidor ativo na porta ${PORT}`);
});