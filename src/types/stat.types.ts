export interface UserDashboardStats {
  userName: string;
  watchlistCount: number;
  purchasesCount: number;
  rentalsCount: number;
  reviewsCount: number;
  subscription?: {
    active: boolean;
    planName: string;
    expiresAt: string;
  };
}