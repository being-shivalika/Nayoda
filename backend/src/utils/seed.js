/* eslint-disable no-console */
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");
const {
  User,
  Freelancer,
  Client,
  Gig,
  Proposal,
  Review,
  Notification,
} = require("../models");

async function seed() {
  await connectDB();
  console.log("Clearing existing data…");
  await Promise.all([
    User.deleteMany(),
    Freelancer.deleteMany(),
    Client.deleteMany(),
    Gig.deleteMany(),
    Proposal.deleteMany(),
    Review.deleteMany(),
    Notification.deleteMany(),
  ]);

  console.log("Creating users…");
  const admin = await User.create({
    firstName: "Admin",
    lastName: "User",
    email: "admin@skillsphere.io",
    password: "Password123!",
    role: "admin",
    isEmailVerified: true,
  });

  const clientUser = await User.create({
    firstName: "Nayoda",
    lastName: "Retail",
    email: "client@skillsphere.io",
    password: "Password123!",
    role: "client",
    isEmailVerified: true,
    location: { city: "Ludhiana", state: "Punjab", coordinates: [75.8573, 30.901] },
  });
  const client = await Client.create({ user: clientUser._id, companyName: "Nayoda Retail Pvt. Ltd." });

  const freelancerSeed = [
    { firstName: "Ananya", lastName: "Sharma", title: "Full-Stack MERN Developer", skills: [{ name: "React", level: "Expert" }, { name: "Node.js", level: "Expert" }, { name: "MongoDB", level: "Advanced" }], hourlyRate: 950 },
    { firstName: "Rohan", lastName: "Mehta", title: "Product & UI/UX Designer", skills: [{ name: "Figma", level: "Expert" }, { name: "Illustrator", level: "Advanced" }], hourlyRate: 700 },
    { firstName: "Simran", lastName: "Kaur", title: "Content Strategist & Copywriter", skills: [{ name: "Copywriting", level: "Expert" }, { name: "SEO", level: "Advanced" }], hourlyRate: 500 },
  ];

  const freelancers = [];
  for (const f of freelancerSeed) {
    const user = await User.create({
      firstName: f.firstName,
      lastName: f.lastName,
      email: `${f.firstName.toLowerCase()}@skillsphere.io`,
      password: "Password123!",
      role: "freelancer",
      isEmailVerified: true,
      location: { city: "Ludhiana", state: "Punjab", coordinates: [75.86 + Math.random() * 0.1, 30.9 + Math.random() * 0.1] },
    });
    const freelancer = await Freelancer.create({
      user: user._id,
      title: f.title,
      bio: `Experienced ${f.title.toLowerCase()} delivering hyperlocal freelance work.`,
      skills: f.skills,
      hourlyRate: f.hourlyRate,
      isVerified: true,
      verificationStatus: "approved",
      badges: ["Identity Verified"],
      reputationScore: 90,
      ratingAverage: 4.8,
      ratingCount: 40,
      completedJobs: 30,
    });
    freelancers.push({ user, freelancer });
  }

  console.log("Creating gigs…");
  const gig1 = await Gig.create({
    client: clientUser._id,
    title: "Build a React + Node E-commerce Storefront",
    description: "Looking for an experienced full-stack developer to build a storefront with cart, checkout, and an admin panel. Must integrate Razorpay and support milestone-based delivery across 3 phases.",
    category: "Web Development",
    skills: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    location: { city: "Ludhiana", state: "Punjab", coordinates: [75.8573, 30.901] },
    pricingType: "Milestone",
    budgetMin: 45000,
    budgetMax: 70000,
    milestones: [
      { name: "Design & Auth", amount: 15000 },
      { name: "Catalog & Cart", amount: 25000 },
      { name: "Checkout & Admin", amount: 30000 },
    ],
  });

  await Gig.create({
    client: clientUser._id,
    title: "Redesign Mobile Banking App UI",
    description: "We need a modern, minimal redesign for our banking app — onboarding, dashboard, and transfer flows.",
    category: "UI/UX Design",
    skills: ["Figma", "Prototyping"],
    location: { city: "Ludhiana", state: "Punjab" },
    isRemote: true,
    pricingType: "Fixed",
    budgetMin: 20000,
    budgetMax: 35000,
  });

  console.log("Creating a sample proposal…");
  await Proposal.create({
    gig: gig1._id,
    freelancer: freelancers[0].user._id,
    coverNote: "I've built 6 similar storefronts, including Razorpay escrow flows. Can start Monday.",
    bidAmount: 62000,
    estimatedDays: 21,
    matchScore: 97,
  });
  gig1.proposalCount = 1;
  await gig1.save();

  console.log("Seed complete. Demo accounts (password: Password123!):");
  console.log(`  Admin:      ${admin.email}`);
  console.log(`  Client:     ${clientUser.email}`);
  freelancers.forEach((f) => console.log(`  Freelancer: ${f.user.email}`));

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
