import { User } from "lucide-react";

export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export type UserRole = "admin" | "user";
export type Gender = "male" | "female" | "not-stated" | "non-binary" | "other";
export type Sex = "male" | "female";

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  verified: boolean;
  firstName: string;
  surname?: string;
  avatar?: string;
  dateOfBirth?: string;
  phoneNumber: string;
  gender?: Gender;
  sex?: Sex;
  postcode?: string;
  nhs?: string;
  contraception?: string;
  blocked: boolean;
  deviceTokens?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceToken?: string;
}

export interface LoginResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  incompleteUsers: number;
  blockedUsers: number;
  newRequests: number;
}

export interface MonthlyUserStat {
  _id: number;
  name: string;
  users: number;
}

export interface DashboardResponseData {
  stats: DashboardStats;
  monthlyStat: MonthlyUserStat[];
  users: User[];
}

export type ProfileResponseData = User;

export type AllUsersResponseData = PaginatedResponse<User>;

export type UpdateAvatarRequest = {
  avatar: File;
};

export interface ChatParticipant {
  user: User;
  unreadCount: number;
}

export interface Chat {
  _id: string;
  participants: ChatParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  text?: string;
  attachment?: string;
  createdAt: string;
  updatedAt: string;
}

export type SendImageRequest = {
  chatId: string;
  attachment: File;
};

export type ChatsResponseData = PaginatedResponse<Chat>;
export type MessagesResponseData = PaginatedResponse<Message>;

export type ServiceStatus = "pending" | "accept" | "decline";

export interface Cocp {
  _id: string;
  userId: User | string;

  consent: boolean;
  shareConsent: boolean;
  speakWithSpecialist: boolean;
  medicalHistory: string[];
  medicalDetails: string;
  isPregnant: boolean;

  drugs: string[];
  cocp: string;

  exclusions: string;
  needAppointment: boolean;

  bloodPreasureStatus: string;

  bmi: number;
  systolic: number;
  diastolic: number;

  weightChecked: boolean;
  comment: string;

  status: ServiceStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pop {
  _id: string;
  userId: User | string;

  consent: boolean;
  shareConsent: boolean;
  speakWithSpecialist: boolean;
  medicalHistory: string[];
  medicalDetails: string;
  isPregnant: boolean;

  popOptions: string;

  exclusions: string;
  needAppointment: boolean;

  status: ServiceStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type AllPopsResponseData = PaginatedResponse<Pop>;
export type AllCocpsResponseData = PaginatedResponse<Cocp>;
