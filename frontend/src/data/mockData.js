// Central mock data store for the SkillSphere frontend demo.

export const categories = [
  "Web Development", "Mobile Apps", "UI/UX Design", "Graphic Design",
  "Content Writing", "Video Editing", "Home Repair", "Photography",
  "Tutoring", "Digital Marketing",
];

export const skillsPool = [
  "React", "Node.js", "MongoDB", "Figma", "Python", "Copywriting",
  "Premiere Pro", "SEO", "TypeScript", "Tailwind CSS", "Illustrator",
  "WordPress", "Electrical Wiring", "Plumbing", "Portrait Photography",
];

export const freelancers = [
  {
    id: "f1",
    name: "Ananya Sharma",
    title: "Full-Stack MERN Developer",
    location: "Ludhiana, Punjab",
    distanceKm: 2.4,
    avatar: "AS",
    rating: 4.9,
    reviewCount: 128,
    reputationScore: 96,
    verified: true,
    hourlyRate: 950,
    skills: [
      { name: "React", level: "Expert" },
      { name: "Node.js", level: "Expert" },
      { name: "MongoDB", level: "Advanced" },
      { name: "Tailwind CSS", level: "Expert" },
    ],
    completedJobs: 84,
    responseTime: "under 1 hour",
    bio: "Full-stack engineer specializing in production-grade MERN applications, real-time systems and payment integrations.",
    badges: ["Top Rated", "Identity Verified", "Rising Talent"],
  },
  {
    id: "f2",
    name: "Rohan Mehta",
    title: "Product & UI/UX Designer",
    location: "Ludhiana, Punjab",
    distanceKm: 5.1,
    avatar: "RM",
    rating: 4.8,
    reviewCount: 96,
    reputationScore: 92,
    verified: true,
    hourlyRate: 700,
    skills: [
      { name: "Figma", level: "Expert" },
      { name: "Illustrator", level: "Advanced" },
      { name: "Prototyping", level: "Expert" },
    ],
    completedJobs: 61,
    responseTime: "under 2 hours",
    bio: "I design clean, minimal interfaces for startups — from wireframe to production-ready design system.",
    badges: ["Identity Verified"],
  },
  {
    id: "f3",
    name: "Simran Kaur",
    title: "Content Strategist & Copywriter",
    location: "Jalandhar, Punjab",
    distanceKm: 18.6,
    avatar: "SK",
    rating: 4.7,
    reviewCount: 74,
    reputationScore: 88,
    verified: true,
    hourlyRate: 500,
    skills: [
      { name: "Copywriting", level: "Expert" },
      { name: "SEO", level: "Advanced" },
    ],
    completedJobs: 53,
    responseTime: "under 3 hours",
    bio: "Helping brands find their voice — SEO content, product copy and long-form articles that convert.",
    badges: ["Verified Reviews"],
  },
  {
    id: "f4",
    name: "Karan Verma",
    title: "Electrician & Home Systems",
    location: "Ludhiana, Punjab",
    distanceKm: 3.8,
    avatar: "KV",
    rating: 4.95,
    reviewCount: 210,
    reputationScore: 98,
    verified: true,
    hourlyRate: 400,
    skills: [
      { name: "Electrical Wiring", level: "Expert" },
      { name: "Home Automation", level: "Advanced" },
    ],
    completedJobs: 190,
    responseTime: "under 30 minutes",
    bio: "Licensed electrician, 9 years hyperlocal service — wiring, panel upgrades and smart home installs.",
    badges: ["Top Rated", "Identity Verified"],
  },
  {
    id: "f5",
    name: "Priya Nair",
    title: "Mobile App Engineer (React Native)",
    location: "Ludhiana, Punjab",
    distanceKm: 6.7,
    avatar: "PN",
    rating: 4.85,
    reviewCount: 58,
    reputationScore: 90,
    verified: false,
    hourlyRate: 850,
    skills: [
      { name: "React Native", level: "Expert" },
      { name: "TypeScript", level: "Advanced" },
      { name: "Firebase", level: "Advanced" },
    ],
    completedJobs: 37,
    responseTime: "under 4 hours",
    bio: "Cross-platform app developer focused on performance and polished micro-interactions.",
    badges: ["Rising Talent"],
  },
];

export const gigs = [
  {
    id: "g1",
    title: "Build a React + Node E-commerce Storefront",
    category: "Web Development",
    client: "Nayoda Retail Pvt. Ltd.",
    location: "Ludhiana, Punjab",
    budgetMin: 45000,
    budgetMax: 70000,
    pricingType: "Milestone",
    postedAgo: "2 hours ago",
    proposals: 12,
    skills: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    matchScore: 97,
    description: "Looking for an experienced full-stack developer to build a storefront with cart, checkout, and an admin panel. Must integrate Razorpay and support milestone-based delivery across 3 phases.",
    milestones: [
      { name: "Design & Auth", amount: 15000, status: "pending" },
      { name: "Catalog & Cart", amount: 25000, status: "pending" },
      { name: "Checkout & Admin", amount: 30000, status: "pending" },
    ],
    status: "Open",
  },
  {
    id: "g2",
    title: "Redesign Mobile Banking App UI",
    category: "UI/UX Design",
    client: "Finlync Technologies",
    location: "Remote / Ludhiana",
    budgetMin: 20000,
    budgetMax: 35000,
    pricingType: "Fixed",
    postedAgo: "5 hours ago",
    proposals: 8,
    skills: ["Figma", "Prototyping"],
    matchScore: 89,
    description: "We need a modern, minimal redesign for our banking app — onboarding, dashboard, and transfer flows. Deliverables: Figma file + interactive prototype.",
    milestones: [
      { name: "Wireframes", amount: 8000, status: "pending" },
      { name: "High-fidelity UI", amount: 17000, status: "pending" },
      { name: "Prototype & handoff", amount: 10000, status: "pending" },
    ],
    status: "Open",
  },
  {
    id: "g3",
    title: "Fix Home Electrical Wiring & Panel Upgrade",
    category: "Home Repair",
    client: "Gagandeep Singh",
    location: "Model Town, Ludhiana",
    budgetMin: 3000,
    budgetMax: 6000,
    pricingType: "Fixed",
    postedAgo: "1 day ago",
    proposals: 19,
    skills: ["Electrical Wiring"],
    matchScore: 94,
    description: "Need a licensed electrician to inspect and upgrade the distribution panel in a 3BHK flat, plus fix two faulty circuits.",
    milestones: [],
    status: "Open",
  },
  {
    id: "g4",
    title: "SEO Blog Content — 10 Articles / Month",
    category: "Content Writing",
    client: "GreenLeaf Wellness",
    location: "Remote",
    budgetMin: 12000,
    budgetMax: 18000,
    pricingType: "Recurring",
    postedAgo: "3 days ago",
    proposals: 27,
    skills: ["Copywriting", "SEO"],
    matchScore: 81,
    description: "Ongoing monthly requirement for well-researched, SEO-optimized wellness articles, 1200-1500 words each.",
    milestones: [],
    status: "Open",
  },
  {
    id: "g5",
    title: "React Native App for Local Delivery Service",
    category: "Mobile Apps",
    client: "Speedy Kart",
    location: "Ludhiana, Punjab",
    budgetMin: 55000,
    budgetMax: 90000,
    pricingType: "Milestone",
    postedAgo: "6 hours ago",
    proposals: 6,
    skills: ["React Native", "Firebase", "TypeScript"],
    matchScore: 91,
    description: "Build a two-sided delivery app (customer + rider) with live tracking, push notifications, and order history.",
    milestones: [
      { name: "Auth & onboarding", amount: 15000, status: "pending" },
      { name: "Order flow", amount: 35000, status: "pending" },
      { name: "Live tracking + launch", amount: 40000, status: "pending" },
    ],
    status: "Open",
  },
];

export const proposalsForClient = [
  { id: "p1", gigId: "g1", freelancer: freelancers[0], bidAmount: 62000, days: 21, status: "Pending", note: "I've built 6 similar storefronts, including Razorpay escrow flows. Can start Monday." },
  { id: "p2", gigId: "g1", freelancer: freelancers[4], bidAmount: 58000, days: 25, status: "Pending", note: "React Native is my core stack but I have solid MERN experience from 3 past freelance stores." },
  { id: "p3", gigId: "g2", freelancer: freelancers[1], bidAmount: 30000, days: 14, status: "Accepted", note: "Attached 3 fintech case studies. Happy to start with wireframes this week." },
];

export const myProposals = [
  { id: "mp1", gig: gigs[0], bidAmount: 62000, days: 21, status: "Pending", submittedAgo: "1 hour ago" },
  { id: "mp2", gig: gigs[4], bidAmount: 58000, days: 25, status: "Pending", submittedAgo: "1 day ago" },
  { id: "mp3", gig: gigs[3], bidAmount: 16000, days: 30, status: "Rejected", submittedAgo: "4 days ago" },
];

export const activeContracts = [
  {
    id: "c1",
    gigTitle: "Portfolio Website Redesign",
    counterparty: "Wexley Studio",
    amount: 22000,
    paid: 8000,
    progress: 64,
    dueDate: "18 Jul 2026",
    milestones: [
      { name: "Design system", amount: 8000, status: "paid" },
      { name: "Build & CMS", amount: 9000, status: "in progress" },
      { name: "QA & launch", amount: 5000, status: "pending" },
    ],
  },
];

export const reviews = [
  { id: "r1", author: "Wexley Studio", rating: 5, text: "Delivered ahead of schedule with clean, well-documented code. Communication was excellent throughout.", date: "2 weeks ago", verified: true },
  { id: "r2", author: "Finlync Technologies", rating: 5, text: "Extremely responsive and detail-oriented. Our banking flows finally feel modern.", date: "1 month ago", verified: true },
  { id: "r3", author: "Nayoda Retail", rating: 4, text: "Solid work overall, one milestone slipped by two days but quality made up for it.", date: "2 months ago", verified: true },
];

export const messages = [
  { id: "m1", from: "Gagandeep Singh", preview: "Can you also check the kitchen circuit while you're here?", time: "10:42 AM", unread: true, avatar: "GS" },
  { id: "m2", from: "Nayoda Retail Pvt. Ltd.", preview: "Milestone 2 payment has been released, thank you!", time: "9:15 AM", unread: true, avatar: "NR" },
  { id: "m3", from: "Finlync Technologies", preview: "Sharing the brand guidelines PDF now.", time: "Yesterday", unread: false, avatar: "FT" },
  { id: "m4", from: "Wexley Studio", preview: "Looks great — approved for launch 🎉", time: "Mon", unread: false, avatar: "WS" },
];

export const chatThread = [
  { id: 1, sender: "them", text: "Hi! Saw your proposal on the storefront gig — really liked the phased approach.", time: "10:12 AM" },
  { id: 2, sender: "me", text: "Thanks! I can start with auth + design system this week if the milestone terms work for you.", time: "10:15 AM" },
  { id: 3, sender: "them", text: "Sounds good. Sending the first milestone payment to escrow now.", time: "10:20 AM", file: "brand-guidelines.pdf" },
  { id: 4, sender: "me", text: "Got it, I'll share the repo and a Loom walkthrough by Friday.", time: "10:22 AM" },
];

export const notifications = [
  { id: "n1", type: "proposal", text: "Ananya Sharma applied to your gig \"React + Node E-commerce Storefront\"", time: "12 min ago", unread: true },
  { id: "n2", type: "payment", text: "Milestone payment of ₹8,000 released to Wexley Studio", time: "1 hour ago", unread: true },
  { id: "n3", type: "review", text: "You received a new 5★ review from Finlync Technologies", time: "3 hours ago", unread: true },
  { id: "n4", type: "gig", text: "3 new gigs matching your skills were posted nearby", time: "Yesterday", unread: false },
  { id: "n5", type: "dispute", text: "Admin resolved dispute #D-1042 in your favor", time: "2 days ago", unread: false },
];

export const transactions = [
  { id: "t1", desc: "Milestone 1 — Design System", counterparty: "Wexley Studio", amount: 8000, type: "credit", status: "Completed", date: "02 Jul 2026" },
  { id: "t2", desc: "Escrow deposit — E-commerce Storefront", counterparty: "Nayoda Retail Pvt. Ltd.", amount: 15000, type: "escrow", status: "Held", date: "01 Jul 2026" },
  { id: "t3", desc: "Withdrawal to bank account", counterparty: "HDFC •••• 4821", amount: 12000, type: "debit", status: "Completed", date: "28 Jun 2026" },
  { id: "t4", desc: "Refund — cancelled gig", counterparty: "QuickFix Interiors", amount: 2500, type: "refund", status: "Completed", date: "24 Jun 2026" },
];

export const disputes = [
  { id: "d1", gig: "Logo Design Package", parties: "R. Kapoor vs. S. Bansal", raisedBy: "Client", reason: "Deliverable did not match agreed brief", status: "Under Review", amount: 4000, date: "09 Jul 2026" },
  { id: "d2", gig: "Home Cleaning Service", parties: "A. Chopra vs. M. Iqbal", raisedBy: "Freelancer", reason: "Client delaying milestone payment", status: "Resolved", amount: 1500, date: "03 Jul 2026" },
];

export const adminStats = {
  platformRevenue: 486200,
  activeFreelancers: 1284,
  activeClients: 742,
  jobSuccessRate: 93.4,
  monthlyGrowth: 12.6,
  topCategories: [
    { name: "Web Development", value: 32 },
    { name: "Home Repair", value: 22 },
    { name: "UI/UX Design", value: 18 },
    { name: "Content Writing", value: 15 },
    { name: "Mobile Apps", value: 13 },
  ],
};

export const revenueByMonth = [
  { month: "Feb", revenue: 285000 },
  { month: "Mar", revenue: 312000 },
  { month: "Apr", revenue: 298000 },
  { month: "May", revenue: 356000 },
  { month: "Jun", revenue: 421000 },
  { month: "Jul", revenue: 486200 },
];

export const freelancerEarnings = [
  { month: "Feb", earnings: 32000 },
  { month: "Mar", earnings: 41000 },
  { month: "Apr", earnings: 38000 },
  { month: "May", earnings: 52000 },
  { month: "Jun", earnings: 61000 },
  { month: "Jul", earnings: 47000 },
];

export const pendingVerifications = [
  { id: "v1", name: "Deepak Rana", title: "Plumbing & Fixtures", submitted: "3 hours ago" },
  { id: "v2", name: "Meera Joshi", title: "Wedding Photography", submitted: "1 day ago" },
  { id: "v3", name: "Arjun Sethi", title: "WordPress Developer", submitted: "2 days ago" },
];

export const currentUser = {
  client: { name: "Nayoda Retail Pvt. Ltd.", avatar: "NR", role: "client" },
  freelancer: freelancers[0],
  admin: { name: "Admin", avatar: "AD", role: "admin" },
};
