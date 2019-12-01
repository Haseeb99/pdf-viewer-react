import React, { Component } from 'react';
import { Document, Page } from 'react-pdf';
import throttle from 'lodash.throttle';
import { pdfjs } from 'react-pdf';
import './PDF.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class PDF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1,
      PDFWidth: null
    };
    this.PDFWrapper = React.createRef();
    this.throttledSetPDFWidth = throttle(this.setPDFWidth, 500);
  }

  componentDidMount() {
    this.setPDFWidth();
    window.addEventListener('resize', this.throttledSetPDFWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledSetPDFWidth);
  }

  setPDFWidth = () => {
    const width = this.PDFWrapper.current.offsetWidth;
    this.setState({ PDFWidth: width });
  };

  onDocumentLoadSuccess = document => {
    const { numPages } = document;
    this.setState({
      numPages,
      pageNumber: 1
    });
  };

  onDocumentLoadError = error => {
    console.log(error.message);
  };

  changePage = offset =>
    this.setState(prevState => ({
      pageNumber: prevState.pageNumber + offset
    }));

  previousPage = () => this.changePage(-1);

  nextPage = () => this.changePage(1);

  render() {
    const { numPages, pageNumber, PDFWidth } = this.state;
    return (
      <div className="PDF">
        <h2>PDF Viewer</h2>
        <hr />
        <div>
          <p>
            Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
          </p>
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={this.previousPage}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={pageNumber >= numPages}
            onClick={this.nextPage}
          >
            Next
          </button>
        </div>
        <div ref={this.PDFWrapper} className="PDF-wrapper">
          <Document
            file="sampleDocument.pdf"
            onLoadSuccess={this.onDocumentLoadSuccess}
            onLoadError={this.onDocumentLoadError}
          >
            <Page
              className="PDF-page"
              pageNumber={pageNumber}
              width={PDFWidth}
            />
          </Document>
        </div>
      </div>
    );
  }
}

export default PDF;
