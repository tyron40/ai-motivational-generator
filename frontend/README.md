# Frontend - AI Motivational Generator

React + Vite frontend for the AI Motivational Speech & Song Generator.

## Features

- Modern React UI with hooks
- Mode selection (Speech/Song)
- Text prompt input
- Voice selection (preset + upload)
- Audio player
- Download functionality
- Responsive design
- Legal compliance UI

## Tech Stack

- React 18
- Vite (build tool)
- Axios (HTTP client)
- CSS3 (styling)

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on http://localhost:3000

## Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## Components

### App.jsx

Main application component with:
- State management
- API calls
- User interface
- Step-based workflow

### Workflow Steps

1. **Input Step**: Prompt, mode, voice selection
2. **Text Generated**: Review generated text
3. **Audio Generated**: Play and download audio

## API Integration

The frontend communicates with the backend via proxy:

```javascript
// Configured in vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true
  }
}
```

## Styling

- Gradient background
- Card-based layout
- Responsive grid
- Smooth animations
- Modern UI components

## Legal Compliance

UI includes:
- Voice upload disclaimer
- AI disclosure badges
- Legal notices
- Terms confirmation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

```bash
# Run with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment

No environment variables needed. Backend URL is proxied through Vite.

For production, update API calls to use absolute URLs.
