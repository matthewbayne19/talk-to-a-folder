import React from "react";
import { Box, TextField, Button, Alert } from "@mui/material";

function FolderInput({ folderUrl, setFolderUrl, handleFetchFiles, error }) {
  const isDisabled = folderUrl.trim() === "";

  return (
    <>
      <Box
        component="form"
        onSubmit={handleFetchFiles}
        className="glow-input"
        sx={{
          width: "75%",
          margin: "0 auto",
          display: "flex",
          gap: "10px",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Paste Google Drive Folder URL"
          value={folderUrl}
          onChange={(e) => setFolderUrl(e.target.value)}
          InputLabelProps={{ style: { color: "#fff" } }}
          InputProps={{ style: { color: "#fff" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#888" },
              "&:hover fieldset": { borderColor: "#ccc" },
            },
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          disabled={isDisabled}
          sx={{
            whiteSpace: "nowrap",
            backgroundColor: "transparent",
            color: "#fff",
            borderColor: "#fff",
            "&:hover": {
              backgroundColor: "#222",
              borderColor: "#ccc",
            },
            "&.Mui-disabled": {
              color: "#888",
              borderColor: "#888",
              opacity: 1, // prevent default dimming
            },
          }}
        >
          Fetch Files
        </Button>
      </Box>
      {error && (
        <Box sx={{ width: "75%", margin: "10px auto 0 auto" }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
    </>
  );
}

export default FolderInput;
