import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './canvasUtils';
import axios from 'axios';
import Loader from './Loader';

const ComparableDetails = () => {
  const [loader, setLoader] = useState(false)
  const [comparablesState, setComparablesState] = useState([
    {
      mainImageSrc: null,
      croppedImage: null,
      croppedAreaPixels: null,
      convertedImage: null,
      otherImages: [],
      annexureImages: [],
      annexureImageSrc: null,
      annexureIndex: null,
    },
    {
      mainImageSrc: null,
      croppedImage: null,
      croppedAreaPixels: null,
      convertedImage: null,
      otherImages: [],
      annexureImages: [],
      annexureImageSrc: null,
      annexureIndex: null,
    },
    {
      mainImageSrc: null,
      croppedImage: null,
      croppedAreaPixels: null,
      convertedImage: null,
      otherImages: [],
      annexureImages: [],
      annexureImageSrc: null,
      annexureIndex: null,
    },
    {
      mainImageSrc: null,
      croppedImage: null,
      croppedAreaPixels: null,
      convertedImage: null,
      otherImages: [],
      annexureImages: [],
      annexureImageSrc: null,
      annexureIndex: null,
    }
  ]);

  const initialValuesVar = {
    completed_steps: 2,
    comparable_details: [
      {
        cre_id: "",
        infra_proximity: '',
        frontage: "",
        vintage: "",
        nearby_assets: [""],
        key_obervations: "",
        annexture: true,
        proximity: "",
        assets: [
          { type: "comparables", sub_type: "main", data: null },
          { type: "comparables", sub_type: "other", data: null },
          { type: "comparables", sub_type: "annexture", data: null },
        ]
      },
      {
        cre_id: "",
        infra_proximity: '',
        frontage: "",
        vintage: "",
        nearby_assets: [""],
        key_obervations: "",
        annexture: true,
        proximity: "",
        assets: [
          { type: "comparables", sub_type: "main", data: null },
          { type: "comparables", sub_type: "other", data: null },
          { type: "comparables", sub_type: "annexture", data: null },
        ]
      },
      {
        cre_id: "",
        infra_proximity: '',
        frontage: "",
        vintage: "",
        nearby_assets: [""],
        key_obervations: "",
        annexture: true,
        proximity: "",
        assets: [
          { type: "comparables", sub_type: "main", data: null },
          { type: "comparables", sub_type: "other", data: null },
          { type: "comparables", sub_type: "annexture", data: null },
        ]
      },
      {
        cre_id: "",
        infra_proximity: '',
        frontage: "",
        vintage: "",
        nearby_assets: [""],
        key_obervations: "",
        annexture: true,
        proximity: "",
        assets: [
          { type: "comparables", sub_type: "main", data: null },
          { type: "comparables", sub_type: "other", data: null },
          { type: "comparables", sub_type: "annexture", data: null },
        ]
      }
    ]
  };

  const [currentCrop, setCurrentCrop] = useState({ x: 0, y: 0 });
  const [currentZoom, setCurrentZoom] = useState(1);
  const [activeComparable, setActiveComparable] = useState(0);

  const apiUrl = import.meta.env.VITE_API_KEY;

  const navigate = useNavigate();

  let { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoader(true)
        try {
          const response = await axios.get(`${apiUrl}/api/rental_benchmarking/get_report_data?id=${id}`);
          const data = response.data.data;
          let parsedComparableData = JSON.parse(data.comparable_details)
          const imagePath = data.assets.filter(asset => asset.type === "comparables");
          console.log(imagePath, "imagePath")
          for (let i = 0; i < parsedComparableData.length; i++) {
            parsedComparableData[i].nearby_assets = JSON.parse(parsedComparableData[i].nearby_assets);
            console.log("parsedComparableData[i]", parsedComparableData[i]);
            for (let j = 0; j < imagePath.length; j++) {
              if (imagePath[j].cre_id == parsedComparableData[i].cre_id) {
                if (imagePath[j].sub_type == "main") {
                  fetch(imagePath[j].image_path).then(response => response.blob()).then(file => {
                    const l = new File([file], "image.png", { type: "image/png" });
                    comparablesState[i].convertedImage = l;
                    setComparablesState([...comparablesState]);
                  });
                  comparablesState[i].croppedImage = imagePath[j].image_path;
                  comparablesState[i].mainImageSrc = true;
                }
                if (imagePath[j].sub_type == "other") {
                  fetch(imagePath[j].image_path).then(response => response.blob()).then(file => {
                    const l = new File([file], "image.png", { type: "image/png" });
                    comparablesState[i].otherImages.push(l);
                    setComparablesState([...comparablesState]);
                  });
                }
                if (imagePath[j].sub_type == "annexure") {
                  fetch(imagePath[j].image_path).then(response => response.blob()).then(file => {
                    const l = new File([file], "image.png", { type: "image/png" });
                    comparablesState[i].annexureImages.push(l);
                    setComparablesState([...comparablesState]);
                  });
                }
              }
            }
          }
          for (let i = 0; i < 4; i++) {
            if (!parsedComparableData[i]) {
              parsedComparableData[i] = {
                cre_id: "",
                infra_proximity: '',
                frontage: "",
                vintage: "",
                nearby_assets: [""],
                key_obervations: "",
                annexture: true,
                proximity: "",
                assets: [
                  { type: "comparables", sub_type: "main", data: null },
                  { type: "comparables", sub_type: "other", data: null },
                  { type: "comparables", sub_type: "annexture", data: null },
                ]
              }
            }
          }
          // console.log("initial data", { ...initialValues, comparable_details: parsedComparableData })
          setInitialValues({ ...initialValues, comparable_details: parsedComparableData })
          setComparablesState([...comparablesState]);

          // setInitialValues(prev => ({
          //   ...prev,
          //   ...initialValues, comparable_details: parsedComparableData,
          // }));



          // comparablesState.map((val, index) => {
          //   console.log(val, "val.mainImageSrc")
          // })

          // for (let i = 0; i < comparablesState.length; i++) {
          //   const existingMainImage = comparablesState[i];
          //   console.log(existingMainImage)
          // }
          // if (imagePath) {
          //   comparablesState[index].croppedImage(imagePath);
          //   // setMainImageSrc(imagePath);
          // }

        } catch (err) {
          console.log(err);
        } finally {
          setLoader(false)
        }
      }
      fetchData()
    }
  }, [id]);

  const [initialValues, setInitialValues] = useState(initialValuesVar);
  let seenIds = new Set();

  const validate = values => {
    const errors = { comparable_details: [] };
    seenIds = new Set();
    values.comparable_details.slice(0, 2).forEach((comparable, index) => {
      const comparableErrors = {};

      if (!comparable.cre_id) {
        comparableErrors.cre_id = 'Required';
      } else if (seenIds.has(comparable.cre_id)) {
        comparableErrors.cre_id = 'ID must be unique';
      } else {
        seenIds.add(comparable.cre_id); // Add the ID to the set if it's not a duplicate
      }

      if (!comparable.cre_id) comparableErrors.cre_id = 'Required';
      if (!comparable.proximity) comparableErrors.proximity = 'Required';
      // if (!comparable.frontage) comparableErrors.frontage = 'Required';
      if (!comparable.vintage) comparableErrors.vintage = 'Required';
      // if (!comparable.nearby_assets || comparable.nearby_assets.length === 0 || !comparable.nearby_assets[0]) {
      //   comparableErrors.nearby_assets = 'Required';
      // }
      if (!comparable.nearby_assets || comparable.nearby_assets.length === 0) {
        comparableErrors.nearby_assets = 'At least one nearby asset is required';
      } else {
        const assetErrors = [];
        let hasErrors = false;

        comparable.nearby_assets.forEach((asset, assetIndex) => {
          if (!asset || asset.trim() === '') {
            hasErrors = true;
            assetErrors[assetIndex] = 'Required';
          }
        });

        if (hasErrors) {
          comparableErrors.nearby_assets = assetErrors;
        }
      }
      if (!comparablesState[index].convertedImage) {
        comparableErrors.mainImage = 'Main image is required';
      }

      if (!comparablesState[index].otherImages ||
        comparablesState[index].otherImages.length === 0 ||
        !comparablesState[index].otherImages.some(img => img instanceof File || img instanceof Blob)) {
        comparableErrors.otherImages = 'At least one other image is required';
      }

      if (!comparablesState[index].annexureImages ||
        comparablesState[index].annexureImages.length === 0 ||
        !comparablesState[index].annexureImages.some(img => img instanceof File || img instanceof Blob)) {
        comparableErrors.annexureImages = 'At least one Annexure image is required';
      }


      // console.log(comparableErrors);
      if (Object.keys(comparableErrors).length > 0) {
        errors.comparable_details[index] = comparableErrors;
      }
    });

    return Object.keys(errors.comparable_details).length > 0 ? errors : {};
  };

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const onMainImageChange = async (e, comparableIndex) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);

      setComparablesState(prevState => {
        const newState = [...prevState];
        newState[comparableIndex] = {
          ...newState[comparableIndex],
          mainImageSrc: imageDataUrl,
          croppedImage: null
        };
        return newState;
      });

      setActiveComparable(comparableIndex);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setComparablesState(prevState => {
      const newState = [...prevState];
      newState[activeComparable] = {
        ...newState[activeComparable],
        croppedAreaPixels
      };
      return newState;
    });
  };

  const showCroppedImage = async () => {
    try {
      const state = comparablesState[activeComparable];
      const croppedImage = await getCroppedImg(
        state.mainImageSrc,
        state.croppedAreaPixels
      );

      const file = await fetch(croppedImage)
        .then(r => r.blob())
        .then(blobFile => new File([blobFile], "cropped_image.png", { type: "image/png" }));

      setComparablesState(prevState => {
        const newState = [...prevState];
        newState[activeComparable] = {
          ...newState[activeComparable],
          croppedImage,
          convertedImage: file
        };
        return newState;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleOtherImages = (e, comparableIndex) => {
    if (e.target.files) {
      const newFiles = [];
      for (let i = 0; i < e.target.files.length && i < 5; i++) {
        newFiles.push(e.target.files[i]);
      }

      setComparablesState(prevState => {
        const newState = [...prevState];
        const updatedOtherImages = [
          ...(newState[comparableIndex].otherImages || []),
          ...newFiles
        ];

        // Ensure no more than 5 images are kept
        newState[comparableIndex] = {
          ...newState[comparableIndex],
          otherImages: updatedOtherImages.slice(0, 5) // Keep only the first 5 images
        };

        return newState;
      });
    }
  };

  const deleteOtherImages = (comparableIndex, imageIndex) => {
    setComparablesState(prevState => {
      const newState = [...prevState];
      newState[comparableIndex].otherImages = newState[comparableIndex].otherImages.filter(
        (_, i) => i !== imageIndex
      );
      return newState;
    });
  };

  // const handleAnnexureImages = (e, comparableIndex) => {
  //   if (e.target.files) {
  //     const newFiles = [];
  //     for (let i = 0; i < e.target.files.length && i < 5; i++) {
  //       newFiles.push(e.target.files[i]);
  //     }

  //     setComparablesState(prevState => {
  //       const newState = [...prevState];
  //       newState[comparableIndex] = {
  //         ...newState[comparableIndex],
  //         annexureImages: [...(prevState[comparableIndex].annexureImages || []), ...newFiles]
  //       };
  //       return newState;
  //     });
  //   }
  // };

  const deleteMainImage = (comparableIndex) => {
    setComparablesState(prevState => {
      const newState = [...prevState];
      newState[comparableIndex] = {
        ...newState[comparableIndex],
        mainImageSrc: null,
        croppedImage: null,
        convertedImage: null
      };
      return newState;
    });
  };

  const annexureImagesHandleChange = (e, comparableIndex) => {
    if (e.target.files) {
      // Collect the new files, limit to 5
      const newFiles = Array.from(e.target.files).slice(0, 5);

      setComparablesState(prevState => {
        const newState = [...prevState];
        const updatedAnnexureImages = [
          ...(newState[comparableIndex].annexureImages || []),
          ...newFiles
        ];

        // Ensure no more than 5 annexure images are stored
        newState[comparableIndex] = {
          ...newState[comparableIndex],
          annexureImages: updatedAnnexureImages.slice(0, 5) // Limit to first 5 images
        };

        return newState;
      });
    }
  };


  const deleteAnnexureImages = (comparableIndex, imageIndex) => {
    setComparablesState(prevState => {
      const newState = [...prevState];
      newState[comparableIndex].annexureImages = newState[comparableIndex].annexureImages.filter(
        (_, i) => i !== imageIndex
      );
      return newState;
    });
  };

  const cropAnnexurePage = (imageSrc, imageIndex, comparableIndex) => {
    setComparablesState(prevState => {
      const newState = [...prevState];
      newState[comparableIndex] = {
        ...newState[comparableIndex],
        annexureImageSrc: imageSrc,
        annexureIndex: imageIndex,
        crop: { x: 0, y: 0 },  // Reset crop position
        zoom: 1,  // Reset zoom
      };
      return newState;
    });
    setActiveComparable(comparableIndex);
  };

  const onAnnexureCropComplete = (croppedArea, croppedAreaPixels) => {
    setComparablesState(prevState => {
      const newState = [...prevState];
      newState[activeComparable] = {
        ...newState[activeComparable],
        croppedAreaPixels
      };
      return newState;
    });
  };

  const showAnnexureCroppedImage = async () => {
    try {
      const state = comparablesState[activeComparable];
      const croppedImage = await getCroppedImg(
        state.annexureImageSrc,
        state.croppedAreaPixels
      );

      const file = await fetch(croppedImage)
        .then(r => r.blob())
        .then(blobFile => new File([blobFile], "cropped_annexure.png", { type: "image/png" }));

      setComparablesState(prevState => {
        const newState = [...prevState];
        const annexureImages = [...newState[activeComparable].annexureImages];
        annexureImages[newState[activeComparable].annexureIndex] = file;
        newState[activeComparable] = {
          ...newState[activeComparable],
          annexureImages,
          annexureImageSrc: null,
          annexureIndex: null,
        };
        return newState;
      });
    } catch (e) {
      console.error(e);
    }
  };


  const handleSubmit = async (values) => {
    console.log("HEllo")
    setLoader(true)
    const formData = new FormData();

    if (id) {
      formData.append('id', id);
    }
    formData.append('completed_step', 2);

    // Create comparable details array
    const comparableDetailsArray = values.comparable_details.map((comparable, index) => {
      const state = comparablesState[index];

      if (comparable.cre_id || state.convertedImage) {
        return {
          cre_id: comparable.cre_id,
          infra_proximity: comparable.infra_proximity,
          frontage: comparable.frontage,
          vintage: comparable.vintage,
          key_obervations: comparable.key_obervations,
          nearby_assets: JSON.stringify(comparable.nearby_assets),
          annexture: true,
          proximity: comparable.proximity,
        };
      }
      return null;
    }).filter(Boolean);

    // Append the stringified comparable details
    formData.append('comparable_details', JSON.stringify(comparableDetailsArray));

    // Append images separately with correct indices
    values.comparable_details.forEach((comparable, index) => {
      const state = comparablesState[index];

      if (comparable.cre_id || state.convertedImage) {
        if (state.convertedImage) {
          formData.append(`comparable_details[${index}][main]`, state.convertedImage);
        }

        // Other images
        state.otherImages.forEach((image, otherIndex) => {
          formData.append(`comparable_details[${index}][other][${otherIndex}]`, image);
        });

        // Annexure images
        state.annexureImages.forEach((image, annexureIndex) => {
          formData.append(`comparable_details[${index}][annexure][${annexureIndex}]`, image);
        });
      }
    });

    try {
      const response = await axios({
        method: 'POST',
        url: `${apiUrl}/api/rental_benchmarking/save_report_data`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Form submitted successfully:', response);
      navigate(`/site-lease-terms/${id}`);

    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error appropriately (show user feedback, etc.)
    } finally {
      setLoader(false)
    }
  };

  return (
    <>
      <Loader loader={loader} />
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ values, errors, setFieldValue, setFieldError }) => (
          <Form>
            <FieldArray name="comparable_details">
              {() => (
                <>
                  {values.comparable_details.map((comparable, index) => (
                    <div className="comparePageGrid formGridParent withNoGrid" key={index}>
                      <h3 className="mb-2">
                        Comparable {index + 1} {index < 2 ? '(Mandatory)' : '(Optional)'}
                      </h3>
                      <div className="formGridParent comparableGridMain p-0">
                        <div className="comparableGridLeft">
                          <div className="formGridInner">
                            <label htmlFor={`comparable_details.${index}.cre_id`}>
                              CRE ID {index < 2 && <span className="required">*</span>}
                            </label>
                            <Field
                              type="text"
                              name={`comparable_details.${index}.cre_id`}
                            />
                            <ErrorMessage
                              name={`comparable_details.${index}.cre_id`}
                              component="div"
                              className="error"
                            />
                          </div>
                          <div className="formGridInner">
                            <label htmlFor={`comparable_details.${index}.infra_proximity`}>
                              Infra Proximity
                            </label>
                            <Field
                              type="text"
                              name={`comparable_details.${index}.infra_proximity`}
                            />
                          </div>

                          <div className="formGridInner">
                            <label htmlFor={`comparable_details.${index}.frontage`}>
                              Frontage (Feet)
                            </label>
                            <Field
                              type="number"
                              name={`comparable_details.${index}.frontage`}
                            />
                            <ErrorMessage
                              name={`comparable_details.${index}.frontage`}
                              component="div"
                              className="error"
                            />
                          </div>

                          <div className="formGridInner">
                            <label htmlFor={`comparable_details.${index}.vintage`}>
                              Vintage (Years) {index < 2 && <span className="required">*</span>}
                            </label>
                            <Field
                              type="number"
                              name={`comparable_details.${index}.vintage`}
                            />
                            <ErrorMessage
                              name={`comparable_details.${index}.vintage`}
                              component="div"
                              className="error"
                            />
                          </div>

                          <div className="full">
                            <FieldArray name={`comparable_details.${index}.nearby_assets`}>
                              {arrayHelpers => (
                                <div className="d-grid gap-3">
                                  {comparable.nearby_assets.map((asset, assetIndex) => (
                                    <div className="floorCarpetGrid align-items-end" key={assetIndex}>
                                      <div className="formGridInner">
                                        <label htmlFor={`comparable_details.${index}.nearby_assets.${assetIndex}`}>
                                          Nearby Asset {index < 2 && assetIndex === 0 && <span className="required">*</span>}
                                        </label>
                                        <Field
                                          name={`comparable_details.${index}.nearby_assets.${assetIndex}`}
                                        />
                                        <ErrorMessage
                                          name={`comparable_details.${index}.nearby_assets.${assetIndex}`}
                                          component="div"
                                          className="error"
                                        />
                                      </div>
                                      <div className="icon_group">
                                        {assetIndex > 0 && (
                                          <button type="button" onClick={() => arrayHelpers.remove(assetIndex)}>
                                            <img src="/rental-benchmarking/img/icons/delete.svg" alt="delete" />
                                          </button>
                                        )}
                                        {assetIndex === comparable.nearby_assets.length - 1 && (
                                          <button type="button" onClick={() => arrayHelpers.push('')}>
                                            <img src="/rental-benchmarking/img/icons/add.svg" alt="Add" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </FieldArray>
                          </div>

                          <div className="formGridInner full">
                            <label htmlFor={`comparable_details.${index}.key_obervations`}>
                              Key Observations
                            </label>
                            <Field
                              type="text"
                              name={`comparable_details.${index}.key_obervations`}
                            />
                            <ErrorMessage
                              name={`comparable_details.${index}.key_obervations`}
                              component="div"
                              className="error"
                            />
                          </div>

                          <div className="formGridInner">
                            <label htmlFor={`comparable_details.${index}.proximity`}>
                              Proximity to Subject Property (in Meters)
                            </label>
                            <Field
                              type="number"
                              name={`comparable_details.${index}.proximity`}
                            />
                            <ErrorMessage
                              name={`comparable_details.${index}.proximity`}
                              component="div"
                              className="error"
                            />
                          </div>
                        </div>
                        <div className="comparableGridRight">
                          <div className="formGridInner position-unset corpperMain full">
                            <div className="d-flex gap-4 mb-4">
                              <div className="mainImagePart">
                                <label>Main Image {index < 2 && <span className="required">*</span>}</label>
                                {comparablesState[index].mainImageSrc ? (
                                  <>
                                    {!comparablesState[index].croppedImage ? (
                                      <>
                                        <Cropper
                                          image={comparablesState[index].mainImageSrc}
                                          crop={currentCrop}
                                          zoom={currentZoom}
                                          aspect={5 / 2}
                                          // setCropSize={100}
                                          // cropSize={width: "1153px", height: "512px" }
                                          onCropChange={setCurrentCrop}
                                          onCropComplete={onCropComplete}
                                          onZoomChange={setCurrentZoom}
                                        // style={{ height: "512px" }}
                                        />
                                        <button
                                          onClick={showCroppedImage}
                                          type="button"
                                          className="button showCroppedImage"
                                        >
                                          Show Result
                                        </button>
                                      </>
                                    ) : (
                                      <div className="position-relative croppedImageWithIcon mt-3">
                                        <span onClick={() => deleteMainImage(index)}>
                                          <Icon icon="material-symbols:close" />
                                        </span>
                                        <img
                                          src={comparablesState[index].croppedImage}
                                          alt="Cropped"
                                          className="finalCroppedImage"
                                        />
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="position-relative">
                                    <div className="position-relative customInputBox">
                                      <input
                                        type="file"
                                        onChange={(e) => onMainImageChange(e, index)}
                                        accept="image/*"
                                      />
                                      <Icon icon="ph:plus-bold" />
                                    </div>
                                    {errors?.comparable_details?.[index]?.mainImage && (
                                      <div className="error">{errors.comparable_details[index].mainImage}</div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="otherImagePart">
                                <label>Other Images <em>(Maximum 5 images)</em></label>
                                <div className="d-flex flex-wrap gap-3 mt-3">
                                  {comparablesState[index].otherImages.map((image, imageIndex) => (
                                    <div key={imageIndex} className="position-relative croppedImageWithIcon">
                                      <span onClick={() => deleteOtherImages(index, imageIndex)}>
                                        <Icon icon="material-symbols:close" />
                                      </span>
                                      <img
                                        src={URL.createObjectURL(image)}
                                        className="finalCroppedImage"
                                        alt={`Other ${imageIndex + 1}`}
                                      />
                                    </div>
                                  ))}

                                  <div className="position-relative">
                                    {comparablesState[index].otherImages.length < 5 && (
                                      <div className="position-relative customInputBox">
                                        <input
                                          type="file"
                                          onChange={(e) => handleOtherImages(e, index)}
                                          accept="image/*"
                                          multiple
                                        />
                                        <Icon icon="ph:plus-bold" />
                                      </div>
                                    )}
                                    {!comparablesState[index].otherImages.length > 0 &&
                                      errors?.comparable_details?.[index]?.otherImages && (
                                        <div className="error">{errors.comparable_details[index].otherImages}</div>
                                      )}
                                  </div>

                                </div>
                              </div>
                            </div>

                            <div className="otherImagePart mt-5">
                              <label htmlFor={`comparable_details[${index}].subject_images`}>
                                Add Annexure Page <em>(Maximum 5 images)</em>
                              </label>

                              <div className="d-flex flex-wrap gap-4 mt-3">
                                {comparablesState[index].annexureImages.map((val, imgIndex) => (
                                  <div key={imgIndex} className="position-relative croppedImageWithIcon">
                                    <span onClick={() => deleteAnnexureImages(index, imgIndex)}>
                                      <Icon icon="material-symbols:close" />
                                    </span>
                                    <img
                                      src={URL.createObjectURL(val)}
                                      name="CroppedImage"
                                      className='finalCroppedImage'
                                      alt="Cropped Image"
                                    />
                                    <button type='button' onClick={() => cropAnnexurePage(URL.createObjectURL(val), imgIndex, index)}>
                                      Crop Image
                                    </button>
                                  </div>
                                ))}
                                <div className="position-relative">
                                  {comparablesState[index].annexureImages.length < 5 && (
                                    <div className="position-relative customInputBox">
                                      <input
                                        type="file"
                                        accept="image/png, image/gif, image/jpeg"
                                        multiple
                                        onChange={(e) => annexureImagesHandleChange(e, index)}
                                      />
                                      <Icon icon="ph:plus-bold" />
                                    </div>
                                  )}
                                  {!comparablesState[index].annexureImages.length > 0 &&
                                    errors?.comparable_details?.[index]?.annexureImages && (
                                      <div className="error">{errors.comparable_details[index].annexureImages}</div>
                                    )}
                                </div>
                              </div>

                              <ErrorMessage
                                name={`comparable_details[${index}].subject_images`}
                                component="p"
                                className="error"
                              />
                            </div>

                            {comparablesState[index].annexureImageSrc && (
                              <div>
                                <Cropper
                                  image={comparablesState[index].annexureImageSrc}
                                  crop={comparablesState[index].crop}
                                  zoom={comparablesState[index].zoom}
                                  aspect={4 / 10}
                                  // objectFit='cover'
                                  onCropChange={(crop) => {
                                    setComparablesState(prevState => {
                                      const newState = [...prevState];
                                      newState[index] = { ...newState[index], crop };
                                      return newState;
                                    });
                                  }}
                                  onCropComplete={onAnnexureCropComplete}
                                  onZoomChange={(zoom) => {
                                    setComparablesState(prevState => {
                                      const newState = [...prevState];
                                      newState[index] = { ...newState[index], zoom };
                                      return newState;
                                    });
                                  }}
                                  cropSize={{ height: 500, width: 1153 }}
                                />
                                <button
                                  onClick={showAnnexureCroppedImage}
                                  type='button'
                                  className='button showCroppedImage'
                                >
                                  Show Result
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}

                  <div className="d-flex justify-content-between align-items-center bottomBar">
                    <Link to={`/subject-property/${id}`}>
                      <Icon icon="mingcute:left-line" /> Back
                    </Link>
                    <button type="submit">
                      Save and Next <Icon icon="mingcute:right-line" />
                    </button>
                  </div>
                </>
              )}
            </FieldArray>
          </Form >
        )}
      </Formik >
    </>
  );
};

export default ComparableDetails;
