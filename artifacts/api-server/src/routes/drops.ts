import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  GenerateDropsBody,
  GenerateDropsResponse,
  GetDropStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const DROP_TYPES = ["movie", "legend", "arcade", "band", "story"] as const;
const CATEGORIES = ["Horror", "Comedy", "Rave", "Street", "Retro", "Weird", "Mixed"] as const;

type DropCategory = (typeof CATEGORIES)[number];

const generationLog: { name: string; category: DropCategory; type: string; timestamp: Date }[] = [];

function seededRandom(seed: string, index: number): number {
  let hash = 0;
  const str = seed + String(index);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash) / 2147483647;
}

function buildSystemPrompt(category?: string, seed?: string): string {
  const categoryInstruction = category && category !== "Mixed"
    ? `The drop should fit the "${category}" category/vibe.`
    : "Choose any category from: Horror, Comedy, Rave, Street, Retro, Weird, or Mixed.";

  const seedInstruction = seed
    ? `Universe seed: "${seed}". Use this to create a consistent universe flavor across drops.`
    : "";

  return `You are a creative street designer, meme culture archivist, and underground DJ naming tracks at 3am in Johannesburg. You generate fictional South African underground cultural artifacts for the BML Universe.

Your tone: slightly unhinged but clever. Think township myth meets rave poster meets streetwear parody. Surreal. Dark humor. SA internet culture. Aliens, glitch worlds, arcade universes, horror, comedy — all welcome.

${categoryInstruction}
${seedInstruction}

Generate one fictional cultural drop. Respond ONLY with valid JSON in this exact format:
{
  "name": "The main title (could be a fake movie title, street legend name, arcade game, band/collective name, or meme story title)",
  "type": "movie|legend|arcade|band|story",
  "category": "Horror|Comedy|Rave|Street|Retro|Weird|Mixed",
  "lore": "2-4 lines of whispered storytelling. Should feel like something people would whisper about in a taxi or at a braai. Dark, surreal, or funny.",
  "tshirtConcept": {
    "fonts": "Font style description (e.g. 'cracked graffiti caps mixed with retro VHS italic')",
    "colors": "Color palette (e.g. 'blood orange on midnight black, lime green accent')",
    "symbols": "Visual symbols and imagery (e.g. 'broken TV sets, a taxi with wings, upside-down Eiffel Tower')",
    "vibe": "Overall design vibe in one vivid sentence"
  },
  "tagline": "One punchy, ironic, or surreal line. Could be a fake slogan, a warning, or a meme."
}

Rules:
- NEVER be corporate or generic
- NEVER mention "BML" explicitly — it's a universe, not a brand
- DO include surreal SA cultural references (load shedding, taxis, braai, kasi, pantsula, gqom, kwaito, etc.) but don't be stereotypical — remix them
- DO mix genres unexpectedly (horror comedy, rave legend, retro arcade horror)
- ALWAYS be funny, dark, or surreal — never boring
- Names should feel real enough to be on a poster but fake enough to be lore`;
}

router.post("/drops/generate", async (req, res): Promise<void> => {
  const parsed = GenerateDropsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { filter, count = 1, seed } = parsed.data;

  const drops = [];

  const promises = Array.from({ length: count }, async (_, i) => {
    const userSeed = seed ? `${seed}-${i}` : undefined;
    const systemPrompt = buildSystemPrompt(filter, userSeed);

    const userMessage = seed
      ? `Generate drop #${i + 1} for universe seed "${seed}". Keep it consistent with the universe flavor.`
      : `Generate a fresh BML universe drop${filter && filter !== "Mixed" ? ` in the "${filter}" style` : ""}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const raw = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    const drop = {
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
      name: raw.name ?? "Unknown Entity",
      type: DROP_TYPES.includes(raw.type) ? raw.type : "story",
      category: CATEGORIES.includes(raw.category) ? raw.category : (filter && CATEGORIES.includes(filter as DropCategory) ? filter : "Weird") as DropCategory,
      lore: raw.lore ?? "Lost to the ether.",
      tshirtConcept: {
        fonts: raw.tshirtConcept?.fonts ?? "Bold graffiti caps",
        colors: raw.tshirtConcept?.colors ?? "Black on black with a hint of chaos",
        symbols: raw.tshirtConcept?.symbols ?? "Abstract chaos",
        vibe: raw.tshirtConcept?.vibe ?? "Distorted reality",
      },
      tagline: raw.tagline ?? "You were never here.",
      generatedAt: new Date().toISOString(),
    };

    generationLog.push({
      name: drop.name,
      category: drop.category,
      type: drop.type,
      timestamp: new Date(),
    });

    return drop;
  });

  const results = await Promise.all(promises);
  drops.push(...results);

  res.json(GenerateDropsResponse.parse(drops));
});

router.get("/drops/stats", async (req, res): Promise<void> => {
  const totalGenerated = generationLog.length;

  const categoryBreakdown: Record<string, number> = {};
  const typeBreakdown: Record<string, number> = {};

  for (const log of generationLog) {
    categoryBreakdown[log.category] = (categoryBreakdown[log.category] ?? 0) + 1;
    typeBreakdown[log.type] = (typeBreakdown[log.type] ?? 0) + 1;
  }

  const recentDropNames = generationLog
    .slice(-10)
    .reverse()
    .map((l) => l.name);

  res.json(
    GetDropStatsResponse.parse({
      totalGenerated,
      categoryBreakdown,
      typeBreakdown,
      recentDropNames,
    })
  );
});

export default router;
