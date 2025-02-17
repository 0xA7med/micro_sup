const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

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

  const createdAgents = [];
  for (const agentData of agents) {
    const agent = await prisma.user.create({
      data: {
        ...agentData,
        password: await bcrypt.hash('agent123', 10),
        role: 'agent',
      },
    });
    createdAgents.push(agent);
    console.log('✅ تم إنشاء مندوب:', agent.username);
  }

  // إنشاء عملاء للاختبار
  const customers = [
    {
      customerName: 'محمد أحمد',
      businessName: 'مطعم السعادة',
      businessType: 'مطعم',
      phone: '0551234567',
      address: 'شارع الملك فهد',
      activationCode: 'ABC123',
      subscriptionType: 'سنوي',
      versionType: 'برو',
      deviceCount: 2,
      agentId: createdAgents[0].id,
    },
    {
      customerName: 'علي محمد',
      businessName: 'صيدلية الصحة',
      businessType: 'صيدلية',
      phone: '0557654321',
      address: 'شارع العليا',
      activationCode: 'XYZ789',
      subscriptionType: 'شهري',
      versionType: 'لايت',
      deviceCount: 1,
      agentId: createdAgents[1].id,
    },
  ];

  for (const customerData of customers) {
    const customer = await prisma.customer.create({
      data: {
        ...customerData,
        subscriptionStart: new Date(),
        subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });
    console.log('✅ تم إنشاء عميل:', customer.customerName);
  }

  console.log('✨ تم الانتهاء من إعادة تهيئة البيانات بنجاح!');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إعادة تهيئة البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
