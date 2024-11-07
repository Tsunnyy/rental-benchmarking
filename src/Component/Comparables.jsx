import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Comparables = () => {
    const [copbarableCount, setcopbarableCount] = useState("")
    const initialValues = {
        completed_step: 2,
        comparable_cre_ids: ['', '', '', '']
    };

    let navigate = useNavigate();

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validate={values => {
                    const errors = {};
                    const filledIds = values.comparable_cre_ids.filter(id => id !== '');
                    if (filledIds.length < 2) {
                        errors.comparable_cre_ids = 'At least two CRE IDs are required';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    const filledIds = values.comparable_cre_ids.filter(id => id !== '');
                    setcopbarableCount(filledIds.length)
                    const formData = {
                        completed_step: values.completed_step,
                        comparable_cre_ids: filledIds,
                        comparable_count: filledIds.length
                    };

                    axios({
                        method: 'POST',
                        url: 'http://3.7.95.255:81//api/rental_benchmarking/save_report_data',
                        data: formData
                    })
                        .then(function (res) {
                            console.log(res);
                            navigate(`/comparable-details`);
                        })
                        .catch(function (res) {
                            console.log(res);
                        })
                        .finally(function () {
                            setSubmitting(false);
                        });
                }}
            >
                {({ values, errors, touched, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <b className='minimumText'>Minimum Two CRE ID is Required <span className="required">*</span></b>
                        <div className="comparableInputs d-grid gap-4">
                            {values.comparable_cre_ids.map((_, index) => (
                                <div className="formGridInner" key={index}>
                                    <label htmlFor={`comparable_cre_ids.${index}`}>{index + 1}</label>
                                    <Field
                                        type="number"
                                        name={`comparable_cre_ids.${index}`}
                                    />
                                    {/* <ErrorMessage className='error' name={`comparable_cre_ids.${index}`} component="p" /> */}
                                </div>
                            ))}
                        </div>
                        {errors.comparable_cre_ids && typeof errors.comparable_cre_ids === 'string' && (
                            <p className="error">{errors.comparable_cre_ids}</p>
                        )}
                        <div className="d-flex justify-content-between align-items-center bottomBar">
                            <Link to={"/"}><Icon icon="mingcute:left-line" /> Back</Link>
                            <button type="submit" disabled={isSubmitting}>
                                Save and Next <Icon icon="mingcute:right-line" />
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Comparables;