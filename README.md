# YashilKoʻz

Barg rasmidan oʻsimlik kasalligi, zararkunanda va oziq yetishmasligini aniqlaydigan oʻzbekcha AI ilova.

- **Tashxis:** Google Gemini API (bepul tarif)
- **Dala jurnali va akkaunt:** Supabase (bepul tarif)
- **Hosting:** Vercel (bepul Hobby tarifi)

## Tuzilishi

```
public/index.html        Ilovaning oʻzi (telefon uchun moslangan)
public/manifest.webmanifest, public/icon.svg   “Bosh ekranga qoʻshish” uchun
api/diagnose.js          Rasmni Geminiʼga yuboradi, tashxisni JSON qilib qaytaradi
api/config.js            Brauzerga Supabase manzili va ochiq kalitini beradi
lib/core.js              Prompt va javobni tekshirish
supabase/schema.sql      Jurnal jadvali va xavfsizlik qoidalari
```

## Ishga tushirish (taxminan 15 daqiqa)

### 1. Gemini API kaliti

1. [aistudio.google.com](https://aistudio.google.com) ga Google akkaunt bilan kiring.
2. **Get API key → Create API key** ni bosing va kalitni nusxalab oling.

### 2. Supabase (jurnal uchun)

1. [supabase.com](https://supabase.com) da bepul loyiha yarating.
2. **SQL Editor** ni oching, `supabase/schema.sql` faylidagi hamma matnni qoʻying va **Run** bosing.
3. Loyiha sozlamalaridagi **API** boʻlimidan **Project URL** va **anon** (yoki **publishable**) kalitni nusxalang.
   `service_role` / secret kalitni hech qachon ishlatmang.

### 3. Vercel

1. [vercel.com](https://vercel.com) ga GitHub akkauntingiz bilan kiring.
2. **Add New → Project** → `yashilkoz` repo'sini tanlang → **Import**.
3. **Environment Variables** ga uchta qiymat kiriting:

   | Nomi | Qiymati |
   |---|---|
   | `GEMINI_API_KEY` | 1-qadamdagi kalit |
   | `SUPABASE_URL` | Supabase Project URL |
   | `SUPABASE_ANON_KEY` | Supabase anon / publishable kalit |

4. **Deploy** ni bosing. Bir daqiqadan soʻng `https://<nom>.vercel.app` manzili tayyor boʻladi.

### 4. Supabaseʼni sayt manziliga ulash

Supabase → **Authentication → URL Configuration** → **Site URL** ga Vercel manzilingizni yozing.
Shunda roʻyxatdan oʻtish xatidagi havola saytingizga qaytaradi.

Tez sinash uchun **Authentication → Sign In / Providers → Email** boʻlimida **Confirm email** ni oʻchirib qoʻyish mumkin.
Supabaseʼning bepul pochta xizmati soatiga bir necha xat bilan cheklangan.

## Eslatmalar

- Gemini bepul tarifida daqiqa va kunlik soʻrov limiti bor. Limit tugasa, ilova “bir daqiqadan soʻng qayta urinib koʻring” deydi.
- Bepul tarifda yuborilgan rasmlar Google xizmatlarini yaxshilash uchun ishlatilishi mumkin.
- Modelni almashtirish uchun Vercelʼda `GEMINI_MODEL` qiymatini qoʻshing (standart: `gemini-2.5-flash`).
- Tashxisdan foydalanish uchun akkaunt shart emas. Jurnalga saqlash uchun akkaunt bilan kirish kerak.
- Oʻzgartirishlarni GitHubʼga push qilsangiz, Vercel saytni oʻzi yangilaydi.
