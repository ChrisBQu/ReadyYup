<script>
    import { onMount } from 'svelte';

    export let address;

    let map;
    let marker;
    const GOOGLE_MAP_API_KEY = "AIzaSyA881rlVC8nR8-R1D85a55ws2XDmADkSes";

    // Function to load the Google Maps script dynamically
    function loadGoogleMaps(apiKey) {
        return new Promise((resolve, reject) => {
            if (window.google) {
                resolve(window.google.maps);
            } else {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
                script.async = true;
                script.defer = true;
                script.onload = () => resolve(window.google.maps);
                script.onerror = reject;
                document.head.appendChild(script);
            }
        });
    }

    // Function to initialize the map centered on the specified address
    function initMap() {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                map = new google.maps.Map(document.getElementById('map'), {
                    center: location,
                    zoom: 15,
                });
                marker = new google.maps.Marker({
                    position: location,
                    map: map,
                });
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }

    onMount(async () => {
        const maps = await loadGoogleMaps(GOOGLE_MAP_API_KEY);
        initMap();
    });
</script>

<div id="map"></div>

<style>
    #map {
        display: block;
        margin-left: 2%;
        margin-right: auto;
        height: 360px;
        width: 90%;
        margin-top: 20px;
        border: 2px solid #3366ff;
        border-radius: 12px;
    }
</style>
