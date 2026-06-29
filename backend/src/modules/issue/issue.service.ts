import { Issue } from "./issue.model";
import { CreateIssueDTO } from "./issue.types";

export const createIssue = async (
  payload: CreateIssueDTO,
  imageUrl: string,
  userId: string
) => {
  return Issue.create({
    ...payload,
    imageUrl,
    createdBy: userId,
  });
};

export const getAllIssues = async () => {
  return Issue.find()
    .populate("createdBy", "fullName email")
    .sort({ createdAt: -1 });
};