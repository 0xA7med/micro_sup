import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إعادة تهيئة البيانات...');

  // حذف جميع البيانات الحالية
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ تم حذف البيانات القديمة');

  // إنشاء مدير النظام
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: adminPassword,
      fullName: 'مدير النظام',
      role: 'admin',
    },
  });
  console.log('✅ تم إنشاء مدير النظام:', admin.username);

  // إنشاء مندوبين جدد
  const agents = [
    {
      username: 'ahmed',
      fullName: 'أحمد محمد',
      phone: '01002541564',
      address: 'سرابيوم الاسماعيلية',
    },
    {
      username: 'eslam',
      fullName: 'إسلام أحمد',
      phone: '01021139398',
      address: 'سرابيوم الاسماعيلية',
    },
    {
      username: 'mahmoud',
      fullName: 'محمود علي',
      phone: '01154238452',
      address: 'القاهرة حلوان',
    },
  ];

  for (const agentData of agents) {
    const agentPassword = await bcrypt.hash('agent123', 10);
    const agent = await prisma.user.create({
      data: {
        ...agentData,
        password: agentPassword,
        role: 'agent',
      },
    });
    console.log('✅ تم إنشاء مندوب جديد:', agent.username);
  }

  console.log('✅ تم إعادة تهيئة البيانات بنجاح');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إعادة تهيئة البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
