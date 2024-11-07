import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import React, { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const LeafLetMap = () => {
    const [subjectLatLongData, setSubjectLatLongData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://3.7.95.255:81/api/rental_benchmarking/get_subject_latlong');
                const data = response.data.data;
                setSubjectLatLongData(data);
            } catch (e) {
                console.log("Error fetching data", e);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log(subjectLatLongData, "setSubjectLatLongData");
    }, [subjectLatLongData]);

    return (
        <div className='leafletMap'>
            <MapContainer style={{ height: "530px" }} center={[20.5937, 78.9629]} zoom={4} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {subjectLatLongData.length > 0 && subjectLatLongData.map((val) => {
                    console.log(val.subject_lat, val.subject_long, val.subject_address)
                    return (
                        <Marker position={[val.subject_lat, val.subject_long]} key={val.rental_benchmarking_id}>
                            <Popup>
                                {val.subject_address}
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </div>
    )
}

export default LeafLetMap