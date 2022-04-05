import React, {useState} from "react";
import "./google-places-auto-complete.styles.scss"
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const GooglePlacesAutoComplete = ({
                                      address,
                                      setAddress,
                                    setClicked,
    clicked,
}) => {

    const [coordinates, setCoordinates ] = useState({
        lat: 33.4484,
        lng: -112.0740
    });
    const [customZoom, setCustomZoom] = useState(9)


    const containerStyle = {
        width: '290px',
        height: '250px',
    };

    const center = {
        lat: coordinates.lat,
        lng: coordinates.lng
    };



    const handleSelect = async (value ) => {

        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setAddress(value);
        setCoordinates(latLng)
        setCustomZoom(17)
    };
    function handleClick(){
        setClicked("Select Date");
        console.log(clicked)
    }
    console.log(clicked)

    return (
        <div className="google-places-autocomplete-container-div">

            <div className="address-title-text">
                Please enter the event address.
            </div>

            <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}>

                {({getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div >


                        <input className="type-address-input"
                            {...getInputProps({placeholder: "Type address"})}/>

                        <div>
                            {/*{loading ? <div>...loading</div>: null}*/}


                            {suggestions.map(suggestion => {

                                const style = {
                                    backgroundColor: suggestion.active ? "#490411" : "#fff",
                                    color: suggestion.active ? "#fff" : "black",
                                    cursor: "pointer"
                                }

                                return <div {...getSuggestionItemProps(suggestion, {style})}>
                                    {suggestion.description}
                                </div>;
                            })}
                        </div>
                    </div>
                    )}


            </PlacesAutocomplete>

            <div className="google-map-container-div">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={customZoom}
                    defaultOptions={{
                        mapTypeId: "satellite",

                    }}




                >
                    <Marker position={{ lat: coordinates.lat, lng: coordinates.lng}}/>
                </GoogleMap>
            </div>
            <div>

                {address !== "" ? (
                        <div>
                            <div className="address-display-google">
                                {address}
                            </div>

                        </div>

                ):(<div></div>)}

            </div>


        </div>
    )
}

export default GooglePlacesAutoComplete;