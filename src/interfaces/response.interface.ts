export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
  }
  
  export interface ErrorResponse {
    message: string;
    success: false;
    error: any;
  }