import { Router } from "express";
import { getUsers } from "./getUsers";
import { postUsers } from "./postUsers";
import { deleteUsers } from "./deleteUsers";

export const users = Router();

users.get("/", (req, res) => getUsers(req, res));
users.post("/", (req, res) => postUsers(req, res));
users.delete("/:id", (req, res) => deleteUsers(req, res));