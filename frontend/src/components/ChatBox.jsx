import React from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

function ChatBox({ chatMessages, isTyping, handleSend }) {
  return (
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
        <ChatContainer style={{ backgroundColor: "#000" }}>
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
