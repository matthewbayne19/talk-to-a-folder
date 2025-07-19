// ChatBox.jsx
// Chat UI component: displays chat messages and input for user/assistant conversation.

import React from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

// ChatBox component for chat interaction
function ChatBox({ chatMessages, isTyping, handleSend, referenceFilesOnly }) {
  return (
    // Fixed height chat area with glassmorphism styling
    <div style={{ height: "500px", marginTop: "30px" }}>
      <MainContainer
        className="chatbox-glass"
        style={{
          border: "1px solid #444",
          borderRadius: "18px",
          backgroundColor: "#000",
          height: "100%",
        }}
      >
        <ChatContainer style={{ backgroundColor: "#000", position: 'relative' }}>
            {/* Message list with typing indicator */}
            <MessageList
              style={{ backgroundColor: "#000" }}
              typingIndicator={
                isTyping ? (
                  <TypingIndicator
                    content="Assistant is typing..."
                    style={{
                      backgroundColor: "#000",
                      color: "#fff",
                      fontStyle: "italic",
                      padding: "10px 20px",
                    }}
                  />
                ) : null
              }
            >
              {chatMessages.length === 0 && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: 'calc(100% - 70px)', // leave space for input
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  zIndex: 2,
                  color: '#fff',
                  opacity: 0.7,
                  fontSize: 20,
                  textAlign: 'center',
                }}>
                  <ChatBubbleOutlineIcon sx={{ fontSize: 60, mb: 2, color: '#fff', opacity: 0.5 }} />
                  <div>Start the conversation!<br/>Ask anything about your folder's contents.</div>
                </div>
              )}
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
                  style={{
                    backgroundColor: "#000",
                    color: "#fff",
                  }}
                />
              ))}
            </MessageList>

            {/* Chat input field */}
            <MessageInput
              placeholder="Ask something about the folder contents..."
              onSend={handleSend}
              attachButton={false}
              style={{
                backgroundColor: "#000",
                color: "#000",
                borderTop: "1px solid #444",
                borderRadius: "0 0 8px 8px",
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
            />
          </ChatContainer>
        </MainContainer>
    </div>
  );
}

export default ChatBox;
