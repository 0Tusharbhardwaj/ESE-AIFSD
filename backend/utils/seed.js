const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('../models/Employee');
const User = require('../models/User');

dotenv.config();

const sampleEmployees = [
  {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@empai.com',
    department: 'Engineering',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Docker', 'Kubernetes', 'AWS'],
    performanceScore: 91,
    experience: 7,
    status: 'Active',
    role: 'Senior Engineer',
  },
  {
    name: 'Aman Verma',
    email: 'aman.verma@empai.com',
    department: 'Engineering',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'GraphQL'],
    performanceScore: 85,
    experience: 3,
    status: 'Active',
    role: 'Full Stack Developer',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@empai.com',
    department: 'Marketing',
    skills: ['SEO', 'Google Analytics', 'Content Strategy', 'Social Media', 'HubSpot'],
    performanceScore: 72,
    experience: 5,
    status: 'Active',
    role: 'Marketing Lead',
  },
  {
    name: 'Sneha Patel',
    email: 'sneha.patel@empai.com',
    department: 'HR',
    skills: ['Recruitment', 'HRMS', 'Excel', 'Employee Relations'],
    performanceScore: 58,
    experience: 2,
    status: 'On Leave',
    role: 'HR Executive',
  },
  {
    name: 'Arjun Singh',
    email: 'arjun.singh@empai.com',
    department: 'Sales',
    skills: ['CRM', 'Salesforce', 'Negotiation', 'B2B Sales', 'Cold Calling'],
    performanceScore: 69,
    experience: 4,
    status: 'Active',
    role: 'Sales Executive',
  },
  {
    name: 'Kavita Nair',
    email: 'kavita.nair@empai.com',
    department: 'Finance',
    skills: ['Financial Modeling', 'Excel', 'Power BI', 'SAP', 'GAAP'],
    performanceScore: 83,
    experience: 6,
    status: 'Active',
    role: 'Finance Analyst',
  },
  {
    name: 'Vikram Mehta',
    email: 'vikram.mehta@empai.com',
    department: 'Design',
    skills: ['Figma', 'Adobe XD', 'UI/UX', 'Prototyping', 'Design Systems'],
    performanceScore: 78,
    experience: 4,
    status: 'Active',
    role: 'UI/UX Designer',
  },
  {
    name: 'Deepa Krishnan',
    email: 'deepa.krishnan@empai.com',
    department: 'Engineering',
    skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL', 'Redis'],
    performanceScore: 88,
    experience: 8,
    status: 'Active',
    role: 'Backend Engineer',
  },
  {
    name: 'Ravi Gupta',
    email: 'ravi.gupta@empai.com',
    department: 'Sales',
    skills: ['Account Management', 'CRM', 'Presentation', 'Market Research'],
    performanceScore: 55,
    experience: 1,
    status: 'Active',
    role: 'Sales Associate',
  },
  {
    name: 'Ananya Reddy',
    email: 'ananya.reddy@empai.com',
    department: 'Marketing',
    skills: ['Email Marketing', 'Mailchimp', 'A/B Testing', 'Analytics', 'Copywriting'],
    performanceScore: 76,
    experience: 3,
    status: 'Active',
    role: 'Digital Marketer',
  },
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@empai.com',
  password: 'Admin@123',
  role: 'Admin',
};

const hrUser = {
  name: 'HR Manager',
  email: 'hr@empai.com',
  password: 'Hr@12345',
  role: 'HR',
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await Employee.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert employees
    const employees = await Employee.insertMany(sampleEmployees);
    console.log(`✅ Inserted ${employees.length} sample employees`);

    // Create admin and HR users
    await User.create(adminUser);
    await User.create(hrUser);
    console.log('✅ Created admin and HR users');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin → email: admin@empai.com | password: Admin@123');
    console.log('   HR    → email: hr@empai.com    | password: Hr@12345');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
