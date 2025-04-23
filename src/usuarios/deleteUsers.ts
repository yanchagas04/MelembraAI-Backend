import { Request, Response } from "express";
import { prisma } from "../server";
import { Prisma } from "../../lib/prisma";

export async function deleteUsers(req: Request, res: Response) {
    try {
        const id = req.params.id;
        const user = await prisma.user.delete({ where: { id: id } });
        res.json(user).status(200);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ error: "Usuário não encontrado." });
                return;
            }
        }
        if (error instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({ error: "Erro ao deletar usuário." , details: error });
            return;
        }
        res.status(500).json({ error: "Erro ao deletar usuário." , details: error });
    } 
}