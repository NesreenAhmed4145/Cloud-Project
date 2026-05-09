# استخدام نسخة نود الرسمية
FROM node:20-alpine
# تحديد مسار العمل جوه الكونتينر
WORKDIR /app
# نسخ ملفات الـ package وتسطيب المكتبات
COPY package*.json ./
RUN npm install
# نسخ باقي كود المشروع
COPY . .
# تشغيل السيرفر
CMD ["npm", "run", "dev"]