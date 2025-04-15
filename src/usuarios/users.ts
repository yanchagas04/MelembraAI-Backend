import { Router } from "express";
import { getUsers } from "./getUsers";

export const users = Router();

users.get("/", (req, res) => getUsers(req, res));