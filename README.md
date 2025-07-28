# 📧 TrustMail — AI-Powered Email Scam Detection & Summarization

Protect your inbox with AI. TrustMail analyzes any email and instantly quantifies how likely it is to be a scam while giving you a concise, human-friendly summary. 🙌

---

## ✨ Key Features

- 🔍 **Advanced Scam Detection** – domain reputation, homograph attack checks, link inspection & NLP-based content analysis.
- 📊 **Risk Score (0-100)** – color-coded so you know at a glance whether it’s safe.
- 📝 **One-Click Summary** – TL;DR of the email content so you can decide fast.
- 🛡️ **Privacy-First** – we never store your emails; analysis happens server-side and is discarded immediately.
- ⚡ **Built with Next.js 14, Tailwind CSS, MongoDB & OpenAI**.

## 🚀 Getting Started Locally

1. `git clone https://github.com/Minimarco333/project_trust_mail.git`
2. `cd project_trust_mail`
3. `npm install`
4. Copy `.env.sample` → `.env` and add your provider keys (OpenAI, Resend, Stripe, etc.).
5. `npm run dev` → visit `http://localhost:3000`.

## 🖥️ How It Works

1. Paste or forward any suspicious email into TrustMail.
2. Our AI pipeline extracts senders, domains, links & linguistic cues.
3. Each signal is scored; the weighted total becomes the **Threat Score**.
4. You receive:
   - The score with an explanation of risky elements.
   - A bullet-point summary of the email.
   - Recommended next steps (e.g., *delete*, *verify sender*, *safe*).

## 📚 Documentation & Dev Guides

Detailed setup docs live in the [`/DevDocs`](./DevDocs) folder:

- ✉️ Resend email service
- 🍃 MongoDB Atlas
- 🔐 Google & Magic-Link Auth
- 💳 Stripe Payments
- 📈 SEO & Analytics

## 🤝 Contributing

We ❤️ pull requests! Please open an issue to discuss major features beforehand.

## 💌 Support

Questions, bugs, or suggestions? Email **support@trustmail.com** or open an issue.

---

© 2025 TrustMail  |  Keeping Your Inbox Safe 📭

forked from https://github.com/fenago/fenago21