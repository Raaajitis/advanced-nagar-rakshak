import { Issue } from "../issue/issue.model";

export const getDashboardStats = async () => {
  const totalIssues = await Issue.countDocuments();

  const pendingIssues = await Issue.countDocuments({
    status: "Pending",
  });

  const resolvedIssues = await Issue.countDocuments({
    status: "Resolved",
  });

  const inProgressIssues = await Issue.countDocuments({
    status: "In Progress",
  });

  const categoryDistribution = await Issue.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalIssues,
    pendingIssues,
    resolvedIssues,
    inProgressIssues,
    categoryDistribution,
  };
};

export const updateStatus = async (id: string, status: string) => {
  return Issue.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate("createdBy", "fullName email");
};