import { Request, Response } from "express";
import Collection from '../models/2014/collection/index.js';

export default async (req: Request, res: Response) => {
  const collections = await Collection.find({});

  const colName = req.path.split("/")[1]
  const colRequested = collections.find(col => col.index === colName)

  if (colRequested === undefined && colName !== '') {
    res.sendStatus(404)
    return;
  }

  const redirectUrl = "/api/2014" + req.path
  res.redirect(301, redirectUrl)
};
