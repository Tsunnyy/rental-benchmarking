import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import Loader from './Loader';

const SubjectSiteLeaseTerms = () => {
  const [loader, setLoader] = useState(false)
  const [initialValues, setinitialValues] = useState(
    {
      subject_lease_term: '',
      subject_escalation: '',
      subject_escalation_after_x_years: '',
      subject_security_deposit: '',
      subject_rentfree_period: '',
      subject_site_observation: '',
      subject_cagr_analysis: '',
    }
  )
  // const initialValues = {
  //   subject_lease_term: '',
  //   subject_escalation: '',
  //   subject_escalation_after_x_years: '',
  //   subject_security_deposit: '',
  //   subject_rentfree_period: '',
  //   subject_site_observation: '',
  //   subject_cagr_analysis: '',
  // };

  const navigate = useNavigate();

  let { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoader(true)
        try {
          const response = await axios.get(`http://3.7.95.255:81/api/rental_benchmarking/get_report_data?id=${id}`);
          const data = response.data.data;
          console.log(data, "Fetched data");

          // initialValues.subject_cagr_analysis = data.subject_cagr_analysis
          setinitialValues(data)
          console.log(initialValues, "initialValues")

        } catch (err) {
          console.error(err);
        } finally {
          setLoader(false)
        }
      };

      fetchData();
    }
  }, [id]);

  const validate = (values) => {
    const errors = {};

    if (!values.subject_lease_term) {
      errors.subject_lease_term = 'Lease Term is required';
    }

    if (!values.subject_escalation) {
      errors.subject_escalation = 'Escalation % is required';
    }

    if (!values.subject_escalation_after_x_years) {
      errors.subject_escalation_after_x_years = 'Escalation After X Years is required';
    }
    if (!values.subject_security_deposit) {
      errors.subject_security_deposit = 'Security Deposit is required';
    }

    if (!values.subject_rentfree_period) {
      errors.subject_rentfree_period = 'Rent Free Period is required';
    }

    if (!values.subject_site_observation) {
      errors.subject_site_observation = 'Site Observations are required';
    }

    if (!values.subject_cagr_analysis) {
      errors.subject_cagr_analysis = 'CAGR Analysis is required';
    }

    return errors;
  };

  const handleSubmit = (values) => {
    setLoader(true)
    console.log(values);

    const formData = new FormData();
    if (id) {
      formData.append("id", id);
    }
    formData.append("completed_step", 3);
    formData.append("subject_lease_term", values.subject_lease_term);
    formData.append("subject_escalation", values.subject_escalation);
    formData.append("subject_escalation_after_x_years", values.subject_escalation_after_x_years);
    formData.append("subject_security_deposit", values.subject_security_deposit);
    formData.append("subject_rentfree_period", values.subject_rentfree_period);
    formData.append("subject_site_observation", values.subject_site_observation);
    formData.append("subject_cagr_analysis", values.subject_cagr_analysis);

    try {
      axios({
        method: 'POST',
        url: 'http://3.7.95.255:81/api/rental_benchmarking/save_report_data',
        data: formData
      })
        .then(function (res) {
          console.log(res, "resresresresresres")
          navigate(`/recommended-rentals/${id}`);
        })
        .catch(function (res) {
          console.log(res)
        }).finally(function () {
          setLoader(false)
        })

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <Loader loader={loader} />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className="formGridParent">
              <div className="formGridInner">
                <label htmlFor="subject_lease_term">
                  Lease Term (Yrs) <span className="required">*</span>
                </label>
                <Field type="number" name="subject_lease_term" />
                <ErrorMessage name="subject_lease_term" component="p" className="error" />
              </div>
              <div className="formGridInner">
                <label htmlFor="subject_escalation">
                  Escalation % <span className="required">*</span>
                </label>
                <Field type="number" name="subject_escalation" />
                <ErrorMessage name="subject_escalation" component="p" className="error" />
              </div>
              <div className="formGridInner">
                <label htmlFor="subject_escalation_after_x_years">
                  Escalation After X Years <span className="required">*</span>
                </label>
                <Field type="number" name="subject_escalation_after_x_years" />
                <ErrorMessage name="subject_escalation_after_x_years" component="p" className="error" />
              </div>
              <div className="formGridInner">
                <label htmlFor="subject_security_deposit">
                  Security Deposit (months) <span className="required">*</span>
                </label>
                <Field type="number" name="subject_security_deposit" />
                <ErrorMessage name="subject_security_deposit" component="p" className="error" />
              </div>
              <div className="formGridInner">
                <label htmlFor="subject_rentfree_period">
                  Rent Free Period <span className="required">*</span>
                </label>
                <Field type="number" name="subject_rentfree_period" />
                <ErrorMessage name="subject_rentfree_period" component="p" className="error" />
              </div>
              <div className="formGridInner"></div>
              <div className="formGridInner">
                <label htmlFor="subject_site_observation">
                  Site Observations <span className="required">*</span>
                </label>
                <Field component="textarea" name="subject_site_observation" />
                <ErrorMessage name="subject_site_observation" component="p" className="error" />
              </div>
              <div className="formGridInner">
                <label htmlFor="subject_cagr_analysis">
                  CAGR Analysis <span className="required">*</span>
                </label>
                <Field component="textarea" name="subject_cagr_analysis" />
                <ErrorMessage name="subject_cagr_analysis" component="p" className="error" />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bottomBar">
              <Link to={`/comparable-details/${id}`}><Icon icon="mingcute:left-line" /> Back</Link>
              <button type="submit">
                Save and Next <Icon icon="mingcute:right-line" />
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SubjectSiteLeaseTerms;
