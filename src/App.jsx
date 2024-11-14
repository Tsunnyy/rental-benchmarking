import DataTable from 'react-data-table-component';
import Aside from './Component/Aside';
import TopBar from './Component/TopBar';
import { Routes, Route, useNavigate } from "react-router-dom";
import SubjectDetsils from './Component/SubjectDetsils';
import ComparableDetails from './Component/ComparableDetails';
import SubjectSiteLeaseTerms from './Component/SubjectSiteLeaseTerms';
import RecommendedRentals from './Component/RecommendedRentals';
import axios from 'axios';
import { useEffect, useState } from 'react';
import "react-data-table-component-extensions/dist/index.css";
import LeafLetMap from './Component/LeafLetMap';
import Loader from './Component/Loader';
import Select from 'react-select';
import CsvDownloadButton from 'react-json-to-csv'
import { Modal } from 'react-bootstrap';
import { PdfReader } from './Component/PdfReader';
import { Icon } from '@iconify/react/dist/iconify.js';
import PageNotFound from './Component/PageNotFound';

function App() {

  const [rowData, setRowData] = useState([])
  const [loader, setLoader] = useState(false)
  const [sortBy, setSortBy] = useState("desc")
  const [listStatus, setListStatus] = useState(2)
  const [searchData, setSearchData] = useState("")
  const [pdfUrl, setpdfUrl] = useState("")
  const [show, setShow] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const handleClose = () => setShow(false);

  const apiUrl = import.meta.env.VITE_API_KEY;

  let navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/rental_benchmarking/check_auth`);
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // useEffect(() => {
  // if (isAuthenticated === false) {
  //   return <PageNotFound />
  // }
  // }, []);

  const editListing = (id, completed_step) => {
    console.log("completed_step of row", completed_step)
    let completedStep = completed_step === 4 ? completed_step : completed_step + 1
    const step = completedStep;
    let url = '';
    switch (step) {
      case 1:
        url = `/subject-property/${id}`;
        break;
      case 2:
        url = `/comparable-details/${id}`;
        break;
      case 3:
        url = `/site-lease-terms/${id}`;
        break;
      default:
        url = `/recommended-rentals/${id}`;
    }
    navigate(url, { state: { editMode: true, reportId: id } });
  };

  const downloadGeneratedPdf = (url) => {
    const fileURL = url;
    let ele = document.createElement("a");
    ele.href = fileURL;
    ele.target = "_blank";
    ele.click();
  }

  const downloadReport = async (id) => {
    if (id) {
      try {
        setLoader(true);
        const reportResponse = await axios.get(
          `${apiUrl}/api/rental_benchmarking/generate_report?id=${id}`
        );
        // console.log(reportResponse.data.data.report_full_path)
        downloadGeneratedPdf(reportResponse.data.data.report_full_path)
        // setpdfUrl(reportResponse.data.data.report_full_path)
      } catch (error) {
        console.error('Error generating report:', error);
      } finally {
        setLoader(false);
      }
    }
  }

  const getPdfUrl = async (id) => {
    if (id) {
      try {
        setLoader(true);
        const reportResponse = await axios.get(
          `${apiUrl}/api/rental_benchmarking/generate_report?id=${id}`
        );
        setpdfUrl(reportResponse.data.data.report_full_path)
        setShow(true)
      } catch (error) {
        console.error('Error generating report:', error);
      } finally {
        setLoader(false);
      }
    }
  }

  const columns = [
    {
      name: 'Report ID',
      selector: row => row.id,
      cellExport: (row) => row.id,
      // sortable: true,
    },
    {
      name: 'Client Name',
      selector: row => row.client_name,
      cell: row => (
        <>
          {row.status == "Completed" ? <h2 className='clrBlue' onClick={() => getPdfUrl(row.id)}>{row.client_name}</h2> : <h2>{row.client_name}</h2>}
        </>
      ),
      // cellExport: (row) => row.client_name,
    },
    {
      name: 'Subject Site Address',
      selector: row => row.subject_address,
      cellExport: (row) => row.subject_address,
    },
    {
      name: 'Start Date',
      selector: row => row.created_at_date,
      cellExport: (row) => row.created_at_date,
      sortable: true,
    },
    {
      name: 'Executed By',
      selector: row => row.user_name,
      cellExport: (row) => row.user_name,
    },
    {
      name: 'Status',
      selector: row => row.status,
      cellExport: (row) => row.status,
    },
    {
      name: 'Action',
      selector: row => row.action,
      cellExport: (row) => row.action,
      cell: (row) => <p className="d-flex gap-4 align-items-center action_button">
        <button title='Edit Listing' onClick={() => editListing(row.id, row.completed_step)}><img src="/rental-benchmarking/img/icons/edit.svg" alt="Edit" /></button>
        {row.status == "Completed" ? <button title='Download Report' onClick={() => downloadReport(row.id)}><img src="/rental-benchmarking/img/icons/download.svg" alt="download" /></button> : null}
      </p>
    },
  ];

  const sortOptions = [
    { value: 'desc', label: 'Latest First' },
    { value: 'asc', label: 'Oldest First' },
  ]

  const statusOptions = [
    { value: '1', label: 'Completed' },
    { value: '0', label: 'Ongoing' },
    { value: '2', label: 'All' },
  ]

  const sortFunction = (e) => {
    console.log(e.value, "e.value")
    setSortBy(e.value)
    setPageNumber(1);
  }

  const statusFunction = (e) => {
    console.log(e.value, "e.value");
    setListStatus(e.value);
    setPageNumber(1);
  };

  const searchByClientName = (e) => {
    if (e.target.value.length >= 3) {
      const getData = setTimeout(() => {
        setSearchData(e.target.value)
        setPageNumber(1);
      }, 1000);
      return () => clearTimeout(getData);
    } else {
      setSearchData("")
    }
  }

  const getRowsData = () => {
    setLoader(true);
    axios
      .get(
        `${apiUrl}/api/rental_benchmarking/list_reports?sortOrder=${sortBy}&q=${searchData}&status=${listStatus}&pageNumber=${pageNumber}`
      )
      .then((response) => {
        const responseData = response.data.data;
        console.log(responseData, 'data');

        const updatedData = responseData.map((val) => {
          val.status = val.status === 0 ? 'Ongoing' : 'Completed';
          return val;
        });

        if (pageNumber === 1) {
          setRowData(updatedData);
        } else {
          setRowData((prevData) => [...prevData, ...updatedData]);
        }

        if (responseData.length < 10) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getRowsData();
  }, [sortBy, listStatus, searchData, pageNumber]);

  const handleScroll = (e) => {
    const element = e.target;

    // Check if we've scrolled to the bottom
    if (
      element.scrollHeight - element.scrollTop === element.clientHeight &&
      hasMore &&
      !loader
    ) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
      // getRowsData();
    }
  };


  const downloadCsvFild = async () => {
    const response = await axios.get(`${apiUrl}/api/rental_benchmarking/export?sortOrder=${sortBy}&q=${searchData}&status=${listStatus}`)
    let responseData = response.data.data
    const csv = convertJSONToCSV(responseData);
    downloadCSV(csv);
  }

  function convertJSONToCSV(json) {
    const headers = Object.keys(json[0]);
    const rows = json.map(obj =>
      headers.map(header => obj[header]).join(',')
    );

    // Create CSV content
    const csv = [headers.join(','), ...rows].join('\n');
    return csv;
  }

  function downloadCSV(csvContent, fileName = 'data.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }


  const isPageNotFound = window.location.pathname === "*";

  return (
    <>
      <Loader loader={loader} />
      <div className={window.location.pathname == "/rental-benchmarking/" || window.location.pathname == "/rental-benchmarking" ? "mainDashboardWithoutAside" : "mainDashboard"}>
        {window.location.pathname == "/rental-benchmarking/" || window.location.pathname == "/rental-benchmarking" ? "" : <Aside />}
        <Routes>
          {isAuthenticated == false ? (
            <>
              <Route path="*" element={<PageNotFound />} />
            </>
          ) : (
            <>
              <Route path="/" element={
                <div className="dasboardRightSide">
                  <TopBar title="Rental Benchmarking" />
                  <div className="dataTableWithMap">
                    <div className="dataTableWithMapL">
                      <div className="dashboardFilters row m-0 align-items-center justify-content-between mb-4">
                        <div className="dashboardFiltersL col-sm-5 p-0">
                          <input type="text" name="search" onChange={(e) => searchByClientName(e)} placeholder='Search' />
                        </div>
                        <div className="dashboardFiltersR col-sm-6 p-0">
                          <div className="selectWithLabel">
                            <label htmlFor="sortBy">Sort By :</label>
                            <Select onChange={(e) => sortFunction(e)} isSearchable={false} defaultValue={sortOptions[0]} options={sortOptions} className='reactSelect' classNamePrefix="reactSelectInner" />
                          </div>
                          <div className="selectWithLabel">
                            <label htmlFor="status">Status :</label>
                            <Select onChange={(e) => statusFunction(e)} isSearchable={false} defaultValue={statusOptions[2]} options={statusOptions} className='reactSelect' classNamePrefix="reactSelectInner" />
                          </div>
                          <button onClick={downloadCsvFild}>Export</button>
                        </div>
                      </div>
                      <div className='infinite-scroll' onScroll={handleScroll}>
                        {/* <div className='infinite-scroll'> */}
                        <DataTable
                          columns={columns}
                          data={rowData}
                          // onRowClicked={}
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                          // pagination
                          highlightOnHover
                          progressPending={loader}
                          progressComponent={<Loader />}
                        />
                      </div>
                    </div>
                    <div className="dataTableWithMapR">
                      <LeafLetMap />
                    </div>
                  </div>
                </div>
              } />
              <Route path="/subject-property" element={
                <div className="dasboardRightSide">
                  <TopBar title="Add Subject Details" />
                  <SubjectDetsils />
                </div>
              } />
              <Route path="/subject-property/:id" element={
                <div className="dasboardRightSide">
                  <TopBar title="Add Subject Details" />
                  <SubjectDetsils />
                </div>
              } />
              <Route path="/comparable-details" element={
                <div className="dasboardRightSide">
                  <TopBar title="Add Subject Details" />
                  <ComparableDetails />
                </div>
              } />
              <Route path="/comparable-details/:id" element={
                <div className="dasboardRightSide">
                  <TopBar title="Add Subject Details" />
                  <ComparableDetails />
                </div>
              } />
              <Route path="/site-lease-terms" element={
                <div className="dasboardRightSide">
                  <TopBar title="Subject Site Lease Terms" />
                  <SubjectSiteLeaseTerms />
                </div>
              } />
              <Route path="/site-lease-terms/:id" element={
                <div className="dasboardRightSide">
                  <TopBar title="Subject Site Lease Terms" />
                  <SubjectSiteLeaseTerms />
                </div>
              } />
              <Route path="/recommended-rentals" element={
                <div className="dasboardRightSide">
                  <TopBar title="CRE Matrix Recommended Rentals" />
                  <RecommendedRentals />
                </div>
              } />
              <Route path="/recommended-rentals/:id" element={
                <div className="dasboardRightSide">
                  <TopBar title="CRE Matrix Recommended Rentals" />
                  <RecommendedRentals />
                </div>
              } />
              <Route path="/map" element={
                <div className="dasboardRightSide">
                  <LeafLetMap />
                </div>
              } />
            </>
          )}

          {/* {isAuthenticated == false && <Route element={<PageNotFound />} />} */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>

      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className='justify-content-between'>
          <h4></h4>
          <button onClick={handleClose} className="closeButton">
            <Icon icon="material-symbols:close" />
          </button>
        </Modal.Header>
        <div className="recommendationPageR">
          <PdfReader url={pdfUrl} />
        </div>
      </Modal>
    </>
  )
}

export default App
