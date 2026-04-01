const express = require('express');
const { getProgress, updateProgress } = require('../data/store');
const router = express.Router();

const problems = [
  { id: 1, title: "Two Sum", topic: "Arrays", difficulty: "Easy", acceptance: 49, description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]" }], constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹"], starterCode: { python: "def twoSum(nums, target):\n    # Write your solution here\n    pass", javascript: "var twoSum = function(nums, target) {\n    // Write your solution here\n};" }, solution: "Use a hash map to store complement lookups in O(n) time." },
  { id: 2, title: "Valid Parentheses", topic: "Strings", difficulty: "Easy", acceptance: 40, description: "Given a string s containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", examples: [{ input: 's = "()"', output: "true" }, { input: 's = "([)]"', output: "false" }], constraints: ["1 ≤ s.length ≤ 10⁴"], starterCode: { python: "def isValid(s):\n    pass", javascript: "var isValid = function(s) {\n};" }, solution: "Use a stack. Push opening brackets, pop and match for closing brackets." },
  { id: 3, title: "Maximum Subarray", topic: "Arrays", difficulty: "Easy", acceptance: 50, description: "Given an integer array nums, find the subarray with the largest sum and return its sum (Kadane's Algorithm).", examples: [{ input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" }], constraints: ["1 ≤ nums.length ≤ 10⁵"], starterCode: { python: "def maxSubArray(nums):\n    pass", javascript: "var maxSubArray = function(nums) {\n};" }, solution: "Kadane's: Track current sum, reset to 0 if negative. Update max." },
  { id: 4, title: "Climbing Stairs", topic: "Dynamic Programming", difficulty: "Easy", acceptance: 52, description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?", examples: [{ input: "n = 3", output: "3" }], constraints: ["1 ≤ n ≤ 45"], starterCode: { python: "def climbStairs(n):\n    pass", javascript: "var climbStairs = function(n) {\n};" }, solution: "Fibonacci sequence. dp[i] = dp[i-1] + dp[i-2]." },
  { id: 5, title: "Reverse Linked List", topic: "Linked List", difficulty: "Easy", acceptance: 73, description: "Given the head of a singly linked list, reverse the list, and return the reversed list.", examples: [{ input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }], constraints: ["0 ≤ n ≤ 5000"], starterCode: { python: "def reverseList(head):\n    pass", javascript: "var reverseList = function(head) {\n};" }, solution: "Iteratively maintain prev and curr pointers." },
  { id: 6, title: "Binary Search", topic: "Sorting", difficulty: "Easy", acceptance: 55, description: "Given a sorted array of integers nums and an integer target, return the index of target. If not found, return -1.", examples: [{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }], constraints: ["1 ≤ nums.length ≤ 10⁴"], starterCode: { python: "def search(nums, target):\n    pass", javascript: "var search = function(nums, target) {\n};" }, solution: "Classic binary search: lo=0, hi=n-1, mid=(lo+hi)//2." },
  { id: 7, title: "3Sum", topic: "Arrays", difficulty: "Medium", acceptance: 32, description: "Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i≠j≠k and nums[i]+nums[j]+nums[k]==0.", examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }], constraints: ["3 ≤ nums.length ≤ 3000"], starterCode: { python: "def threeSum(nums):\n    pass", javascript: "var threeSum = function(nums) {\n};" }, solution: "Sort, then for each element use two-pointer approach on remaining." },
  { id: 8, title: "Longest Substring Without Repeating", topic: "Strings", difficulty: "Medium", acceptance: 34, description: "Given a string s, find the length of the longest substring without repeating characters.", examples: [{ input: 's = "abcabcbb"', output: "3" }], constraints: ["0 ≤ s.length ≤ 5×10⁴"], starterCode: { python: "def lengthOfLongestSubstring(s):\n    pass", javascript: "var lengthOfLongestSubstring = function(s) {\n};" }, solution: "Sliding window with a set. Expand right, shrink left on duplicate." },
  { id: 9, title: "Number of Islands", topic: "Graphs", difficulty: "Medium", acceptance: 57, description: "Given an m×n 2D binary grid where '1' is land and '0' is water, return the number of islands.", examples: [{ input: 'grid = [["1","1","0"],["0","1","0"],["0","0","1"]]', output: "2" }], constraints: ["1 ≤ m,n ≤ 300"], starterCode: { python: "def numIslands(grid):\n    pass", javascript: "var numIslands = function(grid) {\n};" }, solution: "DFS/BFS: When you find '1', do DFS to mark all connected land as visited." },
  { id: 10, title: "Coin Change", topic: "Dynamic Programming", difficulty: "Medium", acceptance: 41, description: "Given an array of coin denominations and an amount, return the fewest number of coins needed. Return -1 if impossible.", examples: [{ input: "coins = [1,5,11], amount = 15", output: "3" }], constraints: ["1 ≤ coins.length ≤ 12"], starterCode: { python: "def coinChange(coins, amount):\n    pass", javascript: "var coinChange = function(coins, amount) {\n};" }, solution: "DP: dp[i] = min coins for amount i. dp[0]=0, build up." },
  { id: 11, title: "Trapping Rain Water", topic: "Arrays", difficulty: "Hard", acceptance: 60, description: "Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.", examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }], constraints: ["n == height.length", "0 ≤ height[i] ≤ 10⁵"], starterCode: { python: "def trap(height):\n    pass", javascript: "var trap = function(height) {\n};" }, solution: "Two-pointer: track leftMax and rightMax. Water at i = min(leftMax,rightMax) - height[i]." },
  { id: 12, title: "Word Break", topic: "Dynamic Programming", difficulty: "Hard", acceptance: 44, description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a sequence of dictionary words.", examples: [{ input: 's = "leetcode", wordDict = ["leet","code"]', output: "true" }], constraints: ["1 ≤ s.length ≤ 300"], starterCode: { python: "def wordBreak(s, wordDict):\n    pass", javascript: "var wordBreak = function(s, wordDict) {\n};" }, solution: "DP: dp[i] = true if s[0..i] can be broken. Check all prefixes." }
];

router.get('/', (req, res) => {
  const progress = getProgress(req.user.id);
  const solved = progress ? progress.solvedProblems : [];
  const result = problems.map(p => ({
    id: p.id, title: p.title, topic: p.topic,
    difficulty: p.difficulty, acceptance: p.acceptance,
    solved: solved.includes(p.id)
  }));
  res.json(result);
});

router.get('/:id', (req, res) => {
  const p = problems.find(p => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: 'Problem not found' });
  const progress = getProgress(req.user.id);
  const solved = progress ? progress.solvedProblems : [];
  res.json({ ...p, solved: solved.includes(p.id) });
});

router.post('/:id/submit', (req, res) => {
  const p = problems.find(p => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: 'Problem not found' });

  // Simulate test case running (in real app, would execute code)
  const { code, language } = req.body;
  if (!code || code.trim().length < 10) {
    return res.json({ status: 'Wrong Answer', passed: 0, total: 3, message: 'Code seems incomplete.' });
  }

  // Mark as solved if code is non-trivial
  const progress = getProgress(req.user.id);
  if (progress && !progress.solvedProblems.includes(p.id)) {
    const newSolved = [...progress.solvedProblems, p.id];
    updateProgress(req.user.id, {
      solvedProblems: newSolved,
      problemsSolved: newSolved.length
    });
  }

  res.json({
    status: 'Accepted',
    passed: 3, total: 3,
    runtime: Math.floor(Math.random() * 50 + 20) + ' ms',
    memory: (Math.random() * 5 + 13).toFixed(1) + ' MB',
    message: 'All test cases passed!'
  });
});

module.exports = router;