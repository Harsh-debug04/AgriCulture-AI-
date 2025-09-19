# AgriCart: Your AI Farming Assistant

AgriCart is an intelligent, AI-powered web application designed to serve as a comprehensive digital assistant for farmers, with a special focus on Indian agriculture. It leverages the power of generative AI to provide crucial information and tools, helping farmers make informed decisions, improve crop yield, and stay updated with the latest agricultural trends. The application is fully responsive, supports both English and Hindi, and features a modern, clean user interface with light and dark modes.

## Features

- **Conversational AI Assistant**: An interactive chatbot that can answer a wide range of agriculture-related questions, provide structured information, and even generate relevant charts for data visualization.
- **Pest & Disease Diagnosis**: Upload an image of an affected plant and provide a description to get an AI-powered diagnosis, including identification, health status, and recommended remedies.
- **Real-time Market Data**: Get up-to-date commodity prices from various mandis (markets) across India. Users can search for specific crops to see their current market value and price trends.
- **Weather Forecast**: Provides the current weather conditions and a 7-day forecast for any location, helping farmers plan their activities.
- **Crop Information Hub**: A detailed database of common crops, offering comprehensive information on cultivation, pest management, and post-harvest practices.
- **Agricultural News**: A continuously updated feed of the latest news articles relevant to the agriculture sector.
- **Multi-language Support**: The entire UI and AI responses can be toggled between English and Hindi.
- **Voice Interaction**: The chat assistant supports both speech-to-text (voice input) and text-to-speech (audio responses) for a hands-free experience.
- **Modern UI**: Built with ShadCN UI and Tailwind CSS for a professional, responsive, and accessible user experience, including a dark mode.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Google AI](https://ai.google/) via [Genkit](https://firebase.google.com/docs/genkit)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/) (v20 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)

## Getting Started

Follow these steps to set up and run the project in your local environment.

### 1. Clone the Repository

First, clone the repository to your local machine using Git:

```bash
git clone https://github.com/your-username/agricart.git
cd agricart
```

### 2. Install Dependencies

Install the required npm packages:

```bash
npm install
```

### 3. Set Up Environment Variables

The application uses Google AI for its generative AI features, which requires an API key.

1.  Create a new file named `.env` in the root directory of the project.
2.  Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add the API key to your `.env` file like this:

    ```env
    # .env
    GEMINI_API_KEY=YOUR_GOOGLE_AI_API_KEY
    ```

### 4. Run the Application

Once the dependencies are installed and the environment variables are set, you can run the development server. The Genkit AI services and the Next.js frontend need to be run concurrently.

- **To run the AI services (Genkit)**:
  Open a terminal and run:
  ```bash
  npm run genkit:watch
  ```
  This command starts the Genkit server and will automatically restart it when you make changes to any flow files.

- **To run the Next.js frontend**:
  Open a second terminal and run:
  ```bash
  npm run dev
  ```

Your application should now be running locally. You can access it at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server for the built application.
- `npm run lint`: Runs ESLint to check for code quality and style issues.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
- `npm run genkit:dev`: Starts the Genkit development server.
- `npm run genkit:watch`: Starts the Genkit server in watch mode.

---

This README provides a comprehensive guide to understanding, setting up, and running the AgriCart application. Happy farming and coding!


## 📁 Project Structure

```
.
├── src
│   ├── ai
│   │   ├── flows               # Contains the Genkit AI flows
│   │   └── genkit.ts           # Genkit configuration
│   ├── app                     # Next.js app directory
│   │   ├── api                 # API routes
│   │   ├── (main)              # Main application pages
│   │   └── layout.tsx          # Root layout
│   ├── components              # Reusable UI components
│   ├── hooks                   # Custom React hooks
│   └── lib                     # Utility functions and libraries
├── public                      # Static assets
├── .firebaserc                 # Firebase configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
└── README.md                   # This file
```

## 🤖 AI Flows

The application uses [Genkit](https://ai.google.dev/docs/genkit) to define and run the AI flows. The core flow is:

*   **`answerAgricultureQueryFlow`**: This flow takes a user's query and language as input. It uses a powerful language model to generate a comprehensive answer, suggest follow-up questions, and provide data for charts if applicable.

The prompt for this flow is designed to make the AI an expert in agriculture, with a focus on Indian farming practices.

