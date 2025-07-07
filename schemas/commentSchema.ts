import { z } from "zod";

export const commentFormSchema = z.object({
  productId: z.coerce.number().min(1, "Please select a product"),
  content: z.string().min(10, "Comment must be at least 10 characters long"),
  ratingCount: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  authorName: z.string().min(1, "Author name is required"),
  avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type CommentFormSchema = z.infer<typeof commentFormSchema>;