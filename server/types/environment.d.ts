declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      JWT_SECRET: string;
      PORT?: string;
      
      // Cloudinary Configuration
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      
      // SMTP Configuration
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      SMTP_FROM: string;
      
      [key: string]: string | undefined;
    }
  }
}

export {};