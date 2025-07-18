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
} from "@mui/material";

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
  // State for folder URL input
  const [folderUrl, setFolderUrl] = useState("");
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

  // Cycle through loading messages while loading
  useEffect(() => {
    if (isLoading) {
      setLoadingMessageIndex(0);
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
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
          // Folder input form
          <FolderInput
            folderUrl={folderUrl}
            setFolderUrl={setFolderUrl}
            handleFetchFiles={handleFetchFiles}
            error={error}
          />
        ) : (
          <>
            {/* Button to reset and select a different folder */}
            <Button
              variant="outlined"
              onClick={handleReset}
              className="glow-btn"
              sx={{ display: "block", mx: "auto", mb: 7, color: "#fff", borderColor: "#fff" }}
            >
              Talk to a Different Folder
            </Button>

            {/* File list and chat UI */}
            <FileList files={files} />
            <ChatBox
              chatMessages={chatMessages}
              isTyping={isTyping}
              handleSend={handleSend}
            />
          </>
        )}
      </Container>
    </Box>
  );
}

export default Home;
