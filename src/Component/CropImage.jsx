import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from './canvasUtils'

function CropImage() {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [imageSrc, setImageSrc] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [convertedImage, setConvertedImage] = useState([])


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
            console.log(file.name, "filr")
            let imageDataUrl = await readFile(file)
            setImageSrc(imageDataUrl)
        }
    }

    const showCroppedImage = async () => {
        console.log(croppedAreaPixels, "croppedAreaPixels")
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
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

    return (
        <>
            {imageSrc ?
                (
                    <div className='corpperMain'>
                        {!croppedImage ? (
                            <>
                                <Cropper
                                    image={imageSrc}
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
                                    variant="contained"
                                    color="primary"
                                >
                                    Show Result
                                </button>
                            </>
                        ) :
                            <form onSubmit={async (data) => {
                                data.preventDefault()
                                // console.log(data.target)
                                let file = await fetch(croppedImage).then(r => r.blob()).then(blobFile => new File([blobFile], "fileNameGoesHere", { type: "image/png" }))
                                console.log(file)
                            }
                            }>
                                <img src={croppedImage} name="CroppedImage" alt="Cropped Image" />
                                <button type='submit'>Submit</button>
                            </form>
                        }


                    </div >
                ) :
                <input type="file" onChange={onFileChange} accept="image/*" />
            }



        </>
    );
}

export default CropImage;
