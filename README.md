# Next Day MVP

A modern AI-powered app and website development agency website. This project showcases AI features like voice-to-text idea capture, AI processing of ideas, and app icon generation using OpenAI's APIs.

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/TechIntegrationLabs/nextdaymvp)

## Features

- Interactive hero section with particle animations
- Voice recording and transcription using OpenAI's Whisper API
- AI-powered idea processing with GPT-4
- App icon generation using Stability AI
- Contact form with webhook integration
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TechIntegrationLabs/nextdaymvp.git
   cd nextdaymvp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see section below)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables Setup

This project uses environment variables to manage API keys and other sensitive information. Follow these steps to set up your environment:

1. Copy the example environment file to create your own:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace the placeholder values with your actual API keys:
   - `VITE_OPENAI_API_KEY`: Your OpenAI API key for voice transcription and idea processing
   - `VITE_STABILITY_API_KEY`: Your Stability AI API key for app icon generation
   - `VITE_GOOGLE_SHEET_ID`: Your Google Sheet ID for fetching recent projects
   - `VITE_GOOGLE_API_KEY`: Your Google API key for accessing Google Sheets API

> **Important**: Never commit your `.env` file to version control. It's already added to `.gitignore` to prevent accidental commits.

## Technologies Used

- React with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Framer Motion for animations
- OpenAI APIs (Whisper, GPT-4)
- Stability AI for image generation
- React Router for navigation
- React Hook Form for form handling

## License

[MIT](LICENSE)