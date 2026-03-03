import { z } from "zod";

export const employeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string(),
  department: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  photo: z.string(),
});

export type Employee = z.infer<typeof employeeSchema>;
