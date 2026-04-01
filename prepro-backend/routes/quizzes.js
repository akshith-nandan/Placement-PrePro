const express = require('express');
const { getProgress, updateProgress } = require('../data/store');
const router = express.Router();

const questionBank = {
  quantitative: [
    { id: 1, q: "A train travels 360 km in 4 hours. What is its speed in m/s?", opts: ["25 m/s", "90 m/s", "40 m/s", "22.5 m/s"], ans: 0, explanation: "Speed = 360/4 = 90 km/h = 90×1000/3600 = 25 m/s" },
    { id: 2, q: "If 20% of a number is 50, what is 80% of that number?", opts: ["150", "200", "250", "100"], ans: 1, explanation: "Number = 50/0.2 = 250. 80% of 250 = 200" },
    { id: 3, q: "A shopkeeper sells an item for ₹480 gaining 20% profit. What is the cost price?", opts: ["₹400", "₹380", "₹420", "₹360"], ans: 0, explanation: "CP = SP/(1+profit%) = 480/1.2 = ₹400" },
    { id: 4, q: "The ratio of milk and water in a mixture is 3:1. If 4 litres of water is added, ratio becomes 3:2. Find the initial amount.", opts: ["12L", "16L", "20L", "24L"], ans: 1, explanation: "Initial milk=12, water=4. After adding 4L water: 12:8 = 3:2. Total=16L" },
    { id: 5, q: "Find the next: 2, 6, 12, 20, 30, ?", opts: ["40", "42", "44", "38"], ans: 1, explanation: "Differences: 4,6,8,10,12. Next = 30+12 = 42" },
    { id: 6, q: "Simple interest on ₹5000 at 8% per annum for 3 years is?", opts: ["₹1000", "₹1200", "₹1500", "₹800"], ans: 1, explanation: "SI = P×R×T/100 = 5000×8×3/100 = ₹1200" },
    { id: 7, q: "A can do a work in 10 days, B in 15 days. Together they complete in?", opts: ["5 days", "6 days", "7 days", "8 days"], ans: 1, explanation: "Combined rate = 1/10+1/15 = 5/30 = 1/6. So 6 days." },
    { id: 8, q: "In how many ways can 4 people be arranged in a row?", opts: ["16", "24", "12", "48"], ans: 1, explanation: "4! = 4×3×2×1 = 24" },
    { id: 9, q: "What is the compound interest on ₹10000 at 10% pa for 2 years?", opts: ["₹2000", "₹2100", "₹2200", "₹1900"], ans: 1, explanation: "CI = 10000(1.1)² - 10000 = 12100-10000 = ₹2100" },
    { id: 10, q: "If x:y = 2:3, then (3x+2y):(2x+5y) = ?", opts: ["12:19", "6:10", "13:20", "2:3"], ans: 0, explanation: "Let x=2k, y=3k. (6k+6k):(4k+15k) = 12k:19k = 12:19" }
  ],
  logical: [
    { id: 11, q: "All roses are flowers. Some flowers fade quickly. Therefore:", opts: ["All roses fade quickly", "Some roses may fade quickly", "No roses fade quickly", "All flowers are roses"], ans: 1, explanation: "We can only conclude that some roses may fade quickly (not necessarily)." },
    { id: 12, q: "Find the odd one out: 3, 5, 7, 9, 11, 13", opts: ["3", "9", "11", "13"], ans: 1, explanation: "9 = 3×3 is a composite number. All others are prime." },
    { id: 13, q: "If COME is coded as XLNV, how is DONE coded?", opts: ["WLMV", "WLNV", "XLMV", "DLMV"], ans: 0, explanation: "Each letter is replaced by its mirror (A↔Z, B↔Y...): D=W, O=L, N=M, E=V → WLMV" },
    { id: 14, q: "A is B's sister. C is B's mother. D is C's father. E is D's mother. How is A related to D?", opts: ["Granddaughter", "Grandmother", "Daughter", "Sister"], ans: 0, explanation: "A→B (siblings) →C (mother) →D (father). So A is D's granddaughter." },
    { id: 15, q: "Pointing to a photograph, a man says 'His mother is the only daughter of my mother'. How is the man related to the person in photo?", opts: ["Uncle", "Father", "Brother", "Grandfather"], ans: 0, explanation: "Only daughter of my mother = my sister. So his mother is my sister → He is my nephew → I am his uncle." },
    { id: 16, q: "Which number should replace '?': 8, 27, 64, 125, ?", opts: ["196", "216", "256", "225"], ans: 1, explanation: "2³=8, 3³=27, 4³=64, 5³=125, 6³=216" },
    { id: 17, q: "If in a code language, 'MOUSE' is written as 'PRUQC', how is 'SHIFT' written?", opts: ["UJKIW", "VKHIW", "UJHIW", "VKJIX"], ans: 0, explanation: "Each letter shifted by +3: S+3=V... pattern gives UJKIW" },
    { id: 18, q: "6 persons A,B,C,D,E,F sit in a row. A and B always sit together. Number of arrangements?", opts: ["120", "240", "360", "720"], ans: 1, explanation: "Treat AB as one unit: 5! × 2! = 120×2 = 240" }
  ],
  verbal: [
    { id: 19, q: "Choose the word closest in meaning to EPHEMERAL:", opts: ["Eternal", "Transient", "Significant", "Robust"], ans: 1, explanation: "Ephemeral means lasting for a very short time — synonymous with transient." },
    { id: 20, q: "Choose the antonym of BENEVOLENT:", opts: ["Kind", "Generous", "Malevolent", "Gentle"], ans: 2, explanation: "Benevolent means kind; malevolent means having evil intent — the antonym." },
    { id: 21, q: "Fill in the blank: He was so tired that he could _____ walk.", opts: ["easily", "barely", "quickly", "always"], ans: 1, explanation: "'Barely' correctly conveys the extreme tiredness limiting his ability to walk." },
    { id: 22, q: "Identify the error: 'He is one of the students who has passed the exam.'", opts: ["He is one", "of the students", "who has passed", "No error"], ans: 2, explanation: "'who has' should be 'who have' — relative clause refers to 'students' (plural)." },
    { id: 23, q: "Choose the correctly spelled word:", opts: ["Accomodate", "Accommodate", "Accommadate", "Acomodate"], ans: 1, explanation: "Accommodate — double 'c' and double 'm'." }
  ],
  probability: [
    { id: 24, q: "A bag has 5 red, 3 blue, 2 green balls. Probability of picking a red ball?", opts: ["1/2", "1/5", "3/10", "2/5"], ans: 0, explanation: "P(red) = 5/10 = 1/2" },
    { id: 25, q: "Two dice are thrown. Probability that sum = 7?", opts: ["1/6", "7/36", "1/12", "5/36"], ans: 0, explanation: "Favorable: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6. Total = 36. P = 6/36 = 1/6" },
    { id: 26, q: "A card is drawn from a deck of 52. Probability it's a face card?", opts: ["3/13", "1/13", "4/13", "3/52"], ans: 0, explanation: "Face cards = 12 (J,Q,K × 4 suits). P = 12/52 = 3/13" }
  ]
};

const categories = [
  { id: 'quantitative', name: 'Quantitative Aptitude', icon: '🔢', count: 10, difficulty: 'Mixed', rating: 4.8 },
  { id: 'logical', name: 'Logical Reasoning', icon: '🧠', count: 8, difficulty: 'Mixed', rating: 4.7 },
  { id: 'verbal', name: 'Verbal Ability', icon: '📖', count: 5, difficulty: 'Mixed', rating: 4.6 },
  { id: 'probability', name: 'Probability & Stats', icon: '🎲', count: 3, difficulty: 'Hard', rating: 4.4 }
];

router.get('/categories', (req, res) => res.json(categories));

router.get('/:category', (req, res) => {
  const { category } = req.params;
  const questions = questionBank[category];
  if (!questions) return res.status(404).json({ error: 'Category not found' });
  // Return without answers
  const safe = questions.map(({ id, q, opts, explanation }) => ({ id, q, opts, explanation }));
  res.json({ category, questions: safe });
});

router.post('/:category/submit', (req, res) => {
  const { category } = req.params;
  const { answers } = req.body; // { questionId: selectedIndex }
  const questions = questionBank[category];
  if (!questions) return res.status(404).json({ error: 'Category not found' });

  let correct = 0;
  const results = questions.map(q => {
    const userAns = answers[q.id] !== undefined ? answers[q.id] : -1;
    const isCorrect = userAns === q.ans;
    if (isCorrect) correct++;
    return { id: q.id, correct: isCorrect, userAnswer: userAns, correctAnswer: q.ans, explanation: q.explanation };
  });

  const score = Math.round((correct / questions.length) * 100);

  // Update user progress
  const progress = getProgress(req.user.id);
  if (progress) {
    const newHistory = [...(progress.quizHistory || []), { category, score, date: new Date(), correct, total: questions.length }];
    const allScores = newHistory.map(h => h.score);
    const avgAccuracy = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
    updateProgress(req.user.id, { quizHistory: newHistory, quizAccuracy: avgAccuracy });
  }

  res.json({ score, correct, total: questions.length, results });
});

module.exports = router;