import { z } from "zod";

export const issueSchema = z.object({
  title: z.string().min(3),

  description: z.string().min(5),

  category: z.string(),

  priority: z.string(),

  latitude: z.coerce.number(),

  longitude: z.coerce.number(),

  address: z.string(),
});