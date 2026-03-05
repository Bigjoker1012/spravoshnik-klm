import { z } from "zod";
import { employeeSchema, departmentSchema } from "./schema";

export const errorSchemas = {
  internal: z.object({ message: z.string() }),
};

export const api = {
  employees: {
    list: {
      method: "GET" as const,
      path: "/api/employees" as const,
      responses: {
        200: z.object({
          employees: z.array(employeeSchema),
          departments: z.array(departmentSchema),
        }),
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
