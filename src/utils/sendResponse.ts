import { Response } from "express";
interface TMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  sortBy?: string;
  order?: "asc" | "desc";
  filter?: Record<string, string | number>;
}
interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: TMeta;
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
