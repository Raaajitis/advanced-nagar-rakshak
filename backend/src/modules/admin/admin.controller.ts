import { Request, Response } from "express";
import { getDashboardStats, updateStatus } from "./admin.service";

export const dashboardStats = async (
  req: Request,
  res: Response
) => {
  const stats = await getDashboardStats();

  res.json({
    success: true,
    data: stats,
  });
};

export const updateIssueStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const id = req.params.id as string;
    const status = req.body.status as string;

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedIssue = await updateStatus(id, status);

    if (!updatedIssue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.json({
      success: true,
      message: "Issue status updated successfully",
      data: updatedIssue,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};