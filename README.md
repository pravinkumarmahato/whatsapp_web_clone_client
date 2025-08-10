# WhatsApp Web Clone - Client

A modern WhatsApp Web clone built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Authentication**: Login and registration system
- 💬 **Real-time Messaging**: Socket.io integration for instant messaging
- 🎨 **WhatsApp Web UI**: Authentic WhatsApp Web design and colors
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔍 **Search Conversations**: Search through your conversations
- 📅 **Message History**: View messages grouped by date
- ✨ **Modern UI**: Clean, intuitive interface

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- The server must be running (see server README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the environment variables in `.env`:
```
VITE_SERVER_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Start Chatting**: Select a conversation from the sidebar to start messaging
3. **Send Messages**: Type your message and press Enter or click the send button
4. **Search**: Use the search bar to find specific conversations
5. **Logout**: Click the logout button in the sidebar to sign out

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatWindow.tsx  # Main chat interface
│   ├── Sidebar.tsx     # Conversation list
│   ├── Login.tsx       # Login form
│   └── Register.tsx    # Registration form
├── services/           # API services
│   └── api.ts         # HTTP client and API calls
├── socket/            # Socket.io configuration
│   └── socket.ts      # Socket connection
├── types.ts           # TypeScript type definitions
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## API Endpoints

The client communicates with the following server endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/:id` - Get messages for a conversation
- `POST /api/messages` - Send a new message

## Socket Events

- `message` - Receive new messages in real-time
- `sendMessage` - Send a new message

## Styling

The application uses Tailwind CSS with custom WhatsApp Web colors:

- Primary Green: `#00a884`
- Light Green: `#d9fdd3`
- Background: `#efeae2`
- Gray: `#f0f2f5`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

- `VITE_SERVER_URL` - Backend server URL (default: http://localhost:5000)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes only.
