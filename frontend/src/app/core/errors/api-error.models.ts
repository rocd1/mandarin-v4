export interface ApiError {
  status: number;
  message: string | null;
  fieldErrors: Record<string, string[]>;
}