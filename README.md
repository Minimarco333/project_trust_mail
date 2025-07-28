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

![TrustMail Logo](./app/icon.png)

TrustMail is a complete platform for building agentic AI-powered SaaS products. This template allows you to create Agentic SaaS applications without wasting time on the plumbing and infrastructure so you can build products in days and not months.

TrustMail empowers students, developers, startups, and entrepreneurs to build fully agentic SaaS solutions at lightning speed by handling security (logins & registration), database setup, SEO, and monetization right out of the box—powered by Next.js, Tailwind, and React. All you bring is your idea!

<sub>**Watch/Star the repo to be notified when updates are pushed**</sub>

## Getting Started

Follow these steps to get TrustMail up and running on your machine:

1. Create a new folder and open WindSurf and the folder  
2. Clone the repository:
   ```bash
   git clone https://github.com/fenago/fenago21.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Remove the original remote (if you want to push to your own repository):
   ```bash
   git remote remove origin
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

That will get you running!

6. Environment setup:
   - Rename `.env.sample` to `.env`
   - Add your API keys and other credentials to the `.env` file

## Documentation

TrustMail comes with comprehensive documentation to help you get started quickly:

### [DevDocs](./DevDocs)

Implementation guides for setting up core functionality:

- [Setting Up Email With Resend](./DevDocs/1_Setting_Up_Email_With_Resend.md)
