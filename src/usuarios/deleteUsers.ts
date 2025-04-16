import { Request, Response } from "express";
import { prisma } from "../server";

export async function deleteUsers(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const user = await prisma.user.delete({ where: { id: id } });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário." , details: error });
    }
}