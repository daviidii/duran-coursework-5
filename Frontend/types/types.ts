export type StatusType = "Pending" | "Completed";

export type ButtonVariants =
  | "default"
  | "link"
  | "warning"
  | "success"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined;

export interface TaskProps {
  _id: number;
  title: string;
  description: string | null;
  status: string;
  due_date: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
  isAuthorized?: boolean;
  message?: string;
}
