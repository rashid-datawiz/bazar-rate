
import type { Category, Product } from "@/types/product";

const API_BASE_URL =
  process.env.BAZARDOR_API_URL ??
  "https://api.abcz.workers.dev/api/bazardor";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pick(
  object: UnknownRecord,
  keys: string[],
): unknown {
  for (const key of keys) {
    if (object[key] !== undefined && object[key] !== null) {
      return object[key];
    }
  }
  return undefined;
}

function toText(value: unknown, fallback = ""): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value
      .replace(/[০-৯]/g, (digit) =>
        String("০১২৩৪৫৬৭৮৯".indexOf(digit)),
      )
      .replace(/[,\s৳টাকা]/g, "");

    const result = Number(normalized);
    if (Number.isFinite(result)) return result;
  }

  return fallback;
}

function getArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;

  if (isRecord(payload)) {
    for (const key of ["data", "products", "categories", "results"]) {
      if (Array.isArray(payload[key])) return payload[key] as unknown[];
    }
  }

  return [];
}

async function request(path: string): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(
      `BazarDor API failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

const CATEGORY_EMOJIS: Record<string, string> = {
  chal: "🍚",
  rice: "🍚",
  vegetables: "🥬",
  sobji: "🥬",
  fish: "🐟",
  mach: "🐟",
  meat: "🍗",
  mangsho: "🍗",
  oil: "🫙",
  tel: "🫙",
  egg: "🥚",
  dim: "🥚",
  fruits: "🍎",
  fol: "🍎",
  spices: "🌶️",
  mosla: "🌶️",
};

function inferEmoji(category: string, name: string): string {
  const key = `${category} ${name}`.toLowerCase();

  if (/onion|peyaj|পেঁয়াজ|পিঁয়াজ/.test(key)) return "🧅";
  if (/potato|alu|আলু/.test(key)) return "🥔";
  if (/garlic|roshun|রসুন/.test(key)) return "🧄";
  if (/ginger|ada|আদা/.test(key)) return "🫚";
  if (/egg|dim|ডিম/.test(key)) return "🥚";
  if (/fish|mach|মাছ/.test(key)) return "🐟";
  if (/oil|tel|তেল/.test(key)) return "🫙";
  if (/chili|morich|মরিচ/.test(key)) return "🌶️";
  if (/rice|chal|চাল/.test(key)) return "🍚";
  if (/meat|chicken|মাংস|মুরগি/.test(key)) return "🍗";

  for (const [term, emoji] of Object.entries(CATEGORY_EMOJIS)) {
    if (key.includes(term)) return emoji;
  }

  return "🛒";
}

function normalizeMarketPrices(value: unknown): Product["marketPrices"] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!isRecord(item)) return [];

    const price = toNumber(
      pick(item, ["price", "currentPrice", "current_price", "amount"]),
      NaN,
    );

    if (!Number.isFinite(price)) return [];

    const market = toText(
      pick(item, ["market", "marketName", "market_name", "name"]),
      "স্থানীয় বাজার",
    );

    return [{ market, price }];
  });
}

function normalizeProduct(value: unknown): Product | null {
  if (!isRecord(value)) return null;

  const id = toText(pick(value, ["id", "_id", "productId", "product_id"]));
  const name = toText(pick(value, ["name", "title", "productName", "product_name"]));

  if (!id || !name) return null;

  const categoryValue = pick(value, [
    "categorySlug",
    "category_slug",
    "category",
    "categoryId",
    "category_id",
  ]);

  const category = isRecord(categoryValue)
    ? toText(pick(categoryValue, ["slug", "id", "name"]), "other")
    : toText(categoryValue, "other");

  const slug = toText(pick(value, ["slug", "productSlug", "product_slug"]), id);

  const price = toNumber(
    pick(value, ["price", "currentPrice", "current_price", "todayPrice", "today_price"]),
    NaN,
  );

  if (!Number.isFinite(price)) return null;

  const previousRaw = pick(value, [
    "previousPrice",
    "previous_price",
    "oldPrice",
    "old_price",
    "yesterdayPrice",
    "yesterday_price",
  ]);

  const previousPrice =
    previousRaw === undefined
      ? undefined
      : toNumber(previousRaw, NaN);

  const explicitChange = pick(value, [
    "priceChange",
    "price_change",
    "changePercent",
    "change_percent",
    "changePercentage",
    "change_percentage",
  ]);

  const priceChange =
    explicitChange !== undefined
      ? toNumber(explicitChange)
      : previousPrice !== undefined &&
          Number.isFinite(previousPrice) &&
          previousPrice !== 0
        ? ((price - previousPrice) / previousPrice) * 100
        : 0;

  const marketPrices = normalizeMarketPrices(
    pick(value, ["marketPrices", "market_prices", "markets", "prices"]),
  );

  return {
    id,
    slug,
    name,
    category,
    categoryName: toText(
      pick(value, ["categoryName", "category_name"]),
      category,
    ),
    image: toText(pick(value, ["image", "imageUrl", "image_url"])) || undefined,
    emoji: toText(pick(value, ["emoji", "icon"]), inferEmoji(category, name)),
    unit: toText(pick(value, ["unit", "unitName", "unit_name"]), "প্রতি কেজি"),
    price,
    previousPrice:
      previousPrice !== undefined && Number.isFinite(previousPrice)
        ? previousPrice
        : undefined,
    priceChange,
    description: toText(pick(value, ["description", "details"])) || undefined,
    marketPrices,
  };
}

function normalizeCategory(value: unknown): Category | null {
  if (!isRecord(value)) return null;

  const id = toText(pick(value, ["id", "_id", "slug", "categoryId"]));
  const name = toText(pick(value, ["name", "title", "categoryName"]));

  if (!id || !name) return null;

  const slug = toText(pick(value, ["slug"]), id);

  return {
    id,
    slug,
    name,
    emoji: toText(pick(value, ["emoji", "icon"]), inferEmoji(slug, name)),
  };
}

export async function getProducts(category?: string): Promise<Product[]> {
  const query = category
    ? `?category=${encodeURIComponent(category)}`
    : "";

  const payload = await request(`/products${query}`);

  return getArray(payload)
    .map(normalizeProduct)
    .filter((product): product is Product => product !== null);
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  const payload = await request(`/products/${encodeURIComponent(idOrSlug)}`);

  const candidate =
    isRecord(payload) && "data" in payload && isRecord(payload.data)
      ? payload.data
      : payload;

  return normalizeProduct(candidate);
}

export async function getCategories(): Promise<Category[]> {
  const payload = await request("/categories");

  return getArray(payload)
    .map(normalizeCategory)
    .filter((category): category is Category => category !== null);
}

export async function getCategory(slug: string): Promise<Category | null> {
  const payload = await request(`/categories/${encodeURIComponent(slug)}`);

  const candidate =
    isRecord(payload) && "data" in payload && isRecord(payload.data)
      ? payload.data
      : payload;

  return normalizeCategory(candidate);
}
