import { Request, Response } from "express";

import { issueSchema } from "./issue.validation";

import {
  createIssue,
  getAllIssues,
} from "./issue.service";

export const create = async (
  req: Request,
  res: Response
) => {
  try {
    const body = issueSchema.parse(req.body);

    const image =
      req.file?.filename || "";

    const issue =
      await createIssue(
        body,
        image,
        (req as any).user._id
      );

    res.status(201).json(issue);
  } catch (e: any) {
    res.status(400).json({
      message: e.message,
    });
  }
};

export const getAll = async (
  req: Request,
  res: Response
) => {
  const issues =
    await getAllIssues();

  res.json(issues);
};