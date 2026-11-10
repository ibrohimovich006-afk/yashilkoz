# YashilKo‘z

Barg rasmidan o‘simlik kasalligi, zararkunanda va oziq yetishmasligini aniqlaydigan o‘zbekcha AI ilova.

- **Tashxis:** Google Gemini API (bepul tarif)
- **Dala jurnali va akkaunt:** Supabase (bepul tarif)
- **Hosting:** Vercel (bepul Hobby tarifi)

## Tuzilishi

```
public/index.html        Ilovaning o‘zi (telefon uchun moslangan)
public/manifest.webmanifest, public/icon.svg   “Bosh ekranga qo‘shish” uchun
api/diagnose.js          Rasmni Gemini’ga yuboradi, tashxisni JSON qilib qaytaradi
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
2. **SQL Editor** ni oching, `supabase/schema.sql` faylidagi hamma matnni qo‘ying va **Run** bosing.
3. Loyiha sozlamalaridagi **API** bo‘limidan **Project URL** va **anon** (yoki **publishable**) kalitni nusxalang.
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

4. **Deploy** ni bosing. Bir daqiqadan so‘ng `https://<nom>.vercel.app` manzili tayyor bo‘ladi.

### 4. Supabase’ni sayt manziliga ulash

Supabase → **Authentication → URL Configuration** → **Site URL** ga Vercel manzilingizni yozing.
Shunda ro‘yxatdan o‘tish xatidagi havola saytingizga qaytaradi.

Tez sinash uchun **Authentication → Sign In / Providers → Email** bo‘limida **Confirm email** ni o‘chirib qo‘yish mumkin.
Supabase’ning bepul pochta xizmati soatiga bir necha xat bilan cheklangan.

## Eslatmalar

- Gemini bepul tarifida daqiqa va kunlik so‘rov limiti bor. Limit tugasa, ilova “bir daqiqadan so‘ng qayta urinib ko‘ring” deydi.
- Bepul tarifda yuborilgan rasmlar Google xizmatlarini yaxshilash uchun ishlatilishi mumkin.
- Modelni almashtirish uchun Vercel’da `GEMINI_MODEL` qiymatini qo‘shing (standart: `gemini-2.5-flash`).
- Tashxisdan foydalanish uchun akkaunt shart emas. Jurnalga saqlash uchun akkaunt bilan kirish kerak.
- O‘zgartirishlarni GitHub’ga push qilsangiz, Vercel saytni o‘zi yangilaydi.
