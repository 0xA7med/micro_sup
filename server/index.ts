import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(join(__dirname, '../dist')));

// Auth routes
app.get('/api/auth/check-admin', async (req, res) => {
  try {
    const admin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });
    res.json({ exists: !!admin });
  } catch (error) {
    console.error('Error checking admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/create-admin', async (req, res) => {
  try {
    const { username, password, fullName, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        fullName,
        role,
      },
    });
    res.json(admin);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/create-agent', async (req, res) => {
  try {
    const { username, password, fullName, phone, address } = req.body;
    
    // التحقق من وجود المندوب
    const existingAgent = await prisma.user.findUnique({
      where: { username }
    });

    if (existingAgent) {
      return res.status(400).json({ error: 'اسم المستخدم موجود بالفعل' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const agent = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        fullName,
        role: 'agent',
        phone,
        address,
      },
    });

    const { password: _, ...agentWithoutPassword } = agent;
    res.json(agentWithoutPassword);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'فشل في إنشاء المندوب' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password });

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    console.log('Found user:', user);

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    console.log('Sending user data:', userWithoutPassword);
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Agent routes
app.get('/api/agents', async (req, res) => {
  try {
    console.log('[GET /api/agents] جاري البحث عن المندوبين...');
    const agents = await prisma.user.findMany({
      where: {
        role: 'agent',
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            customers: true
          }
        }
      }
    });

    // تحويل البيانات إلى الشكل المطلوب
    const formattedAgents = agents.map(agent => ({
      ...agent,
      customerCount: agent._count.customers,
      _count: undefined
    }));

    console.log('[GET /api/agents] تم العثور على المندوبين:', formattedAgents);
    res.json({
      success: true,
      data: formattedAgents
    });
  } catch (error) {
    console.error('[GET /api/agents] خطأ في جلب المندوبين:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents'
    });
  }
});

app.post('/api/agents/create', async (req, res) => {
  const { username, password, fullName, phone, address } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAgent = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        fullName,
        role: 'agent',
        phone,
        address,
      },
    });
    res.json(newAgent);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
});

app.put('/api/agents/:id', async (req, res) => {
  const agentId = parseInt(req.params.id);
  const { username, fullName, phone, address } = req.body;

  try {
    const updatedAgent = await prisma.user.update({
      where: { id: agentId },
      data: {
        username,
        fullName,
        phone,
        address,
      },
    });
    res.json(updatedAgent);
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
});

app.delete('/api/agents/:id', async (req, res) => {
  const agentId = parseInt(req.params.id);

  try {
    await prisma.user.delete({
      where: { id: agentId },
    });
    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
});

app.post('/api/agents/transfer-customers', async (req, res) => {
  try {
    const { fromAgentId, toAgentId } = req.body;

    // Get the target agent
    const toAgent = await prisma.user.findUnique({
      where: { id: toAgentId },
    });

    if (!toAgent) {
      return res.status(400).json({ message: 'Target agent not found' });
    }

    // Update customers to the new agent
    await prisma.customer.updateMany({
      where: { agentId: fromAgentId },
      data: { agentId: toAgentId },
    });

    res.json({ message: 'Customers transferred successfully' });
  } catch (error) {
    console.error('Error transferring customers:', error);
    res.status(500).json({ error: 'Failed to transfer customers' });
  }
});

// Customer routes
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.post('/api/customers/create', async (req, res) => {
  const { 
    customerName, 
    businessName, 
    businessType, 
    phone, 
    address, 
    activationCode, 
    subscriptionType, 
    versionType, 
    deviceCount, 
    subscriptionStart,
    subscriptionEnd,
    notes,
    agentId
  } = req.body;

  try {
    const newCustomer = await prisma.customer.create({
      data: {
        customerName,
        businessName,
        businessType,
        phone,
        address,
        activationCode,
        subscriptionType,
        versionType,
        deviceCount,
        subscriptionStart: new Date(subscriptionStart),
        subscriptionEnd: new Date(subscriptionEnd),
        notes,
        agentId
      },
    });
    res.json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer', details: error });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  const customerId = parseInt(req.params.id);
  const { customerName, businessName, businessType, phone, address, activationCode, subscriptionType, versionType, deviceCount, agentId } = req.body;

  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        customerName,
        businessName,
        businessType,
        phone,
        address,
        activationCode,
        subscriptionType,
        versionType,
        deviceCount,
        agentId,
      },
    });
    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  const customerId = parseInt(req.params.id);

  try {
    await prisma.customer.delete({
      where: { id: customerId },
    });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Stats routes
app.get('/api/stats', async (req, res) => {
  try {
    const totalCustomers = await prisma.customer.count();
    const totalAgents = await prisma.user.count({
      where: {
        role: 'agent',
      },
    });
    const recentCustomers = await prisma.customer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    res.json({
      totalCustomers,
      totalAgents,
      recentCustomers,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Debug routes
app.get('/api/debug/check-users', async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();
    const agents = await prisma.user.findMany({
      where: {
        role: 'agent',
      },
    });
    res.json({ allUsers, agents });
  } catch (error) {
    console.error('Error checking users:', error);
    res.status(500).json({ error: String(error) });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
