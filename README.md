# Analytic_Hub
A robust personal finance tracker and analytical dashboard built to streamline expense ingestion, budget tracking, and real-time financial reporting.

## Key-features
**Responsive Dashboard**: Visualizes spending behaviors using responsive line and pie charts.

**Security Authentication**: Managed entirely via Firebase Auth (Email/Password & Google Provider).

**State management**: Predictable, global data flow handled via Redux Toolkit

**Responsive UI**: Clean, dark-mode-first interfaces built with Tailwind CSS and shadcn/ui.

## Tech Stack
**Frontend**: React (Vite), Tailwind CSS, shadcn/ui, Recharts,jspdf

**Backend as-a-service**: Firebase (Firestore, Auth)
**State management**: Redux Toolkit

## Get started
Follow these steps to set up the project locally
### Prerequisite
Ensure you have [node.js]
### 1. git clone
```bash
git clone[https://github.com/derick871/Analytic_Hub]
cd Analytic_hub

2. Install dependencies
npm install

3.Environmental variebles
Create a .env.local file in the root directory and add your configurations:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id

4.Run the server
```bash
npm run dev

 Project structure
src/
├── components/     # Reusable shadcn UI primitives (cards, buttons)
├── context/        # React Context providers for global themes
├── features/       # Redux slices and feature-specific logic
├── pages/          # Main dashboard views and authentication screens
├── utils/          # Formatting helpers and Firebase config
└── App.jsx         # App routing and layout shell.

Licence
Distributed under the MIT lisence
Copyright (c) 2026 Derick

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions: