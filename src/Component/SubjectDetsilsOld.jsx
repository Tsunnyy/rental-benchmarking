import React, { useState } from 'react';
import { Field, FieldArray, Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './canvasUtils'
import { serialize } from 'object-to-formdata';
import axios from 'axios';

const YourComponent = () => {
    const [initialValues, setInitialValues] = useState({
        completed_step: 1,
        client_name: 'Sunny',
        date_of_request: '2000-10-10',
        contact_person: 'a',
        subject_cre_id: '1',
        subject_area_details: [
            { floor: '1', carpet_area: '1' },
        ],
        subject_gmap_location: 'https://www.google.com/maps/place/Lodha+Supremus,+Saki+Vihar+Rd,+Opposite+Mtnl+Off,+Tunga+Village,+Chandivali,+Powai,+Mumbai,+Maharashtra+400072/@19.1183794,72.890529,823m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3be7c80f04f37535:0x5c19f51fed6e597!8m2!3d19.1185544!4d72.8905926!16s%2Fg%2F11qs96yn5w?entry=ttu&g_ep=EgoyMDI0MDkyMi4wIKXMDSoASAFQAw%3D%3D',
        subject_address: 'test',
        subject_lat: '1',
        subject_long: '1',
        subject_propert_type: '',
        subject_pincode: '109876',
        subject_efficiency: '100',
        subject_lease_type: '',
        subject_nearby_assets: ['1'],
        subject_frontage: '1',
        subject_vintage: '1',
        subject_images: [
            { type: 'subject', sub_type: 'main', data: "" },
        ],
    });
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [mainImageSrc, setMainImageSrc] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [convertedImage, setConvertedImage] = useState([])
    const [otherImages, setOtherImages] = useState([])


    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
        console.log(croppedArea, croppedAreaPixels)
    }

    function readFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            let imageDataUrl = await readFile(file)
            console.log("imageDataUrl", imageDataUrl)
            setMainImageSrc(imageDataUrl)
        }
    }

    const showCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(
                mainImageSrc,
                croppedAreaPixels,
            )
            console.log('donee', { croppedImage })
            let file = await fetch(croppedImage)
                .then(r => r.blob())
                .then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "image/png" }))
            console.log(file)
            setConvertedImage(file)
            console.log("convertedImage", convertedImage)
            setCroppedImage(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }

    const otherImagesHandleChange = (e) => {
        const newFiles = [];
        for (let i = 0; i < e.target.files.length && i < 5; i++) {
            newFiles.push(e.target.files[i]);
            console.log(newFiles)
        }
        setOtherImages((prevImages) => [
            ...prevImages,
            ...newFiles
        ]);
    };


    const deleteOtherImages = (index) => {
        setOtherImages((prevImages) => {
            const temp = [...prevImages];
            temp.splice(index, 1);
            console.log("temp", temp)
            return temp;
        });
    }

    const deleteMainImage = () => {
        setMainImageSrc("")
        setCroppedImage("")
    }

    return (
        <Formik
            initialValues={initialValues}
            validate={values => {
                const errors = { subject_area_details: [] };
                let subject_area_details_error = false;
                if (!values.client_name) {
                    errors.client_name = 'Client Name is required';
                }
                if (!values.date_of_request) {
                    errors.date_of_request = 'Date of Request is required';
                }
                if (!values.subject_gmap_location) {
                    errors.subject_gmap_location = 'Google Map Location is required';
                } else {
                    const regex = /^(https?:\/\/)?(www\.)?(google\.com\/maps\/place|maps\.google\.com\/)(.+)$/;
                    if (!regex.test(values.subject_gmap_location)) {
                        errors.subject_gmap_location = 'Please provide a valid Google Map Location URL';
                    }
                }
                values.subject_area_details.forEach((area, index) => {
                    errors.subject_area_details.push({});
                    if (!area.floor) {
                        errors.subject_area_details[index].floor = 'Floor is required';
                        subject_area_details_error = true;
                    }
                    if (!area.carpet_area) {
                        errors.subject_area_details[index].carpet_area = 'Carpet Area is required';
                        subject_area_details_error = true;
                    }
                });
                if (!values.subject_address) {
                    errors.subject_address = 'Address is required';
                }
                if (!values.subject_pincode || !/^\d{6}$/.test(values.subject_pincode)) {
                    errors.subject_pincode = 'Please enter a valid 6-digit Pin Code.';
                }
                if (!values.subject_lat || !/^-?(?:[0-9]{1,2}\.[0-9]{1,6}|[0-9]{1,3})$/.test(values.subject_lat)) {
                    errors.subject_lat = 'Please enter a valid Latitude (between -90 and 90).';
                }
                if (!values.subject_long || !/^-?(?:[0-9]{1,3}\.[0-9]{1,6}|[0-9]{1,4})$/.test(values.subject_long)) {
                    errors.subject_long = 'Please enter a valid Longitude (between -180 and 180).';
                }
                if (!values.subject_propert_type) {
                    errors.subject_propert_type = 'Property Type is required';
                }
                if (!values.subject_efficiency) {
                    errors.subject_efficiency = 'Efficiency is required';
                } else if (values.subject_efficiency < 0 || values.subject_efficiency > 100) {
                    errors.subject_efficiency = 'Efficiency must be between 0 and 100';
                }
                if (!values.subject_frontage) {
                    errors.subject_frontage = 'Frontage is required';
                }
                if (!values.subject_vintage) {
                    errors.subject_vintage = 'Vintage of Property is required';
                }
                if (!subject_area_details_error) delete errors.subject_area_details;
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                console.log(JSON.stringify(values));
                values.subject_images[0].data = convertedImage;
                for (let i = 0; i < otherImages.length; i++) {
                    values.subject_images.push({
                        type: 'subject',
                        sub_type: 'other',
                        data: otherImages[i],
                    });
                }
                const formData = serialize(
                    values,
                );
                console.log(formData);
                console.log(values);

                axios({
                    method: 'POST',
                    url: 'http://3.7.95.255:81//api/rental_benchmarking/save_report_data',
                    data: formData
                })
                    .then(function (res) {
                        console.log(res)
                        alert('form Saved');
                    })
                    .catch(function (res) {
                        console.log(res)
                    });
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
            }) => (
                <>
                    <Form onSubmit={handleSubmit}>
                        <div className="formGridParent">
                            <div className="formGridInner">
                                <label htmlFor="client_name">Client Name<span className="required">*</span></label>
                                <Field
                                    type="text"
                                    name="client_name"
                                />
                                <p className='error'>{errors.client_name && touched.client_name && errors.client_name}</p>
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="date_of_request">Date of Request<span className="required">*</span></label>
                                <Field
                                    type="date"
                                    name="date_of_request"
                                />
                                <p className='error'>{errors.date_of_request && touched.date_of_request && errors.date_of_request}</p>
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="contact_person">Contact Person @ Client (Optional)</label>
                                <Field
                                    type="text"
                                    name="contact_person"
                                />
                                <p className='error'>{errors.contact_person && touched.contact_person && errors.contact_person}</p>
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_cre_id">CRE ID of Subject Site (Optional)</label>
                                <Field
                                    type="text"
                                    name="subject_cre_id"
                                />
                                <p className='error'>{errors.subject_cre_id && touched.subject_cre_id && errors.subject_cre_id}</p>
                            </div>
                            {/* <div className="full"></div> */}
                            <div className="full">
                                <hr />
                                <FieldArray name="subject_area_details"
                                    render={arrayHelpers =>
                                        <div className='d-grid gap-3'>
                                            {values.subject_area_details.map((val, index) => {
                                                return (
                                                    <div className="floorCarpetGrid align-items-end" key={index}>
                                                        <div className="">
                                                            <div className="formGridInner">
                                                                <label htmlFor={`subject_area_details.${index}.floor`}>Floor <span className="required">*</span></label>
                                                                <Field
                                                                    // onBlur={handleBlur}
                                                                    type="number"
                                                                    name={`subject_area_details.${index}.floor`}
                                                                // value={val.floor}
                                                                />
                                                                {errors.subject_area_details && errors.subject_area_details[index] &&
                                                                    <p className='error'>{errors.subject_area_details[index].floor}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <div className="formGridInner" key={index}>
                                                                <label htmlFor={`subject_area_details.${index}.carpet_area`}>Carpet Area <span className="required">*</span></label>
                                                                <Field
                                                                    // onBlur={handleBlur}
                                                                    type="number"
                                                                    name={`subject_area_details.${index}.carpet_area`}
                                                                // value={val.floor}
                                                                />
                                                                {errors.subject_area_details && errors.subject_area_details[index] &&
                                                                    <p className='error'>{errors.subject_area_details[index].carpet_area}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="icon_group">
                                                            {index > 0 && (
                                                                <button type="button"
                                                                    onClick={() => arrayHelpers.remove(index)}>
                                                                    <img src="/img/icons/delete.svg" alt="delete" />
                                                                </button>
                                                            )}
                                                            <button type="button"
                                                                onClick={() => arrayHelpers.push({ floor: '', carpet_area: '' })}>
                                                                <img src="/img/icons/add.svg" alt="Add" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    }
                                />
                                <hr />
                            </div>
                            {/* <div className="full"></div> */}
                            <div className="formGridInner">
                                <label htmlFor="subject_gmap_location">Enter Google Location of Site Here<span className="required">*</span></label>
                                <Field
                                    type="text"
                                    name="subject_gmap_location"
                                />
                                <p className='error'>{errors.subject_gmap_location && touched.subject_gmap_location && errors.subject_gmap_location}</p>
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_address">Address - Subject Site<span className="required">*</span></label>
                                <Field
                                    type="text"
                                    name="subject_address"
                                />
                                <p className='error'>{errors.subject_address && touched.subject_address && errors.subject_address}</p>
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_lat">Latitude<span className="required">*</span></label>
                                <Field
                                    type="number"
                                    name="subject_lat"
                                />
                                <p className='error'>{errors.subject_lat && touched.subject_lat && errors.subject_lat}</p>
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_long">Longitude<span className="required">*</span></label>
                                <Field
                                    type="number"
                                    name="subject_long"
                                />
                                <p className='error'>{errors.subject_long && touched.subject_long && errors.subject_long}</p>
                            </div>


                            <div className="formGridInner">
                                <label htmlFor="subject_propert_type">Property (Comm / Resi / Indus)*<span className="required">*</span></label>
                                <Field
                                    component="select"
                                    name="subject_propert_type"
                                >
                                    <option value="">Select</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="residential">Residential</option>
                                    <option value="industrial">Industrial</option>
                                </Field>
                                <p className='error'>{errors.subject_propert_type && touched.subject_propert_type && errors.subject_propert_type}</p>
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_pincode">Pin Code - Subject Site<span className="required">*</span></label>
                                <Field
                                    type="number"
                                    maxLength={6}
                                    name="subject_pincode"
                                />
                                <p className='error'>{errors.subject_pincode && touched.subject_pincode && errors.subject_pincode}</p>
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_efficiency">Efficiency <span className="required">*</span></label>
                                <Field
                                    type="text"
                                    name="subject_efficiency"
                                />
                                <p className='error'>{errors.subject_efficiency && touched.subject_efficiency && errors.subject_efficiency}</p>
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_lease_type">New / Renewal (Optional)</label>
                                <Field
                                    component="select"
                                    name="subject_lease_type"
                                >
                                    <option value="">Select</option>
                                    <option value="new">New</option>
                                    <option value="renewal">Renewal</option>
                                </Field>
                                <p className='error'>{errors.subject_lease_type && touched.subject_lease_type && errors.subject_lease_type}</p>
                            </div>
                            <div className="formGridInner position-unset corpperMain full">
                                <div className="d-flex gap-4 my-4">
                                    <div className="mainImagePart">
                                        <label htmlFor="subject_images">Main Image<span className="required">*</span></label>
                                        {mainImageSrc ? (
                                            <>
                                                {!croppedImage ? (
                                                    <>
                                                        <Cropper
                                                            image={mainImageSrc}
                                                            crop={crop}
                                                            zoom={zoom}
                                                            aspect={4 / 3}
                                                            onCropChange={setCrop}
                                                            onCropComplete={onCropComplete}
                                                            onZoomChange={setZoom}
                                                            cropSize={{ height: 500, width: 1153 }}
                                                        />
                                                        <button
                                                            onClick={showCroppedImage}
                                                            type='button'
                                                            className='button showCroppedImage'
                                                        >
                                                            Show Result
                                                        </button>
                                                    </>
                                                ) :
                                                    <div className="d-flex">
                                                        <div className="position-relative croppedImageWithIcon">
                                                            <span onClick={deleteMainImage}>
                                                                <Icon icon="mingcute:close-circle-fill" />
                                                            </span>
                                                            <img src={croppedImage} name="CroppedImage" className='finalCroppedImage' alt="Cropped Image" />
                                                        </div>
                                                    </div>
                                                }

                                            </>
                                        ) :
                                            <div className="position-relative customInputBox">
                                                <Field
                                                    type="file"
                                                    name="subject_images[0].data"
                                                    accept="image/png, image/gif, image/jpeg"
                                                    onChange={onFileChange}
                                                />
                                                <Icon icon="ph:plus-bold" />
                                            </div>
                                        }
                                        <p className='error'>{errors.subject_images && touched.subject_images && errors.subject_images[0]?.data && errors.subject_images[0]?.data}</p>
                                    </div>
                                    <div className="otherImagePart">
                                        <label htmlFor="subject_images">Other Images <em>(Maximum 5 images)</em></label>

                                        <div className="d-flex gap-4">
                                            {otherImages.map((val, index) => {
                                                return (
                                                    <div key={index} className="position-relative croppedImageWithIcon">
                                                        <span onClick={() => deleteOtherImages(index)}>
                                                            <Icon icon="mingcute:close-circle-fill" />
                                                        </span>
                                                        <img src={URL.createObjectURL(val)} name="CroppedImage" className='finalCroppedImage' alt="Cropped Image" />
                                                    </div>
                                                )
                                            })}
                                            <div className="position-relative customInputBox">
                                                <Field
                                                    accept="image/png, image/gif, image/jpeg"
                                                    multiple
                                                    type="file"
                                                    name="subject_images[0].data"
                                                    onChange={otherImagesHandleChange}
                                                />
                                                <Icon icon="ph:plus-bold" />
                                            </div>
                                        </div>

                                        <p className='error'>{errors.subject_images && touched.subject_images && errors.subject_images}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="full">
                                <FieldArray name="subject_nearby_assets"
                                    render={arrayHelpers =>
                                        <div className='hello world'>
                                            {values.subject_nearby_assets.map((val, index) => {
                                                return (
                                                    <div className="floorCarpetGrid floorCarpetGridForNearBy align-items-end" key={index}>
                                                        <div className="formGridInner">
                                                            <label htmlFor={`subject_nearby_assets[${index}]`}>NearBy Assets <span className="required">*</span></label>
                                                            <Field
                                                                type="text"
                                                                name={`subject_nearby_assets[${index}]`}
                                                            />
                                                            {/* <p className='error'>{val.floor && touched.val.floor && val.floor}</p> */}
                                                        </div>
                                                        <div className="icon_group">
                                                            {index > 0 && (
                                                                <button type="button"
                                                                    onClick={() => arrayHelpers.remove(index)}>
                                                                    <img src="/img/icons/delete.svg" alt="delete" />
                                                                </button>
                                                            )}
                                                            <button type="button"
                                                                onClick={() => arrayHelpers.push([])}>
                                                                <img src="/img/icons/add.svg" alt="Add" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    }
                                />
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_frontage">Frontage (Feet)<span className="required">*</span></label>
                                <Field
                                    type="number"
                                    name="subject_frontage"
                                />
                                <p className='error'>{errors.subject_frontage && touched.subject_frontage && errors.subject_frontage}</p>
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_vintage">Vintage of Property (Yrs)<span className="required">*</span></label>
                                <Field
                                    type="number"
                                    name="subject_vintage"
                                />
                                <p className='error'>{errors.subject_vintage && touched.subject_vintage && errors.subject_vintage}</p>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center bottomBar">
                            <Link to={"/"}><Icon icon="mingcute:left-line" /> Back</Link>
                            <button type="submit">
                                Save and Next <Icon icon="mingcute:right-line" />
                            </button>
                        </div>
                    </Form>
                </>
            )}
        </Formik>
    );
};

export default YourComponent;
