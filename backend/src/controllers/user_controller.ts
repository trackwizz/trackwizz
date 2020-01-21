import { NextFunction, Request, Response } from "express";
import { Controller, get, post, put, del } from "./controller";
import { getRepository } from "typeorm";
import { User } from "../entities/user";

export class UserController extends Controller {
  constructor() {
    super("users");
  }

  @get()
  public async getUsers(_req: Request, res: Response): Promise<void> {
    const users: User[] = await getRepository(User).find();
    res.sendJSON(users);
  }

  @get({ path: "/:id" })
  public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const user: User | undefined = await getRepository(User).findOne(id);
    if (user === undefined) {
      next();
      return;
    }
    res.sendJSON(user);
  }

  @post()
  public async addUser(req: Request, res: Response): Promise<void> {
    const user: User = new User();
    user.name = req.body.name || null;
    await getRepository(User).save(user);
    res.sendJSON(user);
  }

  @put({ path: "/:id" })
  public async editUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    const name: string = req.body.name || null;
    const user: User | undefined = await getRepository(User).findOne(id);
    if (user === undefined) {
      next();
      return;
    }
    if (name !== null) {
      user.name = name;
    }
    await getRepository(User).save(user);
    res.sendJSON(user);
  }

  @del({ path: "/:id" })
  public async deleteTheme(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10) || 0;
    await getRepository(User).delete(id);
    res.status(204).send();
  }
}
