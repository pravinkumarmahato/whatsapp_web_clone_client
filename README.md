# WhatsApp Web Clone - Client

A modern WhatsApp Web clone built with React, TypeScript, and Tailwind CSS.


## 🔗 Live Demo
- 🌐 Frontend: https://whatsapp-web-clone-client-plum.vercel.app/
- ⚙️ Backend API : https://whatsapp-web-clone-server-82p9.onrender.com

## Github Repo
-  Frontend: https://github.com/pravinkumarmahato/whatsapp_web_clone_client
-  Backend API : https://github.com/pravinkumarmahato/whatsapp_web_clone_server

## User for Demo
### Ravi Kumar
  - Phone Number: 919937320320
  - Password: @Ravi1234

### Neha Joshi
  - Phone Number: 929967673820
  - Password: @Neha1234

### Raghav
  - Phone Number: 918329446654
  - Password: @Raghav1234


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
- **Material UI** - Styling
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
├── assets/                 # Icon Svg files
├── components/             # React components
│   ├── chatMenu.tsx        # Left Side chat Nevigation Window
│   ├── ChatWindow.tsx      # Main chat interface
│   ├── SettingMenu.tsx     # Left Side Setting Nevigation Window
│   ├── NewChatWindow.tsx   # New chat interface to start chatting with a new person
│   ├── Sidebar.tsx         # Conversation list
│   ├── Login.tsx           # Login form
│   └── Register.tsx        # Registration form
├── services/               # API services
│   └── api.ts              # HTTP client and API calls
├── socket/                 # Socket.io configuration
│   └── socket.ts           # Socket connection
├── utils/                  # Configuration and common functions
│   └── utils.ts            
├── types.ts                # TypeScript type definitions
├── svg.d.ts                # Custom svg module definition
├── App.tsx                 # Main application component
├── App.css                 # Main application stylesheet
├── main.tsx                # Application entry point
└── index.css               # Application entry point stylesheet

```

## API Endpoints

The client communicates with the following server endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/:id` - Get messages for a conversation
- `POST /api/messages` - Send a new message
- `GET /api/auth/login?phone=<phone>` - search valid phone number to start new chat

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

### Environment Variables

- `VITE_SERVER_URL` - Backend server URL : https://whatsapp-web-clone-server-82p9.onrender.com (default: http://localhost:5000)
