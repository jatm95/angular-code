#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');

(async () => {
  try {
    const puppeteer = require('puppeteer');
    const chromePath = puppeteer.executablePath();

    const tmpDir = 'C:\\tmp';
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });


    console.log('run-with-puppeteer: chromePath=', chromePath);
    console.log('run-with-puppeteer: tmpDir=', tmpDir);

    const env = Object.assign({}, process.env, {
      CHROME_BIN: chromePath,
      TMP: tmpDir,
      TEMP: tmpDir,
      NODE_OPTIONS: '--openssl-legacy-provider'
    });

    // Sanity-check: try launching Puppeteer's Chromium directly to capture any launch errors early
    try {
      console.log('run-with-puppeteer: checking puppeteer launch...');
      const browser = await puppeteer.launch({ executablePath: chromePath, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      await browser.close();
      console.log('run-with-puppeteer: puppeteer launch OK');
    } catch (launchErr) {
      console.error('run-with-puppeteer: puppeteer failed to launch Chromium:', launchErr);
      // continue to run tests anyway to capture Karma/launcher logs
    }

    const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const child = spawn(npxCmd, ['ng', 'test', '--watch=false', '--browsers=ChromeHeadlessNoSandbox'], { stdio: 'inherit', env, shell: true });

    child.on('exit', code => process.exit(code));
    child.on('error', err => { console.error(err); process.exit(1); });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
