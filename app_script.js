let autocomplete;
let map;
let marker;

let sample_data = {'0': {'pro1': 'Great for event hosting', 'pro2': 'Cosy ambiance and reasonable prices', 'con1': 'Issues with food quality', 'con2': 'Poor handling of complaints', 'avg': 3.8, 'name': 'Fox and Hound Tavern', 'distance': '0.6 mi'}, '1': {'pro1': 'Consistently cooked perfect food', 'pro2': 'Excellent drinks and service', 'con1': 'Duck Confit recommended but just alright', 'con2': 'Mixed reviews on desserts', 'avg': 5.0, 'name': 'Idle Hour', 'distance': '0.9 mi'}, '2': {'pro1': 'Delicious and diverse menu offerings', 'pro2': 'Friendly staff and great atmosphere', 'con1': 'Drinks lack sufficient alcohol', 'con2': 'Some tacos and tortillas taste stale', 'avg': 4.6, 'name': 'Pearl & Lime', 'distance': '0.9 mi'}, '3': {'pro1': 'Friendly and attentive staff', 'pro2': 'Creative and fresh seafood', 'con1': 'Some seafood dishes lacked flavor', 'con2': 'Expensive pricing', 'avg': 4.2, 'name': 'Bay Pointe Waterfront Restaurant', 'distance': '1.4 mi'}, '4': {'pro1': 'Cozy ambience and welcoming staff', 'pro2': 'Delicious and diverse menu', 'con1': 'Inconsistent pizza quality', 'con2': 'Limited specialty drink selection', 'avg': 4.4, 'name': '16C', 'distance': '0.7 mi'}}

function goToBusinessPage() {
    let mp = document.getElementById("map_panel");
    let bp = document.getElementById("business_panel");
    bp.style.display = "block";
    mp.style.display = "none";
    document.getElementById("business-row-1").innerHTML = generateBusinessBox(0) + generateBusinessBox(1);
    document.getElementById("business-row-2").innerHTML = generateBusinessBox(2) + generateBusinessBox(3);
    fadeInPanel(bp);
    fadeOutPanel(mp);
}

function goToMapPage() {
    let mp = document.getElementById("map_panel");
    let bp = document.getElementById("business_panel");
    mp.style.display = "block";
    bp.style.display = "none"; 
    fadeInPanel(mp);
    fadeOutPanel(bp);
}

function fadeInPanel(panel) {
    panel.style.opacity = 0;
    panel.style.display = "block";
    let opacity = 0;
    let fadeIn = setInterval(() => {
        if (opacity < 1) {
            opacity += 0.1;
            panel.style.opacity = opacity;
        } else {
            clearInterval(fadeIn);
        }
    }, 30);
}

function fadeOutPanel(panel) {
    let opacity = 1;
    let fadeOut = setInterval(() => {
        if (opacity > 0) {
            opacity -= 0.1;
            panel.style.opacity = opacity;
        } else {
            clearInterval(fadeOut);
            panel.style.display = "none";
        }
    }, 30);
}

function generateBusinessBox(id) {
    return `
        <div class='business-box' id='bb${id}'>
            <div class='business-box-title'>${sample_data[id].name}</div>
            <img src='plus.png' class='plus-icon'>
            <div class='second-panel-input pro-box'>${sample_data[id].pro1}</div>
            <div class='second-panel-input pro-box'>${sample_data[id].pro2}</div>
            <div style='height: 10px;'> </div>
            <img src='minus.png' class='plus-icon'>
            <div class='second-panel-input con-box'>${sample_data[id].con1}</div>
            <div class='second-panel-input con-box'>${sample_data[id].con2}</div>
            <div style='height: 10px;'> </div>
            <img src='star.png' class='image-icon'>
            <div class='rating'>${sample_data[id].avg.toFixed(1)}</div>
            <img src='distance.png' class='image-icon'>
            <div class='distance'>${sample_data[id].distance}</div>
        </div>
    `;
}

function initAutocomplete() {
    const input = document.getElementById('autocomplete');
    autocomplete = new google.maps.places.Autocomplete(input);
    
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

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

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6,
    });
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

// Initialize the autocomplete and map on window load
window.onload = initAutocomplete;
