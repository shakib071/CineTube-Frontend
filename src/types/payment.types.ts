import { MediaType } from "./media.types";

export type SubscriptionPlan = "FREE" | "MONTHLY" | "YEARLY";
export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";
export type PurchaseType = "BUY" | "RENT" | "SUBSCRIPTION";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
export type PaymentGateway = "STRIPE" | "SSLCOMMERZ";
export type Currency = "BDT" | "USD";

export interface ISubscription {
  id: string;
  plan: SubscriptionPlan;
  startTime: string;
  endDate: string;
  status: SubscriptionStatus;
  userId: string;
}

export interface IPurchaseMedia {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  type: MediaType;
  genre: string[];
}

export interface IPurchase {
  id: string;
  type: PurchaseType;
  amount: number;
  status: PaymentStatus;
  transactionId?: string | null;
  createdAt: string;
  expiresAt?: string | null;
  paymentGateway: PaymentGateway;
  currency: Currency;
  mediaId?: string | null;
  media?: IPurchaseMedia | null;
}
