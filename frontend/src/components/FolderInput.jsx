// FolderInput.jsx
// Component for entering and submitting a Google Drive folder URL.

import React from "react";
import { Box, TextField, Button, Alert } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';

// Folder input form component
function FolderInput({ folderUrl, setFolderUrl, handleFetchFiles, error }) {
  // Disable button if input is empty
  const isDisabled = folderUrl.trim() === "";

  return (
    <>
      {/* Folder URL input and submit button */}
      <Box
        component="form"
        onSubmit={handleFetchFiles}
        sx={{
          width: "75%",
          margin: "0 auto",
          display: "flex",
          gap: "16px",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          className="glow-input"
          placeholder="Paste your Google Drive folder URL here..."
          value={folderUrl}
          onChange={(e) => setFolderUrl(e.target.value)}
          InputProps={{ 
            style: { 
              color: "#fff",
              fontSize: "16px",
              fontWeight: "400",
            },
            startAdornment: (
              <FolderIcon 
                sx={{ 
                  color: "#4fc3f7", 
                  mr: 1, 
                  fontSize: "24px",
                  opacity: 0.8 
                }} 
              />
            ),
          }}
          sx={{
            "& .MuiInputBase-input::placeholder": {
              color: "#bbb",
              opacity: 0.8,
              fontStyle: "italic",
              fontSize: "16px",
              fontWeight: "300",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { 
                borderColor: "#444",
                borderWidth: "2px",
                borderRadius: "12px",
              },
              "&:hover fieldset": { 
                borderColor: "#4fc3f7",
                borderWidth: "2px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#4fc3f7",
                borderWidth: "2px",
              },
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(79, 195, 247, 0.15)",
              },
              "&.Mui-focused": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 6px 20px rgba(79, 195, 247, 0.25)",
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          className="glow-input"
          disabled={isDisabled}
          sx={{
            whiteSpace: "nowrap",
            backgroundColor: "#000",
            color: "#fff",
            borderColor: "#fff",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "15px",
            paddingX: "24px",
            paddingY: "12px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#111",
              borderColor: "#ccc",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(255, 255, 255, 0.15)",
            },
            "&.Mui-disabled": {
              color: "#888",
              borderColor: "#888",
              backgroundColor: "#000",
              opacity: 1, // prevent default dimming
            },
          }}
        >
          Fetch Files
        </Button>
      </Box>
      {/* Error message display */}
      {error && (
        <Box sx={{ width: "75%", margin: "10px auto 0 auto" }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
    </>
  );
}

export default FolderInput;
