import { z } from "zod";

export const employeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string(),
  employeeCode: z.string(),
  supervisorCode: z.string(),
  departmentId: z.string(),
  workPhone: z.string().optional(),
  personalPhone: z.string().optional(),
  internalExt: z.string().optional(),
  email: z.string().optional(),
  birthday: z.string().optional(),
  photo: z.string().optional(),
});

export type Employee = z.infer<typeof employeeSchema>;

export const departmentSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Department = z.infer<typeof departmentSchema>;
