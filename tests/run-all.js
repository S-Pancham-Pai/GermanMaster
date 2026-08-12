/* Runs every gmt-*.js suite in sequence; exit non-zero if any fails. */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const suites = fs.readdirSync(__dirname).filter(f => /^gmt-.*\.js$/.test(f)).sort();
console.log('suites: ' + suites.join(', ') + '\n');
let bad = 0;
for (const s of suites) {
  console.log('===== ' + s + ' =====');
  try {
    const out = execFileSync(process.execPath, [path.join(__dirname, s)], { encoding: 'utf8', timeout: 180000 });
    console.log(out.split('\n').slice(-4).join('\n'));
  } catch (e) {
    bad++;
    console.log((e.stdout || '').split('\n').slice(-25).join('\n'));
    console.error('SUITE FAILED: ' + s + ' ' + (e.stderr || '').split('\n').slice(0, 6).join('\n'));
  }
}
if (bad) { console.error(`\n${bad} suite(s) failed`); process.exit(1); }
console.log('\nALL SUITES PASS');
