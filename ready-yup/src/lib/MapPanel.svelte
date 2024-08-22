
<script>

    import { onMount } from 'svelte';

    export let onChange;
    function handleAddressChange(new_address) { 
        onChange(new_address);
    }
    
    function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                map.setCenter(pos);
                map.setZoom(17);

                if (marker) {
                    marker.setPosition(pos);
                } else {
                    marker = new google.maps.Marker({
                        position: pos,
                        map: map
                    });
                }

                // Reverse geocode to get the address
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: pos }, (results, status) => {
                    if (status === "OK") {
                        if (results[0]) {
                            document.getElementById('autocomplete').value = results[0].formatted_address;
                            handleAddressChange(results[0].formatted_address);
                        } else {
                            alert("No results found");
                        }
                    } else {
                        alert("Geocoder failed due to: " + status);
                    }
                });
            },
            () => {
                alert("Error: The Geolocation service failed.");
            }
        );
    } else {
        // Browser doesn't support Geolocation
        alert("Error: Your browser doesn't support geolocation.");
    }
}

    let marker;
    let map;
    const GOOGLE_MAP_API_KEY = "AIzaSyA881rlVC8nR8-R1D85a55ws2XDmADkSes";

    // Function to load the Google Maps script dynamically
    function loadGoogleMaps(apiKey) {
        return new Promise((resolve, reject) => {
            if (typeof google !== 'undefined') {
                resolve(google.maps);
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve(google.maps);
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function initAutocomplete() {
        const input = document.getElementById('autocomplete');
        let autocomplete = new google.maps.places.Autocomplete(input);
        
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            handleAddressChange(place.formatted_address);

            if (!place.geometry) {
                alert("No details available for the input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on the map.
            map.setCenter(place.geometry.location);
            map.setZoom(17);

            if (marker) {
                marker.setPosition(place.geometry.location);
            } else {
                marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map
                });
            }
        });
    }

    function handleMapClick(event) {
        const clickedLocation = event.latLng;
        
        if (marker) {
            marker.setPosition(clickedLocation);
        } else {
            marker = new google.maps.Marker({
                position: clickedLocation,
                map: map
            });
        }

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: clickedLocation }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    const newAddress = results[0].formatted_address;
                    document.getElementById('autocomplete').value = newAddress;
                    handleAddressChange(newAddress);
                } else {
                    alert("No results found");
                }
            } else {
                alert("Geocoder failed due to: " + status);
            }
        });
    }

    // Initialize the map when the component is mounted
    onMount(async () => {
        const googleMaps = await loadGoogleMaps(GOOGLE_MAP_API_KEY);
        
        const mapOptions = {
            center: { lat: 40.7831, lng: -73.9712 }, // Coordinates for Manhattan, New York
            zoom: 12
        };
        
        map = new googleMaps.Map(document.getElementById('map'), mapOptions);
        initAutocomplete();
        
        // Set the default address in the input field
        document.getElementById('autocomplete').value = "Manhattan, New York, NY, USA";

        // Add click event listener to the map
        map.addListener('click', handleMapClick);
    });

</script>

<div id="map_panel" class="panel">
    <div class="input-container">
        <button class="current-location-button" on:click={getCurrentLocation}>Use Current Location</button>
        <input id="autocomplete" type="text">
    </div>
    <div id="map"></div> 
</div>

<style>
    .panel {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 10px;
        box-sizing: border-box;
    }

    .input-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 10px;
    }

    button {
        font-size: 16px;
        font-weight: bold;
        background-color: #3366ff;
        color: white;
        border-radius: 12px;
        padding: 10px;
        border: none;
        cursor: pointer;
        width: 100%;
    }

    input#autocomplete {
        font-size: 14px;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        border: 2px solid #3366ff;
        border-radius: 12px;
    }

    button:hover {
        background-color: darkblue;
    }

    #map {
        height: 300px;
        width: 100%;
        border: 2px solid #3366ff;
        border-radius: 12px;
    }

    @media (min-width: 768px) {
        .input-container {
            flex-direction: row;
        }

        .current-location-button {
            width: 30%;
        }

        input#autocomplete {
            width: 70%;
        }

        #map {
            height: 360px;
        }
    }
</style>