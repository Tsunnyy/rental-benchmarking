import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './canvasUtils'
// import { serialize } from 'object-to-formdata';
import axios from 'axios';
import Loader from './Loader';

const SubjectDetsils = () => {
    // const [initialValues, setInitialValues] = useState({
    //     completed_step: 1,
    //     client_name: 'Sunny',
    //     request_at: '2000-10-10',
    //     contact_person: 'a',
    //     subject_cre_id: '1',
    //     subject_area_details: [
    //         { floor: '1', carpet_area: '1' },
    //     ],
    //     subject_gmap_location: 'https://www.google.com/maps/place/Lodha+Supremus,+Saki+Vihar+Rd,+Opposite+Mtnl+Off,+Tunga+Village,+Chandivali,+Powai,+Mumbai,+Maharashtra+400072/@19.1183794,72.890529,823m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3be7c80f04f37535:0x5c19f51fed6e597!8m2!3d19.1185544!4d72.8905926!16s%2Fg%2F11qs96yn5w?entry=ttu&g_ep=EgoyMDI0MDkyMi4wIKXMDSoASAFQAw%3D%3D',
    //     subject_address: 'test',
    //     subject_lat: '1',
    //     subject_long: '1',
    //     subject_property_type: '',
    //     subject_pincode: '109876',
    //     subject_efficiency: '100',
    //     subject_lease_type: '',
    //     subject_nearby_assets: ['1'],
    //     subject_frontage: '1',
    //     subject_vintage: '1',
    //     subject_images: [
    //         // { type: 'subject', sub_type: 'main', data: "" },
    //     ],
    // });
    const [initialValues, setInitialValues] = useState({
        completed_step: 1,
        client_name: '',
        request_at: '',
        contact_person: '',
        subject_cre_id: '',
        subject_area_details: [
            { floor: '', carpet_area: '' },
        ],
        subject_gmap_location: '',
        subject_address: '',
        subject_lat: '',
        subject_long: '',
        subject_property_type: '',
        subject_pincode: '',
        subject_efficiency: '',
        subject_lease_type: '',
        subject_nearby_assets: [''],
        subject_frontage: '',
        subject_vintage: '',
        subject_images: [
            // { type: 'subject', sub_type: 'main', data: "" },
        ],
    });
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [mainImageSrc, setMainImageSrc] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [convertedImage, setConvertedImage] = useState([])
    const [otherImages, setOtherImages] = useState([])
    const [loader, setLoader] = useState(false)

    const navigate = useNavigate();

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
        // console.log(croppedArea, croppedAreaPixels)
    }

    let { id } = useParams();
    //// console.log(id)

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                setLoader(true)
                try {
                    const response = await axios.get(`http://3.7.95.255:81/api/rental_benchmarking/get_report_data?id=${id}`)
                    const data = response.data.data;
                    // console.log(data, "Fetched data");

                    // Only parse if they are strings
                    data.subject_area_details = typeof data.subject_area_details === 'string'
                        ? JSON.parse(data.subject_area_details)
                        : data.subject_area_details;

                    data.subject_nearby_assets = typeof data.subject_nearby_assets === 'string'
                        ? JSON.parse(data.subject_nearby_assets)
                        : data.subject_nearby_assets;

                    setInitialValues(prev => ({
                        ...prev,
                        ...data, // Spread existing initialValues and update with fetched data
                        subject_area_details: data.subject_area_details || prev.subject_area_details,
                        subject_nearby_assets: data.subject_nearby_assets || prev.subject_nearby_assets,
                    }));

                    const imagePath = data.assets[0]?.image_path;
                    if (imagePath) {
                        setCroppedImage(imagePath);
                        setMainImageSrc(imagePath);
                    }

                    const existingOtherImages = data.assets.filter(image => image.type === "subject" && image.sub_type === "other");
                    const files = await Promise.all(
                        existingOtherImages.map(async (image) => {
                            const response = await fetch(image.image_path);
                            const blobFile = await response.blob();
                            return new File([blobFile], "main.png", { type: "image/png" });
                        })
                    );
                    if (files) {
                        setOtherImages(prevImages => [...prevImages, ...files]);
                    }

                } catch (err) {
                    console.error(err);
                } finally {
                    setLoader(false);
                }
            };

            fetchData();
        }
    }, [id]);

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
            // console.log("imageDataUrl", imageDataUrl)
            setMainImageSrc(imageDataUrl)
        }
    }

    const showCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(
                mainImageSrc,
                croppedAreaPixels,
            )
            // console.log('donee', { croppedImage })
            let file = await fetch(croppedImage)
                .then(r => r.blob())
                .then(blobFile => new File([blobFile], "main.png", { type: "image/png" }))
            // console.log(file, "Fileeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
            setConvertedImage(file)
            // console.log("convertedImageconvertedImageconvertedImageconvertedImageconvertedImageconvertedImageconvertedImageconvertedImageconvertedImageconvertedImageconvertedImage", convertedImage)
            setCroppedImage(croppedImage)
        } catch (e) {
            console.error(e)
        }
    }

    const otherImagesHandleChange = (e) => {
        const newFiles = [];
        for (let i = 0; i < e.target.files.length && i < 5; i++) {
            newFiles.push(e.target.files[i]);
            console.log(i, "iiiii")
            console.log(otherImages, "OtherImages")
            // console.log(newFiles, "newFiles")
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
            // console.log("temp", temp)
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
            enableReinitialize
            validate={values => {
                const errors = {};
                let subject_area_details_error = false;
                if (!values.client_name) {
                    errors.client_name = 'Client Name is required';
                }
                if (!values.request_at) {
                    errors.request_at = 'Date of Request is required';
                }
                if (!values.subject_gmap_location) {
                    errors.subject_gmap_location = 'Google Map Location is required';
                } else {
                    const regex = /^(https?:\/\/)?(www\.)?(google\.com\/maps\/place|maps\.google\.com\/)(.+)$/;
                    if (!regex.test(values.subject_gmap_location)) {
                        errors.subject_gmap_location = 'Please provide a valid Google Map Location URL';
                    }
                }

                // if (!values.subject_area_details || values.subject_area_details.length === 0) {
                //     errors.subject_area_details = { _error: 'At least one subject area is required' };
                // } else {
                //     values.subject_area_details.forEach((item, index) => {
                //         if (!item.floor) {
                //             if (!errors.subject_area_details) {
                //                 errors.subject_area_details = {};
                //             }
                //             errors.subject_area_details[index] = { floor: 'Floor is required' };
                //         } else if (item.floor <= 0) {
                //             if (!errors.subject_area_details) {
                //                 errors.subject_area_details = {};
                //             }
                //             errors.subject_area_details[index] = { floor: 'Floor must be a positive number' };
                //         }

                //         if (!item.carpet_area) {
                //             if (!errors.subject_area_details) {
                //                 errors.subject_area_details = {};
                //             }
                //             errors.subject_area_details[index] = { carpet_area: 'Carpet Area is required' };
                //         } else if (item.carpet_area <= 0) {
                //             if (!errors.subject_area_details) {
                //                 errors.subject_area_details = {};
                //             }
                //             errors.subject_area_details[index] = { carpet_area: 'Carpet Area must be a positive number' };
                //         }
                //     });
                // }

                if (!values.subject_area_details || values.subject_area_details.length === 0) {
                    errors.subject_area_details = 'At least one subject area is required';
                } else {
                    const areaErrors = [];
                    values.subject_area_details.forEach((item, index) => {
                        const itemErrors = {};

                        if (!item.floor) {
                            itemErrors.floor = 'Floor is required';
                        } else if (isNaN(item.floor) || item.floor <= 0) {
                            itemErrors.floor = 'Floor must be a positive number';
                        }

                        if (!item.carpet_area) {
                            itemErrors.carpet_area = 'Carpet Area is required';
                        } else if (isNaN(item.carpet_area) || item.carpet_area <= 0) {
                            itemErrors.carpet_area = 'Carpet Area must be a positive number';
                        }

                        if (Object.keys(itemErrors).length > 0) {
                            areaErrors[index] = itemErrors;
                        }
                    });

                    if (areaErrors.length > 0) {
                        errors.subject_area_details = areaErrors;
                    }
                }

                // Validate main image
                if (!croppedImage && !mainImageSrc) {
                    errors.mainImage = 'Main image is required';
                }

                // Validate other images
                if (otherImages.length === 0) {
                    errors.otherImages = 'At least one other image is required';
                }

                if (!values.subject_address) {
                    errors.subject_address = 'Address is required';
                }
                if (!values.subject_pincode || !/^\d{6}$/.test(values.subject_pincode)) {
                    errors.subject_pincode = 'Please enter a valid 6-digit Pin Code.';
                }
                // if (!values.subject_lat || !/^-?(?:[0-9]{1,2}\.[0-9]{1,6}|[0-9]{1,3})$/.test(values.subject_lat)) {
                //     errors.subject_lat = 'Please enter a valid Latitude (between -90 and 90).';
                // }
                // if (!values.subject_long || !/^-?(?:[0-9]{1,3}\.[0-9]{1,6}|[0-9]{1,4})$/.test(values.subject_long)) {
                //     errors.subject_long = 'Please enter a valid Longitude (between -180 and 180).';
                // }

                if (!values.subject_lat) {
                    errors.subject_lat = 'Latitude is required';
                } else if (values.subject_lat < -90 || values.subject_lat > 90) {
                    errors.subject_lat = 'Latitude must be between -90 and 90';
                }

                // Validate longitude
                if (!values.subject_long) {
                    errors.subject_long = 'Longitude is required';
                } else if (values.subject_long < -180 || values.subject_long > 180) {
                    errors.subject_long = 'Longitude must be between -180 and 180';
                }

                if (!values.subject_property_type) {
                    errors.subject_property_type = 'Property Type is required';
                }

                if (!values.subject_nearby_assets || values.subject_nearby_assets.length === 0) {
                    errors.subject_nearby_assets = 'At least one asset is required';
                } else {
                    values.subject_nearby_assets.forEach((asset, index) => {
                        if (!asset) {
                            if (!errors.subject_nearby_assets) {
                                errors.subject_nearby_assets = {};
                            }
                            errors.subject_nearby_assets[index] = 'This field is required';
                        }
                    });
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
                // if (!subject_area_details_error) delete errors.subject_area_details;
                return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
                setLoader(true)
                let postdata = new FormData();

                if (id) {
                    postdata.append("id", id);
                }
                postdata.append("completed_step", "1");
                postdata.append("client_name", values.client_name);
                postdata.append("request_at", values.request_at);
                postdata.append("contact_person", values.contact_person);
                postdata.append("subject_cre_id", values.subject_cre_id);
                postdata.append("subject_area_details", JSON.stringify(values.subject_area_details));
                postdata.append("subject_gmap_location", values.subject_gmap_location);
                postdata.append("subject_address", values.subject_address);
                postdata.append("subject_lat", values.subject_lat);
                postdata.append("subject_long", values.subject_long);
                postdata.append("subject_property_type", values.subject_property_type);
                postdata.append("subject_pincode", values.subject_pincode);
                postdata.append("subject_efficiency", values.subject_efficiency);
                postdata.append("subject_lease_type", values.subject_lease_type);
                postdata.append("subject_nearby_assets", JSON.stringify(values.subject_nearby_assets));
                postdata.append("subject_frontage", values.subject_frontage);
                postdata.append("subject_vintage", values.subject_vintage);
                postdata.append("subject_images", JSON.stringify(values.subject_images));
                //// console.log(JSON.stringify(values));

                if (typeof convertedImage.name !== "undefined") {
                    postdata.append("subject_images[main]", convertedImage);
                }

                values.subject_images['other'] = [];
                for (let i = 0; i < otherImages.length; i++) {
                    postdata.append("subject_images[other][" + i + "]", otherImages[i]);
                }
                if (id) {
                    values.id = id;
                }
                values.subject_images['main'] = convertedImage;
                // values.subject_area_details = JSON.stringify(values.subject_area_details);
                // values.subject_nearby_assets = JSON.stringify(values.subject_nearby_assets);
                // console.log(values, "valuesvaluesvaluesvaluesvaluesvaluesvaluesvaluesvaluesvaluesvaluesvalues")
                // console.log("postdata", postdata);

                axios({
                    method: 'POST',
                    url: 'http://3.7.95.255:81/api/rental_benchmarking/save_report_data',
                    data: postdata
                })
                    .then(function (res) {
                        // values.subject_area_details = JSON.parse(values.subject_area_details);
                        // values.subject_nearby_assets = JSON.parse(values.subject_nearby_assets);
                        console.log("resresresresresresresresresres", res);
                        if (id) {
                            navigate(`/comparable-details/${id}`);
                        } else {
                            navigate(`/comparable-details/${res.data.data.id}`);
                        }
                        // navigate('/comparable-details');
                    })
                    .catch(function (res) {
                        console.log(res)
                    }).finally(function () {
                        setSubmitting(false);
                        setLoader(false)
                    })
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
                    <Loader loader={loader} />
                    <Form onSubmit={handleSubmit}>
                        <div className="formGridParent">
                            <div className="formGridInner">
                                <label htmlFor="client_name">Client Name<span className="required">*</span></label>
                                <Field
                                    type="text"
                                    name="client_name"
                                />
                                <ErrorMessage className='error' name="client_name" component="p" />
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="request_at">Date of Request<span className="required">*</span></label>
                                <Field
                                    type="date"
                                    name="request_at"
                                />
                                <ErrorMessage className='error' name="request_at" component="p" />
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="contact_person">Contact Person @ Client (Optional)</label>
                                <Field
                                    type="text"
                                    name="contact_person"
                                />
                                <ErrorMessage className='error' name="contact_person" component="p" />
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_cre_id">CRE ID of Subject Site (Optional)</label>
                                <Field
                                    type="text"
                                    name="subject_cre_id"
                                />
                                <ErrorMessage className='error' name="subject_cre_id" component="p" />
                            </div>
                            <div className="full">
                                <hr />
                                <FieldArray name="subject_area_details"
                                    render={arrayHelpers =>
                                        <div className='d-grid gap-3'>
                                            {values.subject_area_details.length && values.subject_area_details.map((val, index) => {
                                                //// console.log(values.subject_area_details, "values.subject_area_details")
                                                return (
                                                    <div className="floorCarpetGrid align-items-end" key={index}>
                                                        <div className="">
                                                            <div className="formGridInner">
                                                                <label htmlFor={`subject_area_details.${index}.floor`}>Floor <span className="required">*</span></label>
                                                                <Field
                                                                    type="number"
                                                                    name={`subject_area_details.${index}.floor`}
                                                                />
                                                                {errors.subject_area_details && errors.subject_area_details[index] &&
                                                                    <p className='error'>{errors.subject_area_details[index].floor}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <div className="formGridInner">
                                                                <label htmlFor={`subject_area_details.${index}.carpet_area`}>Carpet Area <span className="required">*</span></label>
                                                                <Field
                                                                    type="number"
                                                                    name={`subject_area_details.${index}.carpet_area`}
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
                            <div className="formGridInner">
                                <label htmlFor="subject_gmap_location">Enter Google Location of Site Here<span className="required">*</span></label>
                                <Field
                                    type="text"
                                    name="subject_gmap_location"
                                />
                                <ErrorMessage className='error' name="subject_gmap_location" component="p" />
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_address">Address - Subject Site<span className="required">*</span></label>
                                <Field
                                    type="text"
                                    name="subject_address"
                                />
                                <ErrorMessage className='error' name="subject_address" component="p" />
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_lat">Latitude<span className="required">*</span></label>
                                <Field
                                    type="number"
                                    name="subject_lat"
                                />
                                <ErrorMessage className='error' name="subject_lat" component="p" />
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_long">Longitude<span className="required">*</span></label>
                                <Field
                                    type="number"
                                    name="subject_long"
                                />
                                <ErrorMessage className='error' name="subject_long" component="p" />
                            </div>


                            <div className="formGridInner">
                                <label htmlFor="subject_property_type">Property (Comm / Resi / Indus)*<span className="required">*</span></label>
                                <Field
                                    component="select"
                                    name="subject_property_type"
                                >
                                    <option value="">Select</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="residential">Residential</option>
                                    <option value="industrial">Industrial</option>
                                </Field>
                                <ErrorMessage className='error' name="subject_property_type" component="p" />
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_pincode">Pin Code - Subject Site<span className="required">*</span></label>
                                <Field
                                    type="number"
                                    maxLength={6}
                                    name="subject_pincode"
                                />
                                <ErrorMessage className='error' name="subject_pincode" component="p" />
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_efficiency">Efficiency <span className="required">*</span></label>
                                <Field
                                    type="text"
                                    name="subject_efficiency"
                                />
                                <ErrorMessage className='error' name="subject_efficiency" component="p" />
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
                                <ErrorMessage className='error' name="subject_lease_type" component="p" />
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
                                                            Crop
                                                        </button>
                                                    </>
                                                ) :
                                                    <div className="d-flex">
                                                        <div className="position-relative croppedImageWithIcon">
                                                            <span onClick={deleteMainImage}>
                                                                <Icon icon="material-symbols:close" />
                                                            </span>
                                                            <img src={croppedImage} name="CroppedImage" className='finalCroppedImage' alt="Cropped Image" />
                                                        </div>
                                                    </div>
                                                }

                                            </>
                                        ) :
                                            <div className="position-relative">
                                                <div className="position-relative customInputBox">
                                                    <Field
                                                        type="file"
                                                        name="subject_images[0].data"
                                                        accept="image/png, image/gif, image/jpeg"
                                                        onChange={onFileChange}
                                                    />
                                                    <Icon icon="ph:plus-bold" />
                                                </div>
                                                {errors.mainImage && <p className='error'>{errors.mainImage}</p>}
                                            </div>
                                        }
                                        {/* <p className='error'>{errors.subject_images && touched.subject_images && errors.subject_images[0]?.data && errors.subject_images[0]?.data}</p> */}
                                    </div>
                                    <div className="otherImagePart">
                                        <label htmlFor="subject_images">Other Images <em>(Maximum 5 images)</em></label>

                                        <div className="d-flex gap-4">
                                            {otherImages.map((val, index) => {
                                                return (
                                                    <div key={index} className="position-relative croppedImageWithIcon">
                                                        <span onClick={() => deleteOtherImages(index)}>
                                                            <Icon icon="material-symbols:close" />
                                                        </span>
                                                        <img src={URL.createObjectURL(val)} name="CroppedImage" className='finalCroppedImage' alt="Cropped Image" />
                                                    </div>
                                                )
                                            })}
                                            {otherImages.length < 5 && (
                                                <div className="position-relative">
                                                    <div className="position-relative customInputBox">
                                                        <Field
                                                            accept="image/png, image/gif, image/jpeg"
                                                            multiple
                                                            value={""}
                                                            type="file"
                                                            name="subject_images[0].data"
                                                            onChange={otherImagesHandleChange}
                                                        />
                                                        <Icon icon="ph:plus-bold" />
                                                    </div>
                                                    {!otherImages.length > 0 && (
                                                        errors.otherImages && <p className='error'>{errors.otherImages}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* <p className='error'>{errors.subject_images && touched.subject_images && errors.subject_images}</p> */}
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
                                                            <label htmlFor={`subject_nearby_assets[${index}]`}>Nearby Asset <span className="required">*</span></label>
                                                            <Field
                                                                type="text"
                                                                name={`subject_nearby_assets[${index}]`}
                                                            />

                                                            <ErrorMessage className='error' name={`subject_nearby_assets[${index}]`} component="p" />
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
                                <ErrorMessage className='error' name="subject_frontage" component="p" />
                            </div>
                            <div className="formGridInner">
                                <label htmlFor="subject_vintage">Vintage of Property (Yrs)<span className="required">*</span></label>
                                <Field
                                    type="number"
                                    name="subject_vintage"
                                />
                                <ErrorMessage className='error' name="subject_vintage" component="p" />
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

export default SubjectDetsils;
