export type UserRole = "citizen" | "admin";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export type IssueCategory =
  | "Pothole"
  | "Garbage"
  | "Water Logging"
  | "Streetlight"
  | "Road Damage"
  | "Other";

export type IssuePriority = "Low" | "Medium" | "High";

export type IssueStatus = "Pending" | "In Progress" | "Resolved";

export interface CreatorInfo {
  _id: string;
  fullName: string;
  email: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  imageUrl: string;
  latitude: number;
  longitude: number;
  address: string;
  createdBy: CreatorInfo | string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryStat {
  _id: string;
  count: number;
}

export interface AdminStats {
  totalIssues: number;
  pendingIssues: number;
  resolvedIssues: number;
  inProgressIssues: number;
  categoryDistribution: CategoryStat[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
