require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const AptitudeQuestion = require('./models/ApptitudeQuestions');
const CodingProblem = require('./models/CodingProblem');
const Company = require('./models/Company');
const StudyMaterial = require('./models/StudyMaterial');
const InterviewQuestion = require('./models/InterviewQuestion');
const { MockTest } = require('./models/MockTest');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    AptitudeQuestion.deleteMany(),
    CodingProblem.deleteMany(),
    Company.deleteMany(),
    StudyMaterial.deleteMany(),
    InterviewQuestion.deleteMany(),
    MockTest.deleteMany()
  ]);

  console.log('Seeding Aptitude Questions...');
  const aptitudeQuestions = await AptitudeQuestion.insertMany([
    {
      category: 'Quantitative',
      topic: 'Profit & Loss',
      questionText: 'A shopkeeper buys an item for ₹400 and sells it for ₹500. Find the profit percentage.',
      options: ['20%', '25%', '15%', '30%'],
      correctOption: 1,
      explanation: 'Profit = 500 - 400 = 100. Profit % = (100/400) * 100 = 25%.',
      difficulty: 'Easy'
    },
    {
      category: 'Quantitative',
      topic: 'Profit & Loss',
      questionText: 'A man sells a watch at a loss of 10%. If he had sold it for ₹54 more, he would have gained 8%. Find the cost price.',
      options: ['₹300', '₹350', '₹400', '₹450'],
      correctOption: 0,
      explanation: '18% of CP = 54, so CP = 54 / 0.18 = ₹300.',
      difficulty: 'Medium'
    },
    {
      category: 'Quantitative',
      topic: 'Time and Work',
      questionText: 'A can complete a work in 10 days and B in 15 days. How many days will both take together?',
      options: ['5 days', '6 days', '8 days', '9 days'],
      correctOption: 1,
      explanation: 'Combined rate = 1/10 + 1/15 = 1/6. So together they take 6 days.',
      difficulty: 'Easy'
    },
    {
      category: 'Logical Reasoning',
      topic: 'Blood Relations',
      questionText: "Pointing to a photograph, a man says, 'I am the son of the only son of my grandfather.' How is the man related to the person in the photo?",
      options: ['Father', 'Son', 'Grandfather', 'Cannot be determined'],
      correctOption: 3,
      explanation: 'The photo subject is not specified, so the relation cannot be determined from the given info.',
      difficulty: 'Medium'
    },
    {
      category: 'Logical Reasoning',
      topic: 'Series Completion',
      questionText: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
      options: ['40', '42', '44', '46'],
      correctOption: 1,
      explanation: 'Differences are 4, 6, 8, 10, 12. Next term = 30 + 12 = 42.',
      difficulty: 'Easy'
    },
    {
      category: 'Verbal Ability',
      topic: 'Synonyms',
      questionText: "Choose the word most similar in meaning to 'Benevolent'.",
      options: ['Cruel', 'Kind', 'Greedy', 'Lazy'],
      correctOption: 1,
      explanation: "'Benevolent' means kind and generous.",
      difficulty: 'Easy'
    },
    {
      category: 'Verbal Ability',
      topic: 'Sentence Correction',
      questionText: "Identify the correct sentence: ",
      options: [
        'He don\'t like coffee.',
        'He doesn\'t likes coffee.',
        'He doesn\'t like coffee.',
        'He not like coffee.'
      ],
      correctOption: 2,
      explanation: "'Doesn't' (does not) + base verb 'like' is the correct form.",
      difficulty: 'Easy'
    },
    {
      category: 'Data Interpretation',
      topic: 'Pie Charts',
      questionText: 'In a pie chart, a sector represents 25% of the total. If the total value is 800, what is the value of this sector?',
      options: ['100', '150', '200', '250'],
      correctOption: 2,
      explanation: '25% of 800 = 200.',
      difficulty: 'Easy'
    }
  ]);
  console.log(`Inserted ${aptitudeQuestions.length} aptitude questions`);

  console.log('Seeding Coding Problems...');
  const codingProblems = await CodingProblem.insertMany([
    {
      title: 'Two Sum',
      slug: 'two-sum',
      description:
        'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
      difficulty: 'Easy',
      topic: 'Arrays',
      companies: ['Amazon', 'Google', 'Microsoft'],
      starterCode: {
        javascript: 'function twoSum(nums, target) {\n  // your code here\n}',
        python: 'def two_sum(nums, target):\n    # your code here\n    pass',
        java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // your code here\n        return new int[]{};\n    }\n}',
        cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // your code here\n    return {};\n}'
      },
      testCases: [
        { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', isHidden: false },
        { input: '[3,2,4], 6', expectedOutput: '[1,2]', isHidden: false },
        { input: '[3,3], 6', expectedOutput: '[0,1]', isHidden: true }
      ]
    },
    {
      title: 'Reverse a Linked List',
      slug: 'reverse-linked-list',
      description: 'Given the head of a singly linked list, reverse the list and return the new head.',
      difficulty: 'Medium',
      topic: 'Linked Lists',
      companies: ['Amazon', 'Adobe'],
      starterCode: {
        javascript: 'function reverseList(head) {\n  // your code here\n}',
        python: 'def reverse_list(head):\n    # your code here\n    pass',
        java: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        // your code here\n        return null;\n    }\n}',
        cpp: 'ListNode* reverseList(ListNode* head) {\n    // your code here\n    return nullptr;\n}'
      },
      testCases: [
        { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]', isHidden: false },
        { input: '[]', expectedOutput: '[]', isHidden: true }
      ]
    },
    {
      title: 'Binary Tree Level Order Traversal',
      slug: 'binary-tree-level-order',
      description: 'Given the root of a binary tree, return the level order traversal of its node values.',
      difficulty: 'Medium',
      topic: 'Trees',
      companies: ['Microsoft', 'Facebook'],
      starterCode: {
        javascript: 'function levelOrder(root) {\n  // your code here\n}',
        python: 'def level_order(root):\n    # your code here\n    pass',
        java: 'class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // your code here\n        return new ArrayList<>();\n    }\n}',
        cpp: 'vector<vector<int>> levelOrder(TreeNode* root) {\n    // your code here\n    return {};\n}'
      },
      testCases: [
        { input: '[3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]', isHidden: false }
      ]
    },
    {
      title: 'Longest Common Subsequence',
      slug: 'longest-common-subsequence',
      description: 'Given two strings text1 and text2, return the length of their longest common subsequence.',
      difficulty: 'Hard',
      topic: 'Dynamic Programming',
      companies: ['Google', 'Amazon'],
      starterCode: {
        javascript: 'function longestCommonSubsequence(text1, text2) {\n  // your code here\n}',
        python: 'def longest_common_subsequence(text1, text2):\n    # your code here\n    pass',
        java: 'class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        // your code here\n        return 0;\n    }\n}',
        cpp: 'int longestCommonSubsequence(string text1, string text2) {\n    // your code here\n    return 0;\n}'
      },
      testCases: [
        { input: '"abcde", "ace"', expectedOutput: '3', isHidden: false },
        { input: '"abc", "abc"', expectedOutput: '3', isHidden: true }
      ]
    }
  ]);
  console.log(`Inserted ${codingProblems.length} coding problems`);

  console.log('Seeding Companies...');
  const companies = await Company.insertMany([
    {
      name: 'TCS',
      hiringPattern: 'Online Aptitude Test (TCS NQT) -> Technical Interview -> HR Interview',
      cutoff: '60% aggregate, no active backlogs',
      previousQuestions: [
        'What is normalization in DBMS?',
        'Explain OOPs concepts with examples',
        'Write a program to reverse a string'
      ],
      interviewExperiences: [
        {
          studentName: 'Ravi Kumar',
          role: 'Assistant System Engineer',
          rating: 4,
          experience: 'The aptitude test focused on quant and reasoning. Technical round covered Java and DBMS basics. HR round was about career goals and relocation flexibility.'
        }
      ]
    },
    {
      name: 'Infosys',
      hiringPattern: 'Infosys InfyTQ / HackWithInfy -> Technical Interview -> HR Interview',
      cutoff: '65% aggregate, no current backlogs',
      previousQuestions: [
        'Explain SDLC models',
        'What is the difference between process and thread?',
        'SQL query to find second highest salary'
      ],
      interviewExperiences: [
        {
          studentName: 'Sneha Reddy',
          role: 'Systems Engineer',
          rating: 5,
          experience: 'Coding round had 2 medium DSA problems. Technical interview focused on projects and core CS subjects. HR was friendly and conversational.'
        }
      ]
    },
    {
      name: 'Wipro',
      hiringPattern: 'Wipro NLTH -> Technical Interview -> HR Interview',
      cutoff: '60% throughout academics',
      previousQuestions: [
        'What is polymorphism?',
        'Explain TCP vs UDP',
        'Find duplicate elements in an array'
      ],
      interviewExperiences: []
    },
    {
      name: 'Accenture',
      hiringPattern: 'Cognitive Ability + Technical Assessment -> Coding Round -> HR Interview',
      cutoff: '65% aggregate',
      previousQuestions: [
        'What is cloud computing?',
        'Explain ACID properties',
        'Implement a stack using arrays'
      ],
      interviewExperiences: []
    },
    {
      name: 'Cognizant',
      hiringPattern: 'GenC Aptitude Test -> Coding Round -> Technical + HR Interview',
      cutoff: '60% aggregate, max 1 backlog',
      previousQuestions: [
        'Explain inheritance with real-world example',
        'What is indexing in databases?',
        'Find the missing number in an array'
      ],
      interviewExperiences: []
    }
  ]);
  console.log(`Inserted ${companies.length} companies`);

  console.log('Seeding Study Materials...');
  const materials = await StudyMaterial.insertMany([
    { title: 'Complete DSA Notes - Arrays to Graphs', category: 'DSA', type: 'PDF', url: 'https://example.com/dsa-notes.pdf', description: 'Comprehensive notes covering all major DSA topics' },
    { title: 'DBMS Normalization Explained', category: 'DBMS', type: 'Video', url: 'https://youtube.com/watch?v=example1', description: 'Video tutorial on 1NF, 2NF, 3NF, BCNF' },
    { title: 'Operating Systems - Process Scheduling', category: 'OS', type: 'PDF', url: 'https://example.com/os-scheduling.pdf', description: 'Notes on scheduling algorithms' },
    { title: 'Computer Networks - OSI Model', category: 'CN', type: 'Video', url: 'https://youtube.com/watch?v=example2', description: 'Detailed explanation of OSI and TCP/IP models' },
    { title: 'OOPs Concepts in Java', category: 'OOPs', type: 'PDF', url: 'https://example.com/oops-java.pdf', description: 'Core OOP principles with Java examples' },
    { title: 'SQL Queries for Interviews', category: 'SQL', type: 'PDF', url: 'https://example.com/sql-interview.pdf', description: 'Most asked SQL interview queries with solutions' }
  ]);
  console.log(`Inserted ${materials.length} study materials`);

  console.log('Seeding Interview Questions...');
  const interviewQuestions = await InterviewQuestion.insertMany([
    { type: 'Technical', subject: 'DBMS', question: 'What is normalization and why is it important?', sampleAnswer: 'Normalization is the process of organizing data to reduce redundancy and improve data integrity, typically achieved through normal forms like 1NF, 2NF, and 3NF.' },
    { type: 'Technical', subject: 'OS', question: 'What is the difference between a process and a thread?', sampleAnswer: 'A process is an independent program in execution with its own memory space, while a thread is a lightweight unit within a process that shares memory with other threads of the same process.' },
    { type: 'Technical', subject: 'CN', question: 'Explain the difference between TCP and UDP.', sampleAnswer: 'TCP is connection-oriented and reliable, ensuring ordered delivery of data, while UDP is connectionless and faster but does not guarantee delivery or order.' },
    { type: 'Technical', subject: 'OOPs', question: 'What are the four pillars of OOP?', sampleAnswer: 'Encapsulation, Abstraction, Inheritance, and Polymorphism are the four core principles of object-oriented programming.' },
    { type: 'Technical', subject: 'Cloud Computing', question: 'What is the difference between IaaS, PaaS, and SaaS?', sampleAnswer: 'IaaS provides virtualized computing infrastructure, PaaS provides a platform for developing applications, and SaaS delivers fully functional software applications over the internet.' },
    { type: 'HR', subject: 'General', question: 'Tell me about yourself.', sampleAnswer: 'Start with your educational background, mention key skills and projects relevant to the role, and conclude with your career goals and why you are a good fit for the company.' },
    { type: 'HR', subject: 'General', question: 'What are your strengths and weaknesses?', sampleAnswer: 'Mention 2-3 genuine strengths relevant to the job with examples, and one real weakness along with the steps you are taking to improve it.' },
    { type: 'HR', subject: 'General', question: 'Why should we hire you?', sampleAnswer: 'Highlight how your skills, experience, and attitude align with the company\'s needs, and express genuine enthusiasm for contributing to their goals.' }
  ]);
  console.log(`Inserted ${interviewQuestions.length} interview questions`);

  console.log('Seeding Mock Tests...');
  const mockTests = await MockTest.insertMany([
    {
      title: 'Aptitude Mock Test 1',
      type: 'Aptitude',
      durationMinutes: 30,
      aptitudeQuestions: aptitudeQuestions.slice(0, 8).map((q) => q._id),
      codingProblems: []
    },
    {
      title: 'Full Placement Mock Test',
      type: 'Full Placement',
      durationMinutes: 90,
      aptitudeQuestions: aptitudeQuestions.map((q) => q._id),
      codingProblems: codingProblems.slice(0, 2).map((p) => p._id)
    }
  ]);
  console.log(`Inserted ${mockTests.length} mock tests`);

  console.log('Seeding complete!');
  mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  mongoose.connection.close();
  process.exit(1);
});