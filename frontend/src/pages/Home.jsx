import React, { useState } from "react";
import axios from "axios";
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

const extractFolderId = (url) => {
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return folderMatch ? folderMatch[1] : null;
};

function Home() {
  const [folderUrl, setFolderUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [fileContents, setFileContents] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInput, setShowInput] = useState(true);

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
      const res = await axios.post("http://localhost:4000/list-files", {
        accessToken,
        folderId,
      });
      setFiles(res.data.files);

      const contentsRes = await axios.post("http://localhost:4000/get-file-contents", {
        accessToken,
        files: res.data.files,
      });

      setFileContents(contentsRes.data.contents);
      setShowInput(false);
    } catch (err) {
      console.error("Error fetching files or contents:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to load files from Google Drive.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      const res = await axios.post("http://localhost:4000/ask-agent", {
        contents: fileContents,
        question: userMessage,
      });

      setChatMessages((prev) => [
        ...prev,
        { message: res.data.answer, sender: "assistant", direction: "incoming" },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages((prev) => [
        ...prev,
        { message: "Error getting answer from assistant.", sender: "assistant", direction: "incoming" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

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
        backgroundColor: "#000",
        color: "#fff",
        p: 4,
        boxSizing: "border-box",
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" align="center" sx={{ mb: 5, fontWeight: "bold" }}>
          Talk to a Folder
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress sx={{ color: "#fff" }} />
          </Box>
        ) : showInput ? (
          <FolderInput
            folderUrl={folderUrl}
            setFolderUrl={setFolderUrl}
            handleFetchFiles={handleFetchFiles}
            error={error}
          />
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{ display: "block", mx: "auto", mb: 7, color: "#fff", borderColor: "#fff" }}
            >
              Talk to a Different Folder
            </Button>

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
