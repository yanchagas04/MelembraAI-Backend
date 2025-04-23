import { Prisma } from "../../lib/prisma";
import { prisma } from "../server";
import { Request, Response } from "express";

export async function postUsers(req: Request, res: Response) {
    try {
        const body = req.body;
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password,
            }
         });
        res.json(user).status(201);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({ error: "Erro ao criar usuário." , details: error });
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                res.status(400).json({ error: "Usuário já cadastrado." });
                return;
            }
        }
        res.status(500).json({ error: "Erro ao criar usuário." , details: error });
    }
}