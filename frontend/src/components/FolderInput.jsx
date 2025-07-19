// FolderInput.jsx
// Component for entering and submitting a Google Drive folder URL.

import React from "react";
import { Box, TextField, Button, Alert } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';

// Folder input form component
function FolderInput({ folderUrl, setFolderUrl, handleFetchFiles, error, fullWidthOverride }) {
  // Disable button if input is empty
  const isDisabled = folderUrl.trim() === "";

  return (
    <>
      {/* Folder URL input and submit button */}
      <Box
        component="form"
        onSubmit={handleFetchFiles}
        sx={{
          width: fullWidthOverride ? '100%' : "75%",
          margin: "0 auto",
          display: "flex",
          gap: fullWidthOverride ? '24px' : "16px",
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
            flex: 1,
            "& .MuiInputBase-input::placeholder": {
              color: "#bbb",
              opacity: 0.8,
              fontStyle: "italic",
              fontSize: "16px",
              fontWeight: "300",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { 
                borderColor: "#fff",
                borderWidth: "2px",
                borderRadius: "12px",
              },
              "&:hover fieldset": { 
                borderColor: "#fff",
                borderWidth: "2px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#fff",
                borderWidth: "2px",
              },
              backgroundColor: "#000",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#111",
                transform: "translateY(-1px)",
                boxShadow: "none",
              },
              "&.Mui-focused": {
                backgroundColor: "#111",
                boxShadow: "none",
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          // Remove glow-input by default
          disabled={isDisabled}
          sx={{
            minWidth: fullWidthOverride ? 160 : undefined,
            fontSize: fullWidthOverride ? '1.1rem' : undefined,
            whiteSpace: "nowrap",
            backgroundColor: "#000",
            color: "#fff",
            borderColor: "#fff",
            borderWidth: '2px',
            borderRadius: "12px",
            fontWeight: "600",
            paddingX: "24px",
            paddingY: "12px",
            transition: "all 0.3s ease, box-shadow 0.2s",
            "&:hover": {
              backgroundColor: "#111",
              borderColor: "#fff",
              transform: "translateY(-1px)",
              boxShadow: "0 0 32px 6px rgba(79,195,247,0.25), 0 2px 8px 0 rgba(31, 38, 135, 0.10)",
            },
            "&.Mui-disabled": {
              color: "#888",
              borderColor: "#888",
              backgroundColor: "#000",
              opacity: 1, // prevent default dimming
            },
            // Glow on focus
            '&:focus-visible': {
              boxShadow: '0 0 32px 6px rgba(79,195,247,0.25), 0 2px 8px 0 rgba(31, 38, 135, 0.10)',
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
