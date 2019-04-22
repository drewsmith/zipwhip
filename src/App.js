import React, { Component } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-grow: 1;
  flex-direction: column;
  background: #fff;
  code {
    padding: 20px 40px;
  }
`;

const Header = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 60px;
    font-family: "Roboto";
    padding: 12px 0;
    margin: 0 auto;
    color: #333333;
    font-weight: 100;
    flex: 0;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  input[type=file] {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  i {
    margin-right: 10px;
  }
  label, button {
    background: #f5f5f5;
    padding: 8px 16px;
    text-transform: uppercase;
    border: 0;
    font-size: 14px;
    color: #333333;
    margin: 10px 0 0 0;
    border-radius: 4px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.15);
  }
  .submit {
    background: #007bff;
    color: #ffffff;
    margin-left: 10px;
  }
  .clear {
    background: #6c757d;
    color: #ffffff;
    margin-left: 10px;
  }
`;

const Error = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  padding: 10px 20px;
  margin: 10px auto 0 auto;
  border-radius: 6px;
`;

class UploadForm extends Component {
  uploadFile = null;
  state = {
    fileUploadText: null,
    error: null,
    content: null
  }

  handleClear = () => {
    this.setState({ content: null, fileUploadText: null, error: null });
  }

  handleSubmit = (e) => {
    let { files = [] } = this.uploadFile;
    Papa.parse(files[0], {
      header: true,
      complete: results => {
        let content = results.data.reduce((reduced, row = []) => ([
          ...reduced,
          `${row['PHONE']} ${row['NAME']}`
        ]), []);
        this.setState({ content, fileUploadText: null, error: null });
      }
    });
  }

  handleFileChange = (e) => {
    let { files = [] } = this.uploadFile;
    let filename = files[0].name;
    if (!this.isFileValid(filename)) {
      this.setState({ error: 'Invalid file. Only CSV files are allowed.' });
    } else {
      this.setState({ 
        fileUploadText: filename,
        error: null
      });
    }
  }

  isFileValid = filename => {
    return filename && filename.slice(-3).toLowerCase() === 'csv';
  }

  render() {
    let { fileUploadText, error, content } = this.state;
    return (
      <Container>
        <Header><h1>ZipWhip</h1></Header>
        {error && <Error>{error}</Error>}
        <Form>
          <div>
            <input 
              id="file" 
              name="file" 
              type="file"
              ref={(ref) => { this.uploadFile = ref; }} 
              onChange={this.handleFileChange} 
            />
            <label htmlFor="file">
              <i className="fa fa-cloud-upload" aria-hidden="true"></i>
              {fileUploadText || 'Click to choose file'}
            </label>
            <button className="submit" onClick={this.handleSubmit}>
              <i className="fa fa-file" aria-hidden="true"></i>
              Convert
            </button>
            <button className="clear" onClick={this.handleClear}>
              <i className="fa fa-times" aria-hidden="true"></i>
              Clear
            </button>
          </div>
        </Form>
        {content && <code>{content.join('\n')}</code>}
      </Container>
    )
  }
}

export default () => <UploadForm />;
