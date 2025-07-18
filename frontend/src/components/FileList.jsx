import { List, ListItem, Divider, Box } from "@mui/material";

const mimeTypeMap = {
  "application/vnd.google-apps.document": "Google Docs",
  "application/vnd.google-apps.spreadsheet": "Google Sheets",
  "application/vnd.google-apps.presentation": "Google Slides",
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Microsoft Word",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Microsoft Excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint",
  "text/plain": "Text File",
  "text/csv": "CSV",
};

const FileList = ({ files }) => {
  return (
    <>
      <List sx={{ backgroundColor: "#111", borderRadius: "6px", mb: 3 }}>
        {files.map((file) => (
          <div key={file.id}>
            <ListItem
              component="a"
              href={`https://drive.google.com/file/d/${file.id}/view`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#fff",
                justifyContent: "space-between",
                textDecoration: "none",
                "&:hover": {
                  backgroundColor: "#222",
                },
              }}
            >
              <span>{file.name}</span>
              <Box sx={{ fontSize: "0.85rem", color: "#ccc" }}>
                {mimeTypeMap[file.mimeType] || file.mimeType}
              </Box>
            </ListItem>
            <Divider sx={{ backgroundColor: "#333" }} />
          </div>
        ))}
      </List>
    </>
  );
};

export default FileList;
