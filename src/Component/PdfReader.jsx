import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Link } from "react-router-dom";

function PdfReader({ url }) {
    const [numPages, setNumPages] = useState(1);
    const [pageNumberView, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        if (pageNumberView < numPages) {
            setPageNumber(pageNumberView);
        }
    }

    function changePage(offset) {
        setPageNumber((prevPageNumber) => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    const downloadGeneratedPdf = () => {
        const fileURL = url;
        let ele = document.createElement("a");
        ele.href = fileURL;
        ele.target = "_blank";
        ele.click();
    }

    return (
        <div className="pdfContainer">
            {url && (
                <>
                    <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page pageNumber={pageNumberView} />
                    </Document>
                    <div className="pdf-pagination d-flex align-items-center justify-content-around">
                        {/* <button
                            type="button"
                            disabled={pageNumberView >= numPages}
                            onClick={nextPage}
                        >
                            First Page
                        </button>
                        <button
                            type="button"
                            disabled={pageNumberView <= 1}
                            onClick={previousPage}
                        >
                            <Icon icon="ant-design:left-outlined" />
                        </button>
                        <p>
                            Page {pageNumberView} of {numPages}
                        </p>
                        <button
                            type="button"
                            disabled={pageNumberView >= numPages}
                            onClick={nextPage}
                        >
                            <Icon icon="ant-design:right-outlined" />
                        </button>
                        <button
                            type="button"
                            disabled={pageNumberView >= numPages}
                            onClick={nextPage}
                        >
                            Last Page
                        </button> */}
                        <button
                            type="button"
                            disabled={pageNumberView <= 1}
                            onClick={previousPage}
                        >
                            <Icon icon="ant-design:left-outlined" />
                        </button>
                        <p>
                            {pageNumberView} of {numPages}
                        </p>
                        <button
                            type="button"
                            disabled={pageNumberView >= numPages}
                            onClick={nextPage}
                        >
                            <Icon icon="ant-design:right-outlined" />
                        </button>
                    </div>
                    <div className="downloadButtonWithLink mt-4 d-flex flex-column align-items-center gap-2">
                        <button onClick={downloadGeneratedPdf}>Download Report</button>
                        <Link to={"/"}>Back to Home</Link>
                    </div>
                </>
            )}
        </div>
    );
}
export { PdfReader };
