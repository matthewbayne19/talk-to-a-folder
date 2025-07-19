# Talk to a Folder

## Project Concept

**Talk to a Folder** is a web application that allows users to chat with the contents of any Google Drive folder. By authenticating with Google, users can paste a folder URL, fetch all supported files inside, and ask questions about their contents. The app uses OpenAI's GPT-4o model to answer questions based on the actual text in the files, providing sources for its answers.

## Supported File Types

- Google Docs
- Google Sheets
- Google Slides
- PDF
- Microsoft Word
- Microsoft Excel
- Microsoft PowerPoint
- Plain Text
- CSV

## Reference Files Only Feature

- The application includes a "Reference Files Only" feature. When enabled, the assistant will answer questions strictly using the content found in the referenced files, ensuring that all responses are directly supported by the provided documents. This enhances transparency and trust in the answers, as every statement can be traced back to a specific file.

## How to Run the Project

### Prerequisites
- Node.js (v16+ recommended)
- npm (comes with Node.js)

### 1. Clone the repository
```bash
git clone https://github.com/matthewbayne19/talk-to-a-folder.git
cd talk-to-a-folder
```

### 2. Set up environment variables
- Copy the provided `.env` into the `backend/` directory. 

### 3. Install dependencies
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 4. Start the backend
```bash
cd ../backend
npm start
```

### 5. Start the frontend
```bash
cd ../frontend
npm start
```

- The frontend will run on [http://localhost:3000](http://localhost:3000)
- The backend will run on [http://localhost:4000](http://localhost:4000)

### 6. Log in and use the app
- Once the app is running, open [http://localhost:3000](http://localhost:3000) in your browser.
- Click **Get Started** on the landing page.
- Follow the Google authentication flow and **accept all permissions requested** (these are required to access your Drive files for chat).

### Testing the App

- To test the app, use the Gmail account details provided in the submission email. This account has access to folders and files suitable for testing all features.
- https://drive.google.com/drive/folders/19JAVLchtp2Qr-jVtIf3ZDrwwF_LHI3DX — This is the link to the test folder in Google Drive, accessible after authentication.

## Design Choices & Features

- **Google OAuth & Secure Logout:**
  - Users authenticate with Google to access their Drive folders securely.
  - A prominent logout button is always available, which revokes the token and clears the session.

- **Folder Input & File List:**
  - Users paste a Google Drive folder URL to fetch files.
  - The file list is displayed in a modern glassmorphism card with icons for each file type.
  - Each file in the list is clickable, opening the file in Google Drive in a new tab.
  - The file list is scrollable if there are many files.

- **Chat Experience:**
  - Users can ask questions about the folder's contents; the assistant answers using only the text in the files.
  - The chat UI is modern, with a dark theme, glowing accents, and a loading animation with cycling messages.
  - If the folder is empty or the link is invalid, the user receives clear feedback.

- **Citations & Sources:**
  - When the assistant references information from files, clickable citation links are provided at the end of the answer.
  - This allows users to verify the source of any information.

- **Reference Files Only Mode:**
  - When enabled, the assistant will answer strictly using the content from the referenced files, providing even more reliable and source-backed responses.

- **Session Expiration Handling:**
  - If the user's session expires, they are redirected to a session expired page and prompted to log in again.

- **Responsive & Accessible:**
  - The UI is designed to be visually appealing, accessible, and responsive for a wide range of devices.

- **Route Protection:**
  - Signed-in users are always redirected to the chat home page (`/home`), and cannot access the landing or other routes. Unauthenticated users cannot access `/home` or other protected routes, ensuring secure and intuitive navigation.

## Architecture Overview

**Frontend (React.js):**
- **Landing Page**: OAuth authentication flow with Google
- **Home Page**: Main application interface with folder input, file list, and chat
- **Components**: Modular UI components (FolderInput, ChatBox, FileList, LogoutButton)
- **State Management**: React hooks for managing authentication, file data, and chat messages
- **Route Protection**: Automatic redirection based on authentication status

**Backend (Node.js/Express):**
- **OAuth Handler**: Google OAuth token exchange and validation
- **Google Drive API**: File listing and content extraction for supported formats
- **OpenAI Integration**: GPT-4o chat completion with file context
- **File Processing**: Specialized helpers for different file types (PDF, Word, Excel, etc.)
- **Session Management**: Token validation and secure logout

**Data Flow:**
1. User authenticates via Google OAuth
2. Frontend sends folder URL to backend
3. Backend fetches files from Google Drive
4. File contents are extracted and sent to OpenAI
5. Chat responses include citations to source files

---

