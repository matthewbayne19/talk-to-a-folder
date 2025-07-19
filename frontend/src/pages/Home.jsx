// Home.jsx
// Main page for authenticated users: handles folder input, file fetching, chat, and UI state.

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  Tooltip,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import FolderInput from "../components/FolderInput";
import ChatBox from "../components/ChatBox";
import FileList from "../components/FileList";
import LogoutButton from "../components/LogoutButton";

// Extracts the folder ID from a Google Drive folder URL
const extractFolderId = (url) => {
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return folderMatch ? folderMatch[1] : null;
};

// Main Home page component
function Home() {
  // State for folder URL input, initialize from localStorage if present
  const [folderUrl, setFolderUrl] = useState(() => localStorage.getItem('folder_url') || "");
  // List of files in the selected folder
  const [files, setFiles] = useState([]);
  // Contents of each file (for chat context)
  const [fileContents, setFileContents] = useState([]);
  // Chat message history
  const [chatMessages, setChatMessages] = useState([]);
  // UI state for chat typing indicator
  const [isTyping, setIsTyping] = useState(false);
  // Loading spinner state
  const [isLoading, setIsLoading] = useState(false);
  // Error message for user feedback
  const [error, setError] = useState("");
  // Whether to show the folder input or the chat UI
  const [showInput, setShowInput] = useState(true);
  // Loading messages to cycle through
  const loadingMessages = [
    "Fetching files from Google Drive...",
    "Preparing Chat Agent...",
    "Almost ready!"
  ];
  // Index of the current loading message
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const navigate = useNavigate();
  // Reference Files Only toggle state
  const [referenceFilesOnly, setReferenceFilesOnly] = useState(true);

  // Keep folderUrl in sync with localStorage
  useEffect(() => {
    if (folderUrl) {
      localStorage.setItem('folder_url', folderUrl);
    }
  }, [folderUrl]);

  // Cycle through loading messages while loading
  useEffect(() => {
    if (isLoading) {
      setLoadingMessageIndex(0);
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading, loadingMessages.length]);

  // Handles fetching files from the Google Drive folder
  const handleFetchFiles = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const accessToken = localStorage.getItem("access_token");
    const folderId = extractFolderId(folderUrl);

    if (!folderId) {
      setIsLoading(false);
      setError("Invalid Google Drive folder URL.");
      return;
    }

    try {
      // Request file list from backend
      const res = await axios.post("http://localhost:4000/list-files", {
        accessToken,
        folderId,
      });
      if (!res.data.files || res.data.files.length === 0) {
        setIsLoading(false);
        setError("This folder is empty. Please add files to the folder and try again.");
        return;
      }
      setFiles(res.data.files);

      // Request file contents for chat context
      const contentsRes = await axios.post("http://localhost:4000/get-file-contents", {
        accessToken,
        files: res.data.files,
      });

      setFileContents(contentsRes.data.contents);
      setShowInput(false);
    } catch (err) {
      // Handle session expiration and other errors
      console.error("Error fetching files or contents:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/session-expired");
        return;
      } else if (err.response?.status === 404) {
        setError("This Google Drive folder does not exist or you do not have access. Please check the link and try again.");
      } else {
        setError("Failed to load files from Google Drive.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handles sending a chat message to the assistant
  const handleSend = async (userMessage) => {
    const newMessage = {
      message: userMessage,
      direction: "outgoing",
      sender: "user",
    };

    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Send chat request to backend
      const res = await axios.post("http://localhost:4000/ask-agent", {
        contents: fileContents,
        question: userMessage,
        referenceFilesOnly,
      });

      setChatMessages((prev) => [
        ...prev,
        { message: res.data.answer, sender: "assistant", direction: "incoming" },
      ]);
    } catch (err) {
      // Handle session expiration and chat errors
      console.error("Chat error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/session-expired");
        return;
      }
      setChatMessages((prev) => [
        ...prev,
        { message: "Error getting answer from assistant.", sender: "assistant", direction: "incoming" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Resets the UI to allow the user to select a new folder
  const handleReset = () => {
    setFolderUrl("");
    setFiles([]);
    setFileContents([]);
    setChatMessages([]);
    setShowInput(true);
    // Remove folder_url from localStorage
    localStorage.removeItem('folder_url');
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        color: "#fff",
        p: 4,
        boxSizing: "border-box",
        position: "relative", // <-- Important for absolute positioning
      }}
    >
      {/* Logout button in top right */}
      <LogoutButton className="glow-btn" />
      <Container maxWidth="md">
        {/* Error Banner */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              fontWeight: 500,
              fontSize: 17,
              alignItems: 'center',
              background: 'linear-gradient(90deg, #ff5252 60%, #ff867f 100%)',
              color: '#fff',
              boxShadow: '0 2px 12px rgba(255,82,82,0.18)',
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setError("")}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}
        {/* Main title */}
        <Typography
          variant="h3"
          align="center"
          sx={{ mb: 5, fontWeight: "bold" }}
          className="glow-title"
        >
          Talk to a Folder
        </Typography>

        {/* Loading spinner and cycling message */}
        {isLoading ? (
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}>
            <CircularProgress sx={{ color: "#fff" }} />
            <Typography variant="h6" sx={{ mt: 3, color: "#fff", fontStyle: "italic" }}>
              {loadingMessages[loadingMessageIndex]}
            </Typography>
          </Box>
        ) : showInput ? (
          // Modal-style overlay for folder input
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(2px)',
          }}>
            <Box sx={{
              minWidth: { xs: '95vw', sm: 600 },
              maxWidth: 700,
              p: { xs: 2, sm: 5 },
              background: 'rgba(30,30,30,0.95)',
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.25)',
              border: '1.5px solid rgba(255,255,255,0.10)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}>
              <FolderInput
                folderUrl={folderUrl}
                setFolderUrl={setFolderUrl}
                handleFetchFiles={handleFetchFiles}
                error={error}
                fullWidthOverride={true}
              />
            </Box>
          </Box>
        ) : (
          <>
            {/* Button row: Refetch Files and Talk to a Different Folder */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Button
                variant="outlined"
                onClick={() => handleFetchFiles({ preventDefault: () => {} })}
                className="glow-btn"
                disabled={isLoading}
                sx={{ color: "#fff", borderColor: "#fff" }}
              >
                Refetch Current Folder
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                className="glow-btn"
                sx={{ color: "#fff", borderColor: "#fff" }}
              >
                Talk to a Different Folder
              </Button>
            </Box>

            {/* File list */}
            <FileList files={files} />

            {/* Chat agent and Reference Files Only toggle */}
            <ChatBox
              chatMessages={chatMessages}
              isTyping={isTyping}
              handleSend={handleSend}
              referenceFilesOnly={referenceFilesOnly}
            />
            {/* Reference Files Only toggle centered under chat */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Tooltip
                  title={
                    <span>
                      <b>Checked:</b> The assistant will <b>only</b> answer using the files in the folder and will refuse unrelated questions.<br/>
                      <b>Unchecked:</b> The assistant may answer general questions using its own knowledge if the files do not contain the answer.
                    </span>
                  }
                  arrow
                  placement="bottom"
                >
                  <label htmlFor="reference-files-only" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      id="reference-files-only"
                      checked={referenceFilesOnly}
                      onChange={e => setReferenceFilesOnly(e.target.checked)}
                      style={{
                        marginRight: 8,
                        accentColor: '#4fc3f7', // theme blue
                        width: 18,
                        height: 18,
                      }}
                    />
                    <span style={{ color: '#fff', fontSize: 15, userSelect: 'none', fontWeight: 500 }}>
                      Reference Files Only
                    </span>
                  </label>
                </Tooltip>
                <Button
                  onClick={() => setChatMessages([])}
                  size="small"
                  disabled={chatMessages.length === 0}
                  sx={{
                    color: '#fff',
                    background: 'none',
                    border: 'none',
                    boxShadow: 'none',
                    fontSize: '0.95rem',
                    minWidth: 'auto',
                    padding: 0,
                    ml: 2,
                    display: 'flex',
                    alignItems: 'center',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#4fc3f7',
                    },
                    '&.Mui-disabled': {
                      color: '#888',
                      opacity: 0.7,
                    },
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 18, mr: 0.5 }} />
                  Clear Chat
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

export default Home;
