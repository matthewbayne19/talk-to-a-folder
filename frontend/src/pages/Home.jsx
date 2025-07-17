import React, { useState } from "react";
import axios from "axios";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

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
  const [error, setError] = useState("");

  const handleFetchFiles = async (e) => {
    e.preventDefault();
    setError("");
    const accessToken = localStorage.getItem("access_token");
    const folderId = extractFolderId(folderUrl);

    if (!folderId) {
      setError("Invalid Google Drive folder URL.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/list-files", {
        accessToken,
        folderId,
      });
      setFiles(res.data.files);

      // Now fetch contents for those files
      const contentsRes = await axios.post("http://localhost:4000/get-file-contents", {
        accessToken,
        files: res.data.files,
      });

      setFileContents(contentsRes.data.contents);
    } catch (err) {
      console.error("Error fetching files or contents:", err);
      setError("Failed to load files from Google Drive.");
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

  return (
    <div style={{ padding: "20px" }}>
      <h2>You're authenticated!</h2>
      <form onSubmit={handleFetchFiles}>
        <input
          type="text"
          placeholder="Paste Google Drive folder URL here"
          value={folderUrl}
          onChange={(e) => setFolderUrl(e.target.value)}
          style={{ width: "80%", padding: "8px", margin: "10px 0" }}
        />
        <button type="submit">Fetch Files</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {files.length > 0 && (
        <>
          <h3>Files in Folder:</h3>
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                {file.name} ({file.mimeType})
              </li>
            ))}
          </ul>

          <div style={{ height: "500px", marginTop: "30px" }}>
            <MainContainer>
              <ChatContainer>
                <MessageList
                  typingIndicator={
                    isTyping ? <TypingIndicator content="Assistant is typing..." /> : null
                  }
                >
                  {chatMessages.map((msg, i) => (
                    <Message
                      key={i}
                      model={{
                        message: msg.message,
                        sentTime: "just now",
                        sender: msg.sender,
                        direction: msg.direction,
                        position: "single",
                      }}
                    />
                  ))}
                </MessageList>
                <MessageInput
                  placeholder="Ask something about the folder contents..."
                  onSend={handleSend}
                />
              </ChatContainer>
            </MainContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
