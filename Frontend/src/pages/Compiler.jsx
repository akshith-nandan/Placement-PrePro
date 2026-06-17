import React, { useState } from 'react';

const TEMPLATES = {
  javascript: `// JavaScript - PlacementPro Compiler
console.log("Hello, PlacementPro! 🎯");

// Two Sum Example
function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map[need] !== undefined) return [map[need], i];
    map[nums[i]] = i;
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
  python: `# Python - PlacementPro Compiler
print("Hello, PlacementPro! 🎯")

# Two Sum Example
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []

print(two_sum([2, 7, 11, 15], 9))  # [0, 1]`,
  java: `// Java - PlacementPro Compiler
import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            if (map.containsKey(target - nums[i]))
                return new int[]{map.get(target - nums[i]), i};
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2,7,11,15}, 9)));
    }
}`,
  cpp: `// C++ - PlacementPro Compiler
#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int,int> seen;
    for (int i = 0; i < nums.size(); i++) {
        if (seen.count(target - nums[i]))
            return {seen[target - nums[i]], i};
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> v = {2, 7, 11, 15};
    auto r = twoSum(v, 9);
    cout << "[" << r[0] << ", " << r[1] << "]" << endl;
    return 0;
}`,
  c: `// C - PlacementPro Compiler
#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;
    for (int i = 0; i < numsSize; i++)
        for (int j = i+1; j < numsSize; j++)
            if (nums[i] + nums[j] == target) {
                result[0] = i; result[1] = j;
                return result;
            }
    return result;
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int retSize;
    int* r = twoSum(nums, 4, 9, &retSize);
    printf("[%d, %d]\\n", r[0], r[1]);
    free(r);
    return 0;
}`,
};

const QUICK_PROBLEMS = [
  { label:'Two Sum', key:'twosum', diff:'Easy', companies:'Amazon, Google' },
  { label:'Fibonacci', key:'fib', diff:'Easy', companies:'TCS, Infosys' },
  { label:'Palindrome', key:'palindrome', diff:'Medium', companies:'Accenture' },
  { label:'Factorial', key:'factorial', diff:'Easy', companies:'Wipro, TCS' },
];

const PROBLEM_CODE = {
  twosum: TEMPLATES.javascript,
  fib: `// Fibonacci Series
function fib(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
for (let i = 0; i <= 10; i++) console.log(\`fib(\${i}) = \${fib(i)}\`);`,
  palindrome: `// Palindrome Check
function isPalindrome(s) {
  s = s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return s === s.split("").reverse().join("");
}
console.log(isPalindrome("racecar"));  // true
console.log(isPalindrome("hello"));   // false
console.log(isPalindrome("A man a plan a canal Panama")); // true`,
  factorial: `// Factorial using Recursion
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
for (let i = 0; i <= 10; i++) console.log(\`\${i}! = \${factorial(i)}\`);`,
};

const diffColor = d => d === 'Easy' ? '#4ade80' : d === 'Medium' ? '#fbbf24' : '#f87171';

export default function Compiler() {
  const [lang, setLang] = useState('javascript');
  const [code, setCode] = useState(TEMPLATES.javascript);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [isError, setIsError] = useState(false);
  const [running, setRunning] = useState(false);

  const changeLang = l => { setLang(l); setCode(TEMPLATES[l]); setOutput(''); };

  const runCode = () => {
    setRunning(true);
    setIsError(false);
    setTimeout(() => {
      if (lang !== 'javascript') {
        setOutput(`[${lang.toUpperCase()} Runtime]\n\nConnect Judge0 API for real ${lang} execution.\n\nPOST https://judge0-ce.p.rapidapi.com/submissions\n{ "language_id": <id>, "source_code": "...", "stdin": "${stdin}" }\n\nYour code is saved and ready.`);
        setIsError(false);
      } else {
        const logs = [];
        const orig = console.log;
        console.log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '));
        try {
          new Function(code)();
          setOutput(logs.length ? logs.join('\n') : '(No output — use console.log() to print)');
          setIsError(false);
        } catch(e) {
          setOutput('Error: ' + e.message);
          setIsError(true);
        } finally { console.log = orig; }
      }
      setRunning(false);
    }, 300);
  };

  const s = {
    card: { background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14 },
    langBtn: (active) => ({ padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:600, border:'none', cursor:'pointer', transition:'all .2s', background: active ? '#7c6af7' : 'rgba(255,255,255,0.06)', color: active ? 'white' : '#9898b8' }),
    btn: (primary) => ({ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, fontSize:13, fontWeight:600, border:'none', cursor:'pointer', transition:'all .2s', background: primary ? 'linear-gradient(135deg,#7c6af7,#a855f7)' : 'rgba(255,255,255,0.07)', color: primary ? 'white' : '#9898b8', boxShadow: primary ? '0 4px 16px rgba(124,106,247,0.25)' : 'none' }),
  };

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#f0f0f5', letterSpacing:-0.5 }}>Online Compiler</h1>
        <p style={{ color:'#9898b8', marginTop:4, fontSize:14 }}>Write and run code in multiple languages</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16 }}>
        {/* Left: Editor + Output */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Editor */}
          <div style={{ ...s.card, overflow:'hidden' }}>
            <div style={{ background:'#161b22', padding:'10px 16px', display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid rgba(255,255,255,0.06)', flexWrap:'wrap' }}>
              <div style={{ display:'flex', gap:6 }}>
                <div style={{ width:12, height:12, borderRadius:'50%', background:'#ff5f57' }} />
                <div style={{ width:12, height:12, borderRadius:'50%', background:'#febc2e' }} />
                <div style={{ width:12, height:12, borderRadius:'50%', background:'#28c840' }} />
              </div>
              <div style={{ display:'flex', gap:6, marginLeft:12 }}>
                {['javascript','python','java','cpp','c'].map(l => (
                  <button key={l} style={s.langBtn(lang===l)} onClick={() => changeLang(l)}>{l}</button>
                ))}
              </div>
              <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                <button onClick={() => setCode(TEMPLATES[lang])} style={s.btn(false)}>
                  <i className="fas fa-rotate-left" /> Reset
                </button>
                <button onClick={runCode} disabled={running} style={s.btn(true)}>
                  <i className={`fas ${running ? 'fa-spinner fa-spin' : 'fa-play'}`} />
                  {running ? 'Running...' : 'Run Code'}
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              style={{ width:'100%', minHeight:340, background:'#0d1117', color:'#e6edf3', border:'none', outline:'none', padding:20, fontFamily:"'Fira Code','Courier New',monospace", fontSize:13, lineHeight:1.8, resize:'vertical' }}
            />
          </div>

          {/* Stdin */}
          <div style={s.card}>
            <div style={{ padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#55556a' }}>
                <i className="fas fa-keyboard" style={{ marginRight:6 }} />Standard Input
              </span>
            </div>
            <textarea
              value={stdin}
              onChange={e => setStdin(e.target.value)}
              placeholder="Enter input values here (one per line)..."
              style={{ width:'100%', background:'transparent', border:'none', outline:'none', color:'#9898b8', padding:'12px 16px', fontFamily:"'Fira Code','Courier New',monospace", fontSize:13, resize:'none', minHeight:70 }}
            />
          </div>

          {/* Output */}
          <div style={{ ...s.card, overflow:'hidden' }}>
            <div style={{ padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'#55556a' }}>
                <i className="fas fa-terminal" style={{ marginRight:6 }} />Output
              </span>
              {output && <span style={{ fontSize:10, color: isError ? '#f87171' : '#4ade80', fontWeight:700, marginLeft:'auto' }}>
                {isError ? '✗ Error' : '✓ Success'}
              </span>}
            </div>
            <pre style={{ padding:'14px 18px', fontFamily:"'Fira Code','Courier New',monospace", fontSize:13, color: isError ? '#f87171' : '#3fb950', minHeight:90, whiteSpace:'pre-wrap', background:'#0d1117', margin:0 }}>
              {output || 'Click "Run Code" to execute your program...'}
            </pre>
          </div>
        </div>

        {/* Right: Quick problems */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={s.card}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:700, fontSize:14, color:'#f0f0f5' }}>
              Quick Problems
            </div>
            <div style={{ padding:12, display:'flex', flexDirection:'column', gap:8 }}>
              {QUICK_PROBLEMS.map(p => (
                <div key={p.key}
                  onClick={() => { setLang('javascript'); setCode(PROBLEM_CODE[p.key]); setOutput(''); }}
                  style={{ padding:14, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, cursor:'pointer', transition:'all .2s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor='rgba(124,106,247,0.35)'; e.currentTarget.style.background='rgba(124,106,247,0.06)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.06)'; e.currentTarget.style.background='rgba(255,255,255,0.025)'; }}
                >
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontWeight:600, fontSize:13, color:'#f0f0f5' }}>{p.label}</span>
                    <span style={{ fontSize:10, fontWeight:700, color:diffColor(p.diff), background:`${diffColor(p.diff)}18`, padding:'2px 8px', borderRadius:99 }}>{p.diff}</span>
                  </div>
                  <div style={{ fontSize:11, color:'#55556a' }}>{p.companies}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Language info */}
          <div style={s.card}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:700, fontSize:14, color:'#f0f0f5' }}>
              Language Info
            </div>
            <div style={{ padding:'12px 16px' }}>
              {[
                { lang:'JavaScript', note:'Runs live in browser', color:'#fbbf24' },
                { lang:'Python', note:'Judge0 API required', color:'#60a5fa' },
                { lang:'Java', note:'Judge0 API required', color:'#f87171' },
                { lang:'C / C++', note:'Judge0 API required', color:'#a78bfa' },
              ].map(l => (
                <div key={l.lang} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:13, color:'#9898b8' }}>{l.lang}</span>
                  <span style={{ fontSize:11, color:l.color, fontWeight:600 }}>{l.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Keyboard shortcuts */}
          <div style={s.card}>
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontWeight:700, fontSize:14, color:'#f0f0f5' }}>
              Tips
            </div>
            <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:8 }}>
              {[
                'Use console.log() to print output',
                'JavaScript runs instantly in browser',
                'Connect Judge0 for Python/Java/C++',
                'Use stdin for test case inputs',
              ].map((tip, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:12, color:'#9898b8' }}>
                  <span style={{ color:'#7c6af7', marginTop:1 }}>→</span> {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}