import { Router } from "express";
import { getUsers } from "./getUsers";
import { postUsers } from "./postUsers";

export const users = Router();

users.get("/", (req, res) => getUsers(req, res));
users.post("/", (req, res) => postUsers(req, res));