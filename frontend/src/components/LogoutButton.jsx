// LogoutButton.jsx
// Button to log out the user and clear session, positioned in the top right.

import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Box, Modal, Typography, IconButton } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Logout button component
const LogoutButton = ({ className }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handles logout: revoke token, clear local storage, redirect
  const handleLogout = async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      await axios.post("http://localhost:4000/logout", { accessToken });
    } catch (err) {
      console.error("Error revoking token:", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("folder_url");
      navigate("/");
    }
  };

  return (
    // Top right positioned logout/help buttons
    <Box sx={{ position: "absolute", top: 20, right: 20, display: 'flex', gap: 2 }}>
      <IconButton
        onClick={handleOpen}
        className={className}
        sx={{
          color: "#fff",
          p: 0,
          m: 0,
          background: 'none',
          borderRadius: 0,
          boxShadow: 'none',
          minWidth: 0,
          minHeight: 0,
          '&:hover': {
            backgroundColor: 'transparent',
            color: '#fff',
            boxShadow: 'none',
          },
        }}
        size="large"
      >
        <HelpOutlineIcon sx={{ fontSize: 28 }} />
      </IconButton>
      <Button
        variant="outlined"
        onClick={handleLogout}
        className={className}
        sx={{
          color: "#fff",
          borderColor: "#fff",
          '&:hover': {
            backgroundColor: '#222',
            borderColor: '#ccc',
          },
        }}
      >
        Logout
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="help-modal-title"
        aria-describedby="help-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: '#111',
          border: '2px solid #4fc3f7',
          boxShadow: 24,
          borderRadius: 3,
          p: 4,
          color: '#fff',
        }}>
          <Typography id="help-modal-title" variant="h6" component="h2" sx={{ mb: 2, color: '#4fc3f7', fontWeight: 700 }}>
            How to Use Talk to a Folder
          </Typography>
          <Typography id="help-modal-description" sx={{ mb: 2, fontSize: 16 }}>
            1. <b>Paste a Google Drive folder URL</b> in the input box and click <b>Fetch Files</b>.<br/>
            2. <b>Review the list of files</b> found in the folder.<br/>
            3. <b>Start chatting</b>! Ask questions about the folder's contents.<br/>
            4. <b>Reference Files Only</b>: Toggle this option to restrict answers to only the files in the folder.<br/>
            5. <b>Logout</b> securely when finished.<br/><br/>
            <b>Tip:</b> Click on any file in the list to open it in Google Drive.
          </Typography>
          <Button onClick={handleClose} variant="outlined" sx={{ color: '#fff', borderColor: '#fff', mt: 2, float: 'right' }}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default LogoutButton;
