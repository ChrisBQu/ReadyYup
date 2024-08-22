<script>
	export const prerender = true;


    import MapPanel from '$lib/MapPanel.svelte';
    import BusinessPanel from '$lib/BusinessPanel.svelte';
    import BusinessFilterButtons from '$lib/BusinessFilterButtons.svelte';
    import BusinessDetails from '$lib/BusinessDetails.svelte';
    import CreditsPanel from '$lib/CreditsPanel.svelte';
    import { fade } from 'svelte/transition';
    
    let sample_data = {'0': {'pro1': 'Excellent Italian-American food and desserts', 'pro2': 'Friendly and good-humored staff', 'con1': 'Significant decline in food and service quality', 'con2': 'Poorly managed and very unprofessional behavior', 'avg': 3.8, 'name': 'Gennaro & Son Italian Bistro', 'distance': '1.3 mi', 'photo': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=AelY_CuUA4uHUjRm957iQTxB4RQuq_dfDiWYhZ_bTuugcO9icDWN-sYx57dMAVbOP3Q2i8q7lXpqXJak-p4vnkg7cpArpAtVkDEnyqmREP8Fq0RkFy-cYIqveWELgup_IhH38YHRJnjPZGMWELaabbx0uJ1QY_EFZVzKMjhhGYNYwSh1hC3z&key=AIzaSyA881rlVC8nR8-R1D85a55ws2XDmADkSes', 'address': '12 Blanchard Rd, Quincy, MA 02169, USA'}, '1': {'pro1': 'Has excellent quality food', 'pro2': 'Beautiful rooftop deck', 'con1': 'Slow service', 'con2': 'Music too loud', 'avg': 3.8, 'name': 'Zef Cicchetti & Raw Bar and Alba', 'distance': '0.9 mi', 'photo': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=AelY_CvWQuxkdPTY_kY8tb-LuwvyqyOIfgv2a4g2g5WjQNJ-Bs_ArzSXpI8KtUMci5Fv1XCkMo9SZjpRNIbxy4ohApfluzFShsp_yszzYw3QNK60VZW20xctyvpwLGiWEo6oumWrqGmUlfz-DAHOdhF14PvXX45ARaW-p-6FXzzaNBxdrbBF&key=AIzaSyA881rlVC8nR8-R1D85a55ws2XDmADkSes', 'address': '1472 Hancock St, Quincy, MA 02169, USA'}, '2': {'pro1': 'Delicious and diverse food options', 'pro2': 'Great service and welcoming atmosphere', 'con1': 'NULL', 'con2': 'NULL', 'avg': 5.0, 'name': 'Sapori Cucina & Bar', 'distance': '0.7 mi', 'photo': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=AelY_CvvLvJ1xhnTufkVpZWx5IPdQjoI8ZXBdm1R0QBIcFTC9FkP7q42aog2AXHsrFTv5_ZjaPM_bRey4ONm6_QxE7clBZ3mvCmkpMvORuIRuw_yhrpCZqgOp0yQ_AeytNpEuKuTAIQr0ZTY8XxC90jBW0WihNBMJquMXV-X4bc36Kr0jD59&key=AIzaSyA881rlVC8nR8-R1D85a55ws2XDmADkSes', 'address': '17 Chestnut St, Quincy, MA 02169, USA'}, '3': {'pro1': 'Exceptional food and menu variety', 'pro2': 'Attentive and frequent service', 'con1': 'Experience and food overrated', 'con2': 'Some dishes too salty', 'avg': 4.2, 'name': 'Alba Restaurant', 'distance': '0.9 mi', 'photo': 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=AelY_Ctepw5FuyP47e2lHpPZMnnZJp2oDD1jV0-nudIZJftMz3o5caZsPwNUfaCBZw5I38OVROQEtgtdbayvT2YZntmFJCP66H9Bn0fg7wdS5Kjn__r9AzhPMhn4uv2BqM8ifmtK2og9XS4o9N6Sr68BmXflCXge-xfdRiYIuq34RvdYLbDX&key=AIzaSyA881rlVC8nR8-R1D85a55ws2XDmADkSes', 'address': '1486 Hancock St, Quincy, MA 02169, USA'}}
    
    let AppState = {
        state : "MAP",
        address: "Manhattan, New York, NY, USA",
        fetched_business_info : "",
        business_details : "",
        filter : "PIZZA"
    };

    function changeState(state) { AppState.state = state; }

    function handleAddressChange(address) {
        AppState.address = address;
    }

    function handleBusinessPanelClick(message) {
        changeState("DETAILS");
        AppState.business_details = message;
    }

    function handleFilterButtonClick(filter) {
        AppState.filter = filter;
    }

    async function goToBusinessPage() {
        changeState("LOADING");
        try {
            let fetched_info = await fetchBusinessInfo();
            //let fetched_info = sample_data;
            AppState.fetched_business_info = fetched_info;
            if (fetched_info == null) { changeState("MAP"); } 
            changeState("BUSINESS");
        } catch (error) {
            console.error('Error fetching business info:', error);
            changeState("MAP");
        }
    }

    async function fetchBusinessInfo() {
        let endpoint = "https://us-central1-chris-qu-website.cloudfunctions.net/ready-yup-fetch-restaurants";
        const params = new URLSearchParams({ filter: AppState.filter, address: AppState.address }).toString();
        
        try {
            const response = await fetch(`${endpoint}?${params}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }


</script>

<div class="container" style="position: relative;">

    {#if AppState.state === "MAP"}
    <div class="fadable-div" in:fade={{ duration: 300 }}>
        <img src="banner.png" class="banner-image">
        <MapPanel onChange={handleAddressChange} />
        <BusinessFilterButtons selectedButton={AppState.filter} onClick={handleFilterButtonClick} />
        <button class="button-big" on:click={goToBusinessPage}>Show me the restaurants</button>
        <div class="map-footer">
            This web app is a proof of concept demo by Chris Quigley<br><br>
            <div id="credit-link" on:click={() => {changeState("CREDITS"); }}>Click here to see image attributions</div>
        </div>
    </div>
    {/if}

    {#if AppState.state === "BUSINESS"}
        <div class="fadable-div" in:fade={{ duration: 300 }}>
            <BusinessPanel data={AppState.fetched_business_info} type={AppState.filter} onClick={handleBusinessPanelClick}/>
            <button class="button-big" on:click={() => {changeState("MAP"); }}>Take me back</button>
        </div>
    {/if}

    {#if AppState.state === "DETAILS"}
        <div class="fadable-div" in:fade={{ duration: 300 }}>
            <BusinessDetails data={AppState.business_details} />
            <button class="button-big" on:click={() => {changeState("BUSINESS");  }}>Take me back</button>
        </div>
    {/if}

    {#if AppState.state === "LOADING"}
        <div class="fadable-div" in:fade={{ duration: 300 }}>
            <img class="loading-image" src="loading.gif"/>
        </div>
    {/if}

    {#if AppState.state === "CREDITS"}
        <div class="fadable-div" in:fade={{ duration: 300 }}>
            <CreditsPanel />
            <button class="button-big" on:click={() => {changeState("MAP"); }}>Take me back</button>
        </div>
    {/if}

</div>




<style>

#credit-link {
    color: darkblue;
    cursor: pointer;
    transition: color 0.3s ease;
}

#credit-link:hover {
    color: lightblue;
}

.map-footer {
    position: fixed;
    left: 0;
    margin-top: 50px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px 0;
    text-align: center;
    font-family: Arial, sans-serif;
    font-size: 10px;
    color: darkblue;
}


.banner-image {
    width: 25%;
    margin-left: 10%;
    margin-bottom: 20px;
}

.loading-image {
    width: 100px;
    height: 100px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.fadable-div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    transition: opacity 0.3s ease-in-out;
}

.button-big {
        margin-top: 10px;
        width: 90%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: auto;
        margin-right: auto;
        font-size: 18px;
        font-weight: bold;
        background-color: #3366ff;
        color: white;
        border-radius: 12px;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
        display: block;
    }

    .button-big:hover {
        background-color: darkblue;
    }

</style>