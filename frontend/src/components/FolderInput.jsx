import React from "react";
import { Box, TextField, Button } from "@mui/material";

function FolderInput({ folderUrl, setFolderUrl, handleFetchFiles }) {
  return (
    <Box
      component="form"
      onSubmit={handleFetchFiles}
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
        label="Paste Google Drive folder URL"
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
        variant="contained"
        sx={{ backgroundColor: "#1976d2", whiteSpace: "nowrap" }}
      >
        Fetch Files
      </Button>
    </Box>
  );
}

export default FolderInput;
