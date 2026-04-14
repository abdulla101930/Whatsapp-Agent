# From project root: .\start-dev.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Checking .env.local and Supabase..." -ForegroundColor Cyan
npm run check-env
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Next steps for WhatsApp (Meta needs HTTPS):" -ForegroundColor Yellow
Write-Host "  1. Keep this window running (Next.js on http://localhost:3000)"
Write-Host "  2. Open a NEW terminal in this folder and run ONE of:"
Write-Host "       npm run tunnel          (localtunnel; URL printed in that window)"
Write-Host "       ngrok http 3000         (needs: ngrok config add-authtoken <token>)"
Write-Host "  3. Meta Developers > your app > WhatsApp > Configuration:"
Write-Host "     Callback URL = https://<public-host>/api/webhook"
Write-Host "     Verify token = same as WHATSAPP_VERIFY_TOKEN in .env.local"
Write-Host "  4. Subscribe webhook field: messages"
Write-Host ""

npm run dev
