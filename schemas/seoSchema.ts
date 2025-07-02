import { z } from "zod";


// //   type: z.nativeEnum(SocialType),
//   url: z.string().url(),

export const seoSchemaZod =z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.string(),
  slug: z.string(),
  canonicalUrl: z.string(),
  altText: z.string(),
  ogTitle: z.string(),
  ogDescription: z.string(),
  ogImage:z.string() ,
  robotsIndex: z.boolean().default(true).optional(),
  robotsFollow:  z.boolean().default(true).optional(),
  xmlSitemap:  z.boolean().default(true).optional(),
  structuredData:  z.boolean().default(true).optional()

});