// Simple script to create initial user in production database
// Run with: heroku run node scripts/create-initial-user.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createInitialUser() {
  try {
    console.log('Creating initial user...');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' },
    });

    if (existingUser) {
      console.log('User demo@example.com already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        name: 'Demo User',
        password: hashedPassword,
      },
    });

    console.log('✅ Initial user created successfully!');
    console.log('Email: demo@example.com');
    console.log('Password: password123');
    console.log('User ID:', user.id);

  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialUser();
