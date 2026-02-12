Test instructions

- Local interactive test (watch mode):

```powershell
npm run test:local
```

- CI / headless test (uses Puppeteer Chromium, sets TMP/TEMP to C:\tmp):

```powershell
npm run test:ci
```

Notes:
- `test:ci` uses `scripts/run-with-puppeteer.js` which sets `CHROME_BIN`, `TMP`, `TEMP`, and `NODE_OPTIONS=--openssl-legacy-provider` before running tests.
- If ChromeHeadless fails to start, ensure `%TEMP%` is writable and no other Chrome processes are locking temp files. You can clear temp karma dirs with `rmdir /s /q "%TEMP%\karma-*"` after killing Chrome.
