// import z from "zod";

import z from "zod";

// export const createParcelZodSchema = z.object({
//   senderInfo: z.object({
//     userId: z.string(),
//     name: z.string(),
//     address: z.string(),
//     phone: z.string(),
//   }),
//   receiverInfo: z.object({
//     userId: z.string(),
//     name: z.string(),
//     address: z.string(),
//     phone: z.string(),
//   }),
//   type: z.string(),
//   weight: z.number(),
//   deliveryAddress: z.string(),
// });

// addressShape can be reused

const addressSchema = z.object({
  userId: z.string().optional(),
  name: z.string().optional(),
  label: z.string(),
  state: z.string(),
  city: z.string(),
  postalCode: z.string(),
  street: z.string(),
  country: z.string(),
  phone: z.string(),
});

export const createParcelZodSchema = z.object({
  senderInfo: addressSchema,
  receiverInfo: addressSchema,
  type: z.enum(["Box", "Envelope", "Document", "Packet"]),
  weight: z.number().positive().max(50),
});
