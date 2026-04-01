// materials.js
const express = require('express');
const router = express.Router();

const materials = [
  { id: 1, title: "Data Structures Complete Guide", category: "Core CS", icon: "📐", desc: "Arrays, Linked Lists, Trees, Graphs, Heaps, Tries with code examples and interview tips.", pages: 48, type: "PDF", pinned: false, tags: ["DSA", "Arrays", "Trees", "Graphs"] },
  { id: 2, title: "Algorithm Design Manual", category: "Core CS", icon: "⚙", desc: "Sorting, Searching, Dynamic Programming, Greedy algorithms with complexity analysis.", pages: 62, type: "PDF", pinned: false, tags: ["Algorithms", "DP", "Sorting"] },
  { id: 3, title: "DBMS Concepts & SQL", category: "Theory", icon: "🔗", desc: "Normalization, SQL queries, Indexing, Transactions, ER Diagrams — all interview essentials.", pages: 35, type: "PDF", pinned: false, tags: ["DBMS", "SQL", "Normalization"] },
  { id: 4, title: "Operating Systems", category: "Theory", icon: "🌐", desc: "Processes, Threads, Memory Management, Scheduling algorithms, Deadlock.", pages: 40, type: "PDF", pinned: false, tags: ["OS", "Scheduling", "Memory"] },
  { id: 5, title: "Computer Networks", category: "Theory", icon: "🔌", desc: "TCP/IP, OSI Model, HTTP, DNS, Routing protocols — must-know for tech interviews.", pages: 30, type: "PDF", pinned: false, tags: ["Networks", "TCP/IP", "OSI"] },
  { id: 6, title: "Aptitude Formula Sheet", category: "Quick Ref", icon: "💬", desc: "All math formulas for quantitative aptitude — one-page cheat sheet.", pages: 2, type: "PDF", pinned: true, tags: ["Aptitude", "Formulas", "Quick"] },
  { id: 7, title: "Placement Roadmap 2025", category: "Career", icon: "🗓", desc: "Complete 3-month study plan for major IT companies with weekly milestones.", pages: 24, type: "PDF", pinned: true, tags: ["Roadmap", "Strategy"] },
  { id: 8, title: "HR Interview Guide", category: "Career", icon: "🧾", desc: "Common HR questions with STAR method model answers, body language tips.", pages: 15, type: "PDF", pinned: true, tags: ["HR", "Soft Skills"] },
  { id: 9, title: "TCS NQT Preparation Guide", category: "Company", icon: "🏢", desc: "TCS-specific aptitude patterns, previous year questions, and strategies.", pages: 28, type: "PDF", pinned: false, tags: ["TCS", "Company Prep"] },
  { id: 10, title: "System Design Basics", category: "Advanced", icon: "🏗", desc: "Load balancing, Caching, Database sharding, CAP theorem — senior role essentials.", pages: 45, type: "PDF", pinned: false, tags: ["System Design", "Architecture"] }
];

router.get('/', (req, res) => res.json(materials));
router.get('/pinned', (req, res) => res.json(materials.filter(m => m.pinned)));
router.get('/:id', (req, res) => {
  const m = materials.find(m => m.id === parseInt(req.params.id));
  if (!m) return res.status(404).json({ error: 'Material not found' });
  res.json(m);
});

module.exports = router;