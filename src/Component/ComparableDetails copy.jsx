import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './canvasUtils';
import axios from 'axios';

const ComparableDetails = () => {
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

  const [currentCrop, setCurrentCrop] = useState({ x: 0, y: 0 });
  const [currentZoom, setCurrentZoom] = useState(1);
  const [activeComparable, setActiveComparable] = useState(0);

  const initialValues = {
    comparable_details: [
      {
        cre_id: "",
        frontage: "",
        vintage: "",
        nearby_assets: ["0"],
        key_obervations: "",
        annexture: true,
        assets: [
          { type: "comparables", sub_type: "main", data: null },
          { type: "comparables", sub_type: "other", data: null },
          { type: "comparables", sub_type: "annexture", data: null },
        ]
      },
      {
        cre_id: "",
        frontage: "",
        vintage: "",
        nearby_assets: ["0"],
        key_obervations: "",
        annexture: true,
        assets: [
          { type: "comparables", sub_type: "main", data: null },
          { type: "comparables", sub_type: "other", data: null },
          { type: "comparables", sub_type: "annexture", data: null },
        ]
      },
      {
        cre_id: "",
        frontage: "",
        vintage: "",
        nearby_assets: ["0"],
        key_obervations: "",
        annexture: true,
        assets: [
          { type: "comparables", sub_type: "main", data: null },
          { type: "comparables", sub_type: "other", data: null },
          { type: "comparables", sub_type: "annexture", data: null },
        ]
      },
      {
        cre_id: "",
        frontage: "",
        vintage: "",
        nearby_assets: ["0"],
        key_obervations: "",
        annexture: true,
        assets: [
          { type: "comparables", sub_type: "main", data: null },
          { type: "comparables", sub_type: "other", data: null },
          { type: "comparables", sub_type: "annexture", data: null },
        ]
      }
    ]
  };

  const validate = values => {
    console.log(comparable_details,)
    const errors = { comparable_details: [] };

    values.comparable_details.slice(0, 2).forEach((comparable, index) => {
      const comparableErrors = {};

      if (!comparable.cre_id) comparableErrors.cre_id = 'Required';
      if (!comparable.frontage) comparableErrors.frontage = 'Required';
      if (!comparable.vintage) comparableErrors.vintage = 'Required';
      if (!comparable.nearby_assets?.[0]) comparableErrors.nearby_assets = 'At least one nearby asset required';


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
        newState[comparableIndex] = {
          ...newState[comparableIndex],
          otherImages: [...(prevState[comparableIndex].otherImages || []), ...newFiles]
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

  const handleAnnexureImages = (e, comparableIndex) => {
    if (e.target.files) {
      const newFiles = [];
      for (let i = 0; i < e.target.files.length && i < 5; i++) {
        newFiles.push(e.target.files[i]);
      }

      setComparablesState(prevState => {
        const newState = [...prevState];
        newState[comparableIndex] = {
          ...newState[comparableIndex],
          annexureImages: [...(prevState[comparableIndex].annexureImages || []), ...newFiles]
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

  const handleSubmit = async (values) => {
    const formData = new FormData();

    values.comparable_details.forEach((comparable, index) => {
      const state = comparablesState[index];
      if (comparable.cre_id || state.convertedImage) {
        const comparableData = {
          ...comparable,
          assets: [
            { type: "comparables", sub_type: "main", data: state.convertedImage },
            { type: "comparables", sub_type: "other", data: state.otherImages },
            { type: "comparables", sub_type: "annexture", data: state.annexureImages }
          ]
        };

        formData.append(`comparable_details[${index}]`, JSON.stringify(comparableData));

        if (state.convertedImage) {
          formData.append(`comparable_details[${index}].assets[0].data`, state.convertedImage);
        }

        state.otherImages.forEach((file, fileIndex) => {
          formData.append(`comparable_details[${index}].assets[1].data[${fileIndex}]`, file);
        });

        state.annexureImages.forEach((file, fileIndex) => {
          formData.append(`comparable_details[${index}].assets[2].data[${fileIndex}]`, file);
        });
      }
    });

    axios({
      method: 'POST',
      url: 'http://3.7.95.255:81/api/rental_benchmarking/save_report_data',
      data: formData
    })
      .then(function (res) {
        console.log("resresresresresresresresresres", res);
      })
      .catch(function (res) {
        console.log(res)
      })
    // .finally(function () {
    //   setSubmitting(false);
    // })

    console.log('Submitting form data:', formData);
    console.log('values:', values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form>
          <FieldArray name="comparable_details">
            {() => (
              <>
                {values.comparable_details.map((comparable, index) => (
                  <div className="comparePageGrid formGridParent withNoGrid" key={index}>
                    <h3 className="mb-2">
                      Comparable {index + 1} {index < 2 ? '(Mandatory)' : '(Optional)'}
                    </h3>
                    <div className="formGridParent p-0">
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
                        <label htmlFor={`comparable_details.${index}.frontage`}>
                          Frontage (Feet) {index < 2 && <span className="required">*</span>}
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

                      {/* <div className="full">
                        <FieldArray name="nearby_assets"
                          render={arrayHelpers =>
                            <div className='hello world'>
                              {values.nearby_assets.length > 0 && values.nearby_assets.map((val, index) => {
                                return (
                                  <div className="floorCarpetGrid floorCarpetGridForNearBy align-items-end" key={index}>
                                    <div className="formGridInner">
                                      <label htmlFor={`nearby_assets[${index}]`}>Neighbouring Assets <span className="required">*</span></label>
                                      <Field
                                        type="text"
                                        name={`nearby_assets[${index}]`}
                                      />

                                      <ErrorMessage className='error' name={`nearby_assets[${index}]`} component="p" />
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
                      </div> */}

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
                                      aspect={4 / 3}
                                      onCropChange={setCurrentCrop}
                                      onCropComplete={onCropComplete}
                                      onZoomChange={setCurrentZoom}
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
                                  <div className="position-relative croppedImageWithIcon">
                                    <span onClick={() => deleteMainImage(index)}>
                                      <Icon icon="mingcute:close-circle-fill" />
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
                              <div className="position-relative customInputBox">
                                <input
                                  type="file"
                                  onChange={(e) => onMainImageChange(e, index)}
                                  accept="image/*"
                                />
                                <Icon icon="ph:plus-bold" />
                              </div>
                            )}
                          </div>

                          <div className="otherImagePart">
                            <label>Other Images <em>(Maximum 5 images)</em></label>
                            <div className="d-flex gap-4">
                              {comparablesState[index].otherImages.map((image, imageIndex) => (
                                <div key={imageIndex} className="position-relative croppedImageWithIcon">
                                  <span onClick={() => deleteOtherImages(index, imageIndex)}>
                                    <Icon icon="mingcute:close-circle-fill" />
                                  </span>
                                  <img
                                    src={URL.createObjectURL(image)}
                                    className="finalCroppedImage"
                                    alt={`Other ${imageIndex + 1}`}
                                  />
                                </div>
                              ))}
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
                            </div>
                          </div>
                        </div>

                        <div className="otherImagePart">
                          <label>Add Annexure Page <em>(Maximum 5 images)</em></label>
                          <div className="d-flex gap-4">
                            {comparablesState[index].annexureImages.map((image, imageIndex) => (
                              <div key={imageIndex} className="position-relative croppedImageWithIcon">
                                <span onClick={() => deleteAnnexureImages(index, imageIndex)}>
                                  <Icon icon="mingcute:close-circle-fill" />
                                </span>
                                <img
                                  src={URL.createObjectURL(image)}
                                  className="finalCroppedImage"
                                  alt={`Annexure ${imageIndex + 1}`}
                                />
                              </div>
                            ))}
                            {comparablesState[index].annexureImages.length < 5 && (
                              <div className="position-relative customInputBox">
                                <input
                                  type="file"
                                  onChange={(e) => handleAnnexureImages(e, index)}
                                  accept="image/*"
                                  multiple
                                />
                                <Icon icon="ph:plus-bold" />
                              </div>
                            )}
                          </div>
                        </div>
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
                                        <img src="/img/icons/delete.svg" alt="delete" />
                                      </button>
                                    )}
                                    {assetIndex === comparable.nearby_assets.length - 1 && (
                                      <button type="button" onClick={() => arrayHelpers.push('')}>
                                        <img src="/img/icons/add.svg" alt="Add" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      <div className="formGridInner">
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
                    </div>
                  </div>
                ))}

                <div className="d-flex justify-content-between align-items-center bottomBar">
                  <Link to={"/"}>
                    <Icon icon="mingcute:left-line" /> Back
                  </Link>
                  <button type="submit">
                    Save and Next <Icon icon="mingcute:right-line" />
                  </button>
                </div>
              </>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
};

export default ComparableDetails;
