import dotenv from "dotenv";
import app from "./app";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server only in development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
  });
}

// Export for Vercel
export default app;
