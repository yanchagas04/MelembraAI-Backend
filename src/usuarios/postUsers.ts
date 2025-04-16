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
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário." , details: error });
    }
}