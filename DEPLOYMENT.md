# 🚀 Быстрое развертывание QR Restaurant Menu

## Способ 1: Через v0 (самый простой)
1. Нажмите кнопку **"Deploy"** в правом верхнем углу чата v0
2. Следуйте инструкциям Vercel
3. Проект автоматически развернется с правильными настройками

## Способ 2: Ручное развертывание

### Шаг 1: Скачивание кода
1. Нажмите **"Download Code"** в правом верхнем углу блока кода
2. Распакуйте архив на компьютер

### Шаг 2: Развертывание на Vercel
1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите **"Add New..."** → **"Project"**
3. Выберите **"Upload"** или перетащите папку проекта
4. Нажмите **"Deploy"**

### Шаг 3: Настройка переменных окружения
После развертывания в Vercel Dashboard:

#### Environment Variables (Settings → Environment Variables):
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your-token
\`\`\`

### Шаг 4: Настройка Supabase
1. Создайте проект на [supabase.com](https://supabase.com)
2. Выполните SQL из файлов:
   - `scripts/001_create_tables.sql`
   - `scripts/002_seed_data.sql`

### Шаг 5: Настройка Vercel Blob
1. В Vercel Dashboard → Storage → Create Database → Blob
2. Название: `restaurant-images`
3. Скопируйте Read-Write Token
4. Добавьте в Environment Variables как `BLOB_READ_WRITE_TOKEN`

## ✅ Проверка развертывания
1. Откройте `your-domain.vercel.app`
2. Перейдите в `/admin` для проверки админ-панели
3. Проверьте статус сервисов в админке

## 🆘 Если что-то не работает
1. Проверьте логи в Vercel Dashboard → Functions
2. Убедитесь, что все переменные окружения добавлены
3. Проверьте статус в админ-панели `/admin`

---
**Время развертывания: ~5 минут**
