# MicroSup - نظام إدارة المندوبين والعملاء

نظام لإدارة المندوبين والعملاء يتيح للمديرين إدارة المندوبين وتتبع العملاء.

## المميزات

- إدارة المندوبين (إضافة، حذف، تعديل)
- إدارة العملاء (إضافة، حذف، تعديل)
- نظام مصادقة متكامل
- واجهة مستخدم عربية
- تصميم متجاوب

## المتطلبات

- Node.js (v14 أو أحدث)
- PostgreSQL
- npm أو yarn

## التثبيت

1. استنسخ المشروع:
```bash
git clone https://github.com/[your-username]/microsup.git
cd microsup
```

2. ثبت الاعتماديات:
```bash
npm install
```

3. أنشئ ملف `.env` وأضف المتغيرات البيئية:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/microsup"
JWT_SECRET="your-secret-key"
```

4. قم بإعداد قاعدة البيانات:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. ابدأ الخادم:
```bash
npm run server
```

6. ابدأ تطبيق الواجهة الأمامية:
```bash
npm run dev
```

## بيانات تسجيل الدخول الافتراضية

### مدير النظام
- اسم المستخدم: `admin`
- كلمة المرور: `admin123`

### المندوبين
- اسم المستخدم: `ahmed` / كلمة المرور: `agent123`
- اسم المستخدم: `eslam` / كلمة المرور: `agent123`
- اسم المستخدم: `mahmoud` / كلمة المرور: `agent123`

## المساهمة

نرحب بمساهماتكم! يرجى إنشاء fork للمشروع وإرسال pull request.

## الترخيص

[MIT](LICENSE)
