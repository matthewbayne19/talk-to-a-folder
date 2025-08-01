// FileList.jsx
// Displays a list of files in a Google Drive folder, with icons and scrollable area.

import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

// Maps MIME types to labels and icons
const mimeTypeMap = {
  "application/vnd.google-apps.document": { label: "Google Docs", icon: <DescriptionIcon className="filelist-icon" /> },
  "application/vnd.google-apps.spreadsheet": { label: "Google Sheets", icon: <TableChartIcon className="filelist-icon" /> },
  "application/vnd.google-apps.presentation": { label: "Google Slides", icon: <SlideshowIcon className="filelist-icon" /> },
  "application/pdf": { label: "PDF", icon: <PictureAsPdfIcon className="filelist-icon" /> },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { label: "Microsoft Word", icon: <DescriptionIcon className="filelist-icon" /> },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { label: "Microsoft Excel", icon: <TableChartIcon className="filelist-icon" /> },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { label: "Microsoft PowerPoint", icon: <SlideshowIcon className="filelist-icon" /> },
  "text/plain": { label: "Text File", icon: <TextSnippetIcon className="filelist-icon" /> },
  "text/csv": { label: "CSV", icon: <TableChartIcon className="filelist-icon" /> },
};

const MAX_HEIGHT = 400;

// File list component
const FileList = ({ files }) => {
  return (
    // Glassmorphism card with scrollable file list
    <div className="filelist-glass-card" style={{
      maxHeight: MAX_HEIGHT,
      minHeight: 48,
      overflowY: 'auto',
      position: 'relative',
      paddingTop: '0.5rem',
    }}>
      {files.map((file, idx) => {
        // Get icon and label for file type
        const typeInfo = mimeTypeMap[file.mimeType] || { label: file.mimeType, icon: <InsertDriveFileIcon className="filelist-icon" /> };
        return (
          // File row with icon, name, and type
          <a
            key={file.id}
            href={`https://drive.google.com/file/d/${file.id}/view`}
            target="_blank"
            rel="noopener noreferrer"
            className="filelist-row"
            style={{
              borderBottom: idx === files.length - 1 ? 'none' : undefined,
            }}
          >
            {typeInfo.icon}
            <span className="filelist-name">{file.name}</span>
            <span className="filelist-type">{typeInfo.label}</span>
          </a>
        );
      })}
    </div>
  );
};

export default FileList;
