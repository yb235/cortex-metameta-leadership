# Cortex — Metameta

Complete static hackathon app for lean D2C teams to triage orders, support, and invoices with autonomous AI triage. No build step, backend, or API keys required.

## Public Deployment

- **Live Showcase URL (GitHub Pages)**: [https://yb235.github.io/cortex-metameta-leadership/](https://yb235.github.io/cortex-metameta-leadership/)
- **Direct Leadership Voice Walkthrough**: [https://yb235.github.io/cortex-metameta-leadership/?walkthrough=1](https://yb235.github.io/cortex-metameta-leadership/?walkthrough=1)
- **Live Tunnel (Cloudflare)**: [https://frankfurt-tba-surge-advertise.trycloudflare.com](https://frankfurt-tba-surge-advertise.trycloudflare.com)
- **GitHub Repository**: [https://github.com/yb235/cortex-metameta-leadership](https://github.com/yb235/cortex-metameta-leadership)

## Features & Leadership Voice Walkthrough Mode

1. **Voice-Controlled Demo Mode**:
   - Hands-free microphone listening via Web Speech API (`SpeechRecognition`).
   - Natural voice commands: `"Process order"`, `"Customer support ticket"`, `"Review invoice"`, `"Demand forecast"`, `"Clear demo log"`, and `"Start leadership walkthrough"`.
   - On-device speech dictation: speak any operational text to transcribe directly into the ops intake queue.
   - Interactive one-click voice prompt chips for simulated voice testing without microphone requirements.

2. **Guided Leadership Walkthrough HUD**:
   - 5-step executive tour highlighting operational ROI, zero-latency processing, on-device PII masking, churn risk escalation, and spend approval thresholds.
   - Real-time speech synthesis (`SpeechSynthesis`) with natural executive narration and synchronized captions.
   - Full playback controls: Step forward/back, Pause/Resume, Sound mute/unmute, and Step dot selector.
   - Deep-linkable via `/?walkthrough=1` or `/?demo=leadership`.

3. **Core Operations Triage & Privacy**:
   - Real-time classification into Order Fulfillment, Support Care, or Accounts Payable.
   - On-device pattern-based masking of addresses, phones, and emails.
   - Persistent append-only activity audit log stored in browser `localStorage`.
   - Starter Plan ($99/mo) with self-serve demo signup at `/signup`.

## Run locally

Unzip, enter the cortex-metameta folder, and run:

    python3 -m http.server 8000

Open http://localhost:8000/ in your browser.
