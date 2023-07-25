import React from 'react';

class FileUploadButton extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      files: [],
    };
  }

  handleButtonClick = () => {
    this.inputRef.current.click();
  };

  handleFileChange = (event) => {
    const files = Array.from(event.target.files).map(file => {
      const fileType = file.name.split('.').pop();
      // Ensure the uploaded file is either a PDF or TXT
      if (!['pdf', 'txt'].includes(fileType)) {
        alert('Only PDF and TXT files are supported');
        return null;
      }
      return { file, fileType };
    }).filter(Boolean);

    this.setState({ files });
  };

  render() {
    const { files } = this.state;

    return (
      <div>
        <input
          type="file"
          ref={this.inputRef}
          style={{ display: 'none' }}
          onChange={this.handleFileChange}
          accept=".pdf,.txt,.csv" // Limit the file input to only PDF and TXT files
          multiple // Allow the user to select multiple files
        />
        <button onClick={this.handleButtonClick}>Upload Files</button>
        {files.map(({ file, fileType }, index) => {
          let FilePreview;
          if (fileType === 'pdf') {
            FilePreview = (
              <object
                data={URL.createObjectURL(file)}
                type="application/pdf"
                width="100%"
                height="600px"
                key={index}
              >
                <p>It appears you don't have a PDF plugin for this browser.</p>
              </object>
            );
          } else if (fileType === 'txt') {
            const reader = new FileReader();
            reader.onload = function(event) {
              FilePreview = <pre key={index}>{event.target.result}</pre>;
            };
            reader.readAsText(file);
          }
          return FilePreview;
        })}
      </div>
    );
  }
}

export default FileUploadButton;
