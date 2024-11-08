import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from './Loader';
import { PdfReader } from './PdfReader';

const RecommendedRentals = () => {
    const [loader, setLoader] = useState(false);
    const [rentValues, setRentValues] = useState({
        first_rent_recommandation_max: 0,
        first_rent_recommandation_min: 0,
        second_rent_recommandation_max: 0,
        second_rent_recommandation_min: 0,
        subject_recommendation: '',
    });
    const [pdfUrl, setPdfUrl] = useState(undefined);
    const { id } = useParams();

    const apiUrl = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoader(true);
            try {
                // Fetching the recommended rentals initially
                const response = await axios.get(`${apiUrl}/api/rental_benchmarking/get_recommended_rentals`);
                setRentValues((prevValues) => ({
                    ...prevValues,
                    ...response.data.data, // Update state with fetched rent values
                }));

                if (id) {
                    const reportResponse = await axios.get(
                        `${apiUrl}/api/rental_benchmarking/get_report_data?id=${id}`
                    );
                    setRentValues((prevValues) => ({
                        ...prevValues,
                        ...reportResponse.data.data,
                    }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoader(false);
            }
        };

        fetchInitialData();
    }, [id]); // Depend on `id` to refetch data when it changes

    const validate = (values) => {
        const errors = {};

        // Validation logic for the form fields (optional)

        return errors;
    };

    const handleSubmit = async (data) => {
        setLoader(true);
        const formData = new FormData();
        formData.append('completed_step', 4);
        formData.append('subject_recommendation', data.subject_recommendation);
        formData.append('first_rent_recommandation_max', data.first_rent_recommandation_max);
        formData.append('first_rent_recommandation_min', data.first_rent_recommandation_min);
        formData.append('second_rent_recommandation_max', data.second_rent_recommandation_max);
        formData.append('second_rent_recommandation_min', data.second_rent_recommandation_min);

        if (id) {
            formData.append('id', id); // Append the id if editing an existing entry
        }

        try {
            const response = await axios.post(
                `${apiUrl}/api/rental_benchmarking/save_report_data`,
                formData
            );
            console.log('Form submitted successfully:', response);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setLoader(false);
            if (id) {
                try {
                    setLoader(true);
                    const reportResponse = await axios.get(
                        `${apiUrl}/api/rental_benchmarking/generate_report?id=${id}`
                    );
                    setPdfUrl(reportResponse.data.data.report_full_path);
                } catch (error) {
                    console.error('Error generating report:', error);
                } finally {
                    setLoader(false);
                }
            }
        }
    };

    const getInitialValues = () => {
        axios.get(`${apiUrl}/api/rental_benchmarking/get_recommended_rentals`).then((response) => {
            setRentValues((prevValues) => ({
                ...prevValues,
                ...response.data.data,
            }));
        });
    }

    return (
        <div>
            <Loader loader={loader} />
            <div className="row m-0 recommendationPage">
                <div className="col-12 p-0 mb-3 backBtn">
                    <Link to={`/site-lease-terms/${id}`}>
                        <Icon icon="mingcute:left-line" /> Back
                    </Link>
                </div>
                <Formik
                    enableReinitialize
                    initialValues={rentValues}
                    validate={validate}
                    onSubmit={handleSubmit}
                >
                    {({ values }) => (
                        <Form className="col-sm-8 ps-0 recommendationPageL">
                            <div className="row m-0">
                                <div className="col-sm-6 ps-0">
                                    <div className="planRecommended">
                                        <p>Floor</p>
                                        <div className="priceRange d-flex gap-2 align-items-center">
                                            <div className="priceRangeOne d-flex align-items-center">
                                                <Icon icon="mdi:rupee" />
                                                <Field type="tel" name="first_rent_recommandation_min" />
                                                <ErrorMessage name="first_rent_recommandation_min" component="p" className="error" />
                                            </div>
                                            <span>-</span>
                                            <div className="priceRangeTwo d-flex align-items-center">
                                                <Icon icon="mdi:rupee" />
                                                <Field type="tel" name="first_rent_recommandation_max" />
                                                <ErrorMessage name="first_rent_recommandation_max" component="p" className="error" />
                                            </div>
                                            <h5>sqft / month</h5>
                                        </div>
                                    </div>
                                    <h4>*On Carpet Area</h4>
                                </div>
                                <div className="col-sm-6 pe-0">
                                    <div className="planRecommended">
                                        <p>Floor</p>
                                        <div className="priceRange d-flex gap-2 align-items-center">
                                            <div className="priceRangeOne d-flex align-items-center">
                                                <Icon icon="mdi:rupee" />
                                                <Field type="tel" name="second_rent_recommandation_min" />
                                                <ErrorMessage name="second_rent_recommandation_min" component="p" className="error" />
                                            </div>
                                            <span>-</span>
                                            <div className="priceRangeTwo d-flex align-items-center">
                                                <Icon icon="mdi:rupee" />
                                                <Field type="tel" name="second_rent_recommandation_max" />
                                                <ErrorMessage name="second_rent_recommandation_max" component="p" className="error" />
                                            </div>
                                            <h5>sqft / month</h5>
                                        </div>
                                    </div>
                                    <h4>*On Carpet Area</h4>
                                </div>
                            </div>
                            <textarea name="subject_recommendation" placeholder="Recommendation Text" />
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <button className="button resetBtn" onClick={getInitialValues} type="reset">
                                        Reset Rentals
                                    </button>
                                    <br />
                                    <em>Note: This will reset to system's logic Numbers.</em>
                                </div>
                                <button type="submit" className="button generate">
                                    Generate Report
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <div className="col-sm-4 pe-0 recommendationPageR">
                    <PdfReader url={pdfUrl} />
                    {/* <PdfReader url={"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"} /> */}
                </div>
            </div>
        </div>
    );
};

export default RecommendedRentals;
