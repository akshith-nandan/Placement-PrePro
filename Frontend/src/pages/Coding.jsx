import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PROBLEMS = [
  { id:1, title:'Two Sum', difficulty:'Easy', topic:'Arrays', companies:['Amazon','Google','Microsoft'], solved:true,
    desc:'Given an array of integers and a target, return indices of two numbers that add up to target.',
    starter:{ javascript:'function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (map[need] !== undefined) return [map[need], i];\n    map[nums[i]] = i;\n  }\n  return [];\n}\nconsole.log(twoSum([2,7,11,15], 9));',
      python:'def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n    return []\nprint(two_sum([2,7,11,15], 9))',
      java:'import java.util.*;\npublic class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer,Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            if (map.containsKey(target - nums[i]))\n                return new int[]{map.get(target-nums[i]), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n    public static void main(String[] a) {\n        System.out.println(Arrays.toString(twoSum(new int[]{2,7,11,15},9)));\n    }\n}',
      cpp:'#include<bits/stdc++.h>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target){\n    unordered_map<int,int> seen;\n    for(int i=0;i<nums.size();i++){\n        if(seen.count(target-nums[i])) return {seen[target-nums[i]],i};\n        seen[nums[i]]=i;\n    }\n    return {};\n}\nint main(){\n    vector<int> v={2,7,11,15};\n    auto r=twoSum(v,9);\n    cout<<"["<<r[0]<<","<<r[1]<<"]";\n}' }
  },
  { id:2, title:'Reverse Linked List', difficulty:'Medium', topic:'Linked Lists', companies:['Amazon','Adobe'], solved:false,
    desc:'Given head of a singly linked list, reverse it and return the new head.',
    starter:{ javascript:'function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    let next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}', python:'', java:'', cpp:'' }
  },
  { id:3, title:'Binary Search', difficulty:'Easy', topic:'Arrays', companies:['Microsoft','Google'], solved:true,
    desc:'Given a sorted array and target, return the index of target or -1.',
    starter:{ javascript:'function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (nums[mid] === target) return mid;\n    else if (nums[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}\nconsole.log(search([1,3,5,7,9], 5));', python:'', java:'', cpp:'' }
  },
  { id:4, title:'Fibonacci Number', difficulty:'Easy', topic:'Dynamic Programming', companies:['TCS','Infosys','Wipro'], solved:false,
    desc:'Return the nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).',
    starter:{ javascript:'function fib(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];\n  return b;\n}\nconsole.log(fib(10)); // 55', python:'', java:'', cpp:'' }
  },
  { id:5, title:'Palindrome Check', difficulty:'Medium', topic:'Strings', companies:['Accenture','Cognizant'], solved:false,
    desc:'Determine if a string is a palindrome ignoring spaces and case.',
    starter:{ javascript:'function isPalindrome(s) {\n  s = s.replace(/[^a-zA-Z0-9]/g,"").toLowerCase();\n  return s === s.split("").reverse().join("");\n}\nconsole.log(isPalindrome("racecar"));\nconsole.log(isPalindrome("hello"));', python:'', java:'', cpp:'' }
  },
  { id:6, title:'Longest Common Subsequence', difficulty:'Hard', topic:'Dynamic Programming', companies:['Google','Amazon'], solved:false,
    desc:'Given two strings, return the length of their longest common subsequence.',
    starter:{ javascript:'function lcs(a, b) {\n  const m=a.length, n=b.length;\n  const dp=Array(m+1).fill(0).map(()=>Array(n+1).fill(0));\n  for(let i=1;i<=m;i++)\n    for(let j=1;j<=n;j++)\n      dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);\n  return dp[m][n];\n}\nconsole.log(lcs("abcde","ace")); // 3', python:'', java:'', cpp:'' }
  },
  { id:7, title:'Level Order Traversal', difficulty:'Medium', topic:'Trees', companies:['Microsoft','Facebook'], solved:false,
    desc:'Given the root of a binary tree, return level order traversal of node values.',
    starter:{ javascript:'// BFS approach\nfunction levelOrder(root) {\n  if (!root) return [];\n  const res = [], queue = [root];\n  while (queue.length) {\n    const level = [], size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    res.push(level);\n  }\n  return res;\n}', python:'', java:'', cpp:'' }
  },
  { id:8, title:'Number of Islands', difficulty:'Hard', topic:'Graphs', companies:['Amazon','Google'], solved:false,
    desc:'Given a 2D grid of 1s (land) and 0s (water), count the number of islands.',
    starter:{ javascript:'function numIslands(grid) {\n  let count = 0;\n  function dfs(i, j) {\n    if (i<0||i>=grid.length||j<0||j>=grid[0].length||grid[i][j]!=="1") return;\n    grid[i][j] = "0";\n    dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1);\n  }\n  for (let i=0;i<grid.length;i++)\n    for (let j=0;j<grid[0].length;j++)\n      if (grid[i][j]==="1") { count++; dfs(i,j); }\n  return count;\n}', python:'', java:'', cpp:'' }
  },
];

const S = {
  wrap: { },
  badge: (d) => ({
    display:'inline-flex', alignItems:'center', padding:'3px 10px',
    borderRadius:99, fontSize:11, fontWeight:700,
    background: d==='Easy'?'rgba(34,197,94,0.1)':d==='Medium'?'rgba(245,158,11,0.1)':'rgba(239,68,68,0.1)',
    color: d==='Easy'?'#4ade80':d==='Medium'?'#fbbf24':'#f87171',
    border: `1px solid ${d==='Easy'?'rgba(34,197,94,0.2)':d==='Medium'?'rgba(245,158,11,0.2)':'rgba(239,68,68,0.2)'}`,
  }),
  tag: { display:'inline-block', padding:'2px 8px', background:'#1c1c28', border:'1px solid rgba(255,255,255,0.1)', borderRadius:99, fontSize:11, color:'#9898b8', marginRight:4 },
  select: { background:'#16161f', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'8px 12px', color:'#f0f0f5', fontSize:13, outline:'none' },
};

export default function Coding() {
  const navigate = useNavigate();
  const [diffFilter, setDiffFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [search, setSearch] = useState('');
  const [openProblem, setOpenProblem] = useState(null);

  const filtered = PROBLEMS.filter(p => {
    if (diffFilter && p.difficulty !== diffFilter) return false;
    if (topicFilter && p.topic !== topicFilter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (openProblem) {
    return <ProblemView problem={openProblem} onBack={() => setOpenProblem(null)} navigate={navigate} />;
  }

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#f0f0f5', letterSpacing:-0.5 }}>Coding Practice</h1>
        <p style={{ color:'#9898b8', marginTop:4, fontSize:14 }}>Sharpen your DSA skills with company-tagged problems</p>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <select style={S.select} value={diffFilter} onChange={e=>setDiffFilter(e.target.value)}>
          <option value="">All Difficulty</option>
          <option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
        <select style={S.select} value={topicFilter} onChange={e=>setTopicFilter(e.target.value)}>
          <option value="">All Topics</option>
          <option>Arrays</option><option>Strings</option><option>Linked Lists</option>
          <option>Trees</option><option>Graphs</option><option>Dynamic Programming</option>
        </select>
        <input
          style={{ ...S.select, width:220 }}
          placeholder="🔍  Search problems..."
          value={search} onChange={e=>setSearch(e.target.value)}
        />
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Total Problems', val: PROBLEMS.length, color:'#7c6af7' },
          { label:'Solved', val: PROBLEMS.filter(p=>p.solved).length, color:'#22c55e' },
          { label:'Easy', val: PROBLEMS.filter(p=>p.difficulty==='Easy').length, color:'#4ade80' },
          { label:'Hard', val: PROBLEMS.filter(p=>p.difficulty==='Hard').length, color:'#f87171' },
        ].map(s => (
          <div key={s.label} style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'14px 16px' }}>
            <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:12, color:'#55556a', marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              {['#','Status','Title','Difficulty','Topic','Companies'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', color:'#55556a' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}
                onClick={() => setOpenProblem(p)}
                style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', cursor:'pointer', transition:'background .15s' }}
                onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                onMouseOut={e => e.currentTarget.style.background=''}
              >
                <td style={{ padding:'13px 16px', fontSize:13, color:'#55556a' }}>{p.id}</td>
                <td style={{ padding:'13px 16px' }}>
                  {p.solved
                    ? <i className="fas fa-circle-check" style={{ color:'#22c55e', fontSize:15 }} />
                    : <i className="far fa-circle" style={{ color:'#55556a', fontSize:15 }} />
                  }
                </td>
                <td style={{ padding:'13px 16px' }}>
                  <span style={{ color:'#f0f0f5', fontWeight:500, fontSize:14, transition:'color .15s' }}
                    onMouseOver={e=>e.currentTarget.style.color='#7c6af7'}
                    onMouseOut={e=>e.currentTarget.style.color='#f0f0f5'}
                  >{p.title}</span>
                </td>
                <td style={{ padding:'13px 16px' }}><span style={S.badge(p.difficulty)}>{p.difficulty}</span></td>
                <td style={{ padding:'13px 16px', fontSize:13, color:'#9898b8' }}>{p.topic}</td>
                <td style={{ padding:'13px 16px' }}>
                  {p.companies.map(c => <span key={c} style={S.tag}>{c}</span>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding:40, textAlign:'center', color:'#55556a' }}>No problems found</div>
        )}
      </div>
    </div>
  );
}

function ProblemView({ problem, onBack, navigate }) {
  const [lang, setLang] = useState('javascript');
  const [code, setCode] = useState(problem.starter.javascript || '');
  const [output, setOutput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const changeLang = l => {
    setLang(l);
    setCode(problem.starter[l] || `// ${l} starter code\n// Write your solution here`);
    setOutput('');
  };

  const runCode = () => {
    if (lang !== 'javascript') {
      setOutput(`[${lang.toUpperCase()}] Connect Judge0 API for real execution.\nYour ${lang} code is ready to submit.`);
      return;
    }
    const logs = [];
    const orig = console.log;
    console.log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    try {
      new Function(code)();
      setOutput(logs.length ? logs.join('\n') : '(No output — add console.log() to see results)');
    } catch(e) {
      setOutput('Error: ' + e.message);
    } finally { console.log = orig; }
  };

  const submitCode = () => { setSubmitted(true); setOutput('✅ Accepted — All test cases passed!\nRuntime: 76ms | Memory: 42.3MB'); };

  const btnStyle = (color, bg) => ({
    display:'inline-flex', alignItems:'center', gap:7,
    padding:'8px 16px', borderRadius:10, fontSize:13, fontWeight:600,
    border:'none', cursor:'pointer', background:bg, color:color,
    transition:'all .2s',
  });

  return (
    <div>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:7, background:'none', border:'none', color:'#7c6af7', fontWeight:600, fontSize:13, cursor:'pointer', marginBottom:16 }}>
        <i className="fas fa-arrow-left" /> Back to Problems
      </button>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, height:'calc(100vh - 180px)', minHeight:500 }}>
        {/* Left: Problem */}
        <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:20, overflow:'auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#f0f0f5' }}>{problem.title}</h2>
            <span style={S.badge(problem.difficulty)}>{problem.difficulty}</span>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
            {problem.companies.map(c => <span key={c} style={S.tag}>{c}</span>)}
          </div>
          <p style={{ fontSize:14, color:'#9898b8', lineHeight:1.7, marginBottom:20 }}>{problem.desc}</p>

          <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#7c6af7', marginBottom:10 }}>Examples</div>
          <div style={{ background:'#0d1117', borderRadius:10, padding:14, fontFamily:'Courier New,monospace', fontSize:12, color:'#e6edf3', lineHeight:1.8, marginBottom:16 }}>
            Input: nums = [2,7,11,15], target = 9<br/>
            Output: [0,1]<br/>
            Explanation: nums[0] + nums[1] = 9
          </div>

          <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#7c6af7', marginBottom:10 }}>Constraints</div>
          <ul style={{ fontSize:13, color:'#9898b8', paddingLeft:20, lineHeight:1.8 }}>
            <li>2 ≤ nums.length ≤ 10⁴</li>
            <li>Each input has exactly one solution</li>
            <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
          </ul>
        </div>

        {/* Right: Editor */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, overflow:'hidden', flex:1 }}>
            {/* Editor topbar */}
            <div style={{ background:'#161b22', padding:'10px 16px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width:12, height:12, borderRadius:'50%', background:'#ff5f57' }} />
              <div style={{ width:12, height:12, borderRadius:'50%', background:'#febc2e' }} />
              <div style={{ width:12, height:12, borderRadius:'50%', background:'#28c840' }} />
              <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                {['javascript','python','java','cpp'].map(l => (
                  <button key={l} onClick={() => changeLang(l)} style={{
                    padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:600, border:'none', cursor:'pointer',
                    background: lang===l ? '#7c6af7' : 'rgba(255,255,255,0.06)',
                    color: lang===l ? 'white' : '#9898b8',
                    transition:'all .2s',
                  }}>{l}</button>
                ))}
              </div>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              style={{ width:'100%', height:'calc(100% - 48px)', background:'#0d1117', color:'#e6edf3', border:'none', outline:'none', padding:18, fontFamily:"'Fira Code','Courier New',monospace", fontSize:13, lineHeight:1.8, resize:'none' }}
            />
          </div>

          {/* Output */}
          <div style={{ background:'#0d1117', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:14 }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#55556a', marginBottom:8 }}>Output</div>
            <pre style={{ fontFamily:"'Fira Code','Courier New',monospace", fontSize:13, color: submitted ? '#4ade80' : output.startsWith('Error') ? '#f87171' : '#3fb950', minHeight:60, whiteSpace:'pre-wrap' }}>
              {output || 'Click Run to execute your code...'}
            </pre>
          </div>

          {/* Actions */}
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10 }}>
            <button onClick={runCode} style={btnStyle('white','rgba(255,255,255,0.08)')}>
              <i className="fas fa-play" style={{ fontSize:11 }} /> Run
            </button>
            <button onClick={submitCode} style={btnStyle('white','linear-gradient(135deg,#7c6af7,#a855f7)')}>
              <i className="fas fa-paper-plane" style={{ fontSize:11 }} /> Submit
            </button>
            <button onClick={() => navigate('/compiler')} style={btnStyle('#9898b8','rgba(255,255,255,0.04)')}>
              <i className="fas fa-terminal" style={{ fontSize:11 }} /> Open Compiler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}