// Shared logic for the diagnosis API: prompt, JSON parsing and normalization.

export const STATUS_KEYS = ['soglom', 'kasallik', 'zararkunanda', 'oziq_yetishmasligi', 'noaniq'];
export const SEVERITY_KEYS = ['yengil', 'orta', 'ogir'];

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const str = (x, n) => (typeof x === 'string' ? x.trim().slice(0, n) : '');
const list = (x) =>
  Array.isArray(x)
    ? x.filter((s) => typeof s === 'string' && s.trim()).slice(0, 5).map((s) => s.trim().slice(0, 220))
    : [];

export function buildPrompt(crop, note) {
  return `You are YashilKoʻz, an agronomy assistant for farmers in Uzbekistan. Look at the attached photo of a plant (usually a leaf) and diagnose its condition: a disease, a pest, a nutrient deficiency, or healthy.

Farmer's hint about the crop: ${crop || 'not given'}
Farmer's note: ${note || 'none'}

Rules:
- Write every text value in Uzbek, Latin script, in plain words a farmer understands. Write oʻ and gʻ with the ʻ character and use ʼ for the tutuq belgisi.
- Base the diagnosis only on what is visible. If the photo is unclear, too far away, or the symptoms fit several causes, lower "ishonch" and explain in "qoshimcha_rasm" what photo would help.
- "ishonch" is your honest confidence (0-100) in the main diagnosis. Do not inflate it.
- "holat": soglom (healthy), kasallik (disease: fungal, bacterial or viral), zararkunanda (insects, mites and other pests), oziq_yetishmasligi (nutrient deficiency), noaniq (cannot tell).
- "davolash_kimyoviy": name the active ingredient or product class (for example mis saqlovchi fungitsid, mankotseb, akaritsid) and say when and how to apply. Never give doses or concentrations; the dose always comes from the product label. Leave it empty for healthy plants.
- "davolash_organik": at least one organic or agronomic measure when the plant is not healthy.
- "oldini_olish": 2-4 prevention tips.
- Each list item is one short sentence under 110 characters; 2-4 items per list.
- "muqobil_tashxislar": up to 2 other likely causes with their confidence, or an empty list.
- "ovoz_matni": 2-4 short, simple sentences summarizing the result for reading aloud.
- If the photo does not show a plant, set "rasm_turi" to "osimlik_emas" and leave the other text fields empty.

Reply with only this JSON object:
{"rasm_turi":"osimlik|osimlik_emas|aniq_emas","ekin":"","holat":"soglom|kasallik|zararkunanda|oziq_yetishmasligi|noaniq","tashxis":"","ilmiy_nomi":"","ishonch":0,"ogirlik":"yengil|orta|ogir or empty","belgilar":[],"davolash_kimyoviy":[],"davolash_organik":[],"oldini_olish":[],"muqobil_tashxislar":[{"nomi":"","ishonch":0}],"qoshimcha_rasm":"","ovoz_matni":""}`;
}

export function parseJson(text) {
  if (typeof text !== 'string' || !text.trim()) return null;
  const tries = [text];
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) tries.push(fence[1]);
  const a = text.indexOf('{'), b = text.lastIndexOf('}');
  if (a !== -1 && b > a) tries.push(text.slice(a, b + 1));
  for (const t of tries) {
    try {
      const v = JSON.parse(t);
      if (v && typeof v === 'object' && !Array.isArray(v)) return v;
    } catch (e) { /* try next */ }
  }
  return null;
}

export function normalize(r) {
  r = r && typeof r === 'object' && !Array.isArray(r) ? r : {};
  return {
    rasm_turi: ['osimlik', 'osimlik_emas', 'aniq_emas'].includes(r.rasm_turi) ? r.rasm_turi : 'osimlik',
    ekin: str(r.ekin, 60),
    holat: STATUS_KEYS.includes(r.holat) ? r.holat : 'noaniq',
    tashxis: str(r.tashxis, 120),
    ilmiy_nomi: str(r.ilmiy_nomi, 120),
    ishonch: clamp(Math.round(Number(r.ishonch) || 0), 0, 100),
    ogirlik: SEVERITY_KEYS.includes(r.ogirlik) ? r.ogirlik : '',
    belgilar: list(r.belgilar),
    davolash_kimyoviy: list(r.davolash_kimyoviy),
    davolash_organik: list(r.davolash_organik),
    oldini_olish: list(r.oldini_olish),
    muqobil_tashxislar: Array.isArray(r.muqobil_tashxislar)
      ? r.muqobil_tashxislar
          .filter((m) => m && typeof m.nomi === 'string' && m.nomi.trim())
          .slice(0, 2)
          .map((m) => ({ nomi: str(m.nomi, 100), ishonch: clamp(Math.round(Number(m.ishonch) || 0), 0, 100) }))
      : [],
    qoshimcha_rasm: str(r.qoshimcha_rasm, 240),
    ovoz_matni: str(r.ovoz_matni, 600)
  };
}
