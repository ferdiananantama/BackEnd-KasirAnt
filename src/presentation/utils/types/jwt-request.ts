import { Auth } from "@/domain/models/auth";
import { Request } from "express";

export interface AuthRequest extends Request {
  auth: Auth;
}
