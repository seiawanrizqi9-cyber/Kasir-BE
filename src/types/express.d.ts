declare namespace Express {
  interface Request {
    user: {
      userId: string;
      storeId: string | null;
    };
  }
}