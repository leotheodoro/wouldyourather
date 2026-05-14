import { z } from 'zod';

export const dilemmaResponseSchema = z.object({
  consequence: z.string(),
  dilemma: z.string().min(10),
  choices: z.tuple([z.string().min(1), z.string().min(1)]),
});

export const archetypeProfileSchema = z.object({
  archetypeName: z.string().min(1),
  quote: z.string().min(1),
  traits: z.object({
    empathy: z.number().min(0).max(100),
    pragmatism: z.number().min(0).max(100),
    chaos: z.number().min(0).max(100),
    cruelty: z.number().min(0).max(100),
  }),
  historicalFigure: z.object({
    name: z.string().min(1),
    reason: z.string().min(1),
  }),
  verdict: z.string().min(1),
});

export const historyItemSchema = z.object({
  dilemma: z.string(),
  choices: z.tuple([z.string(), z.string()]),
  chosen: z.union([z.literal(0), z.literal(1)]),
  consequence: z.string(),
});
