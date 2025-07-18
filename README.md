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

## How to Run the Project

### Prerequisites
- Node.js (v16+ recommended)
- npm (comes with Node.js)

### 1. Clone the repository
```bash
git clone <your-repo-url>
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

### Sample Folder for Testing

- This repository includes a `sample_folder` folder containing example files of supported types.
- You can upload this folder to your Google Drive and use its link with the app to test the chat and citation features.
- The sample files cover all supported formats, making it easy to try out the app's capabilities right away.

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

- **Session Expiration Handling:**
  - If the user's session expires, they are redirected to a session expired page and prompted to log in again.

- **Responsive & Accessible:**
  - The UI is designed to be visually appealing, accessible, and responsive for a wide range of devices.

---

