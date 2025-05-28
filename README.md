# Statics SketchPad

An interactive iPad app designed to help civil engineering students master statics concepts through creating and analyzing free body diagrams (FBDs).

## Features

- **Learning Mode:** Explore pre-made FBDs with step-by-step explanations
- **Testing Mode:** Solve problems by drawing FBDs and writing equations
- **Interactive Canvas:** Draw with Apple Pencil support
- **Real-time Feedback:** Instant evaluation of solutions
- **Progress Tracking:** Track your learning journey

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start the development server:

```bash
npx expo start
```

## Development

- **iOS:** Press `i` to open iOS simulator
- **Android:** Press `a` to open Android emulator
- **Web:** Press `w` to open in web browser

## Tech Stack

- React Native with TypeScript
- Expo
- React Native Paper
- React Native Skia
- Supabase

## Project Structure

```
statics-sketchpad/
├── app/                # Main application directory
│   ├── (auth)/        # Authentication routes
│   └── (tabs)/        # Main app tabs
├── assets/            # Static assets
├── components/        # Reusable components
├── constants/         # App constants
├── hooks/            # Custom hooks
├── lib/              # Utility functions
├── store/            # State management
├── types/            # TypeScript definitions
└── utils/            # Helper functions
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
