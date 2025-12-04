# DTC React Chatbot

A React.js chatbot application converted from the original HTML implementation.

## Features

- Interactive chatbot interface with SAM (Smart Assistant)
- Real-time streaming responses from the API
- Chat history management
- Mobile-responsive design
- Minimize/maximize chat functionality

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
DTC_react/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx      # Search input and AskSAM button
│   │   ├── ChatContainer.jsx   # Chat window container
│   │   └── Message.jsx         # Individual message component
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## API Configuration

The API URL is configured in `src/App.jsx`:
- Production: `https://qraiebot.hbssweb.com/users/qraieSlmEngine`
- Local (commented): `http://localhost:3100/qraieAiEngine`

To change the API endpoint, modify the `API_URL` constant in `src/App.jsx`.

## Technologies Used

- React 18.2.0
- Vite 5.0.8
- Modern JavaScript (ES6+)

