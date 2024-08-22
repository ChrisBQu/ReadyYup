<script>
    import BusinessBox from '$lib/BusinessBox.svelte';
    import { onMount } from 'svelte';

    export let data;
    export let type;
    export let onClick;

    let isMobile = false;

    function handleMessage(message) {
        onClick(message);
    }

    function convertRestaurantType(type) {
        if (type === 'PIZZA') { return "pizza place"; }
        if (type === 'BREAKFAST') { return "breakfast spot"; }
        if (type === 'CHINESE') { return "Chinese restaurant"; }
        if (type === 'TACO') { return "Mexican restaurant"; }
        if (type === 'COFFEE') { return "cafe"; }
        if (type === 'FASTFOOD') { return "fast food joint"; }
        if (type === 'ITALIAN') { return "Italian restaurant"; }
    }

    onMount(() => {
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    });

</script>

{#if data !== null}
<div class="business-panel">
    <div class="top-text">Here are some {convertRestaurantType(type)}s in the area!</div>
    <div class="business-grid">
        {#if !isMobile}
        <div class="business-row">
            {#if "0" in data}<BusinessBox mobileSize={0} data={data[0]} id={0} onClick={handleMessage}/>{/if}
            {#if "1" in data}<BusinessBox mobileSize={0} data={data[1]} id={1} onClick={handleMessage}/>{/if}
        </div>
        <div class="business-row">
            {#if "2" in data}<BusinessBox mobileSize={0} data={data[2]} id={2} onClick={handleMessage}/>{/if}
            {#if "3" in data}<BusinessBox mobileSize={0} data={data[3]} id={3} onClick={handleMessage}/>{/if}
        </div>
        {:else}
        <div class="business-row">{#if "0" in data}<BusinessBox mobileSize={1} data={data[0]} id={0} onClick={handleMessage}/>{/if}</div>
        <div class="business-row">{#if "1" in data}<BusinessBox mobileSize={1} data={data[1]} id={1} onClick={handleMessage}/>{/if}</div>
        <div class="business-row">{#if "2" in data}<BusinessBox mobileSize={1} data={data[2]} id={2} onClick={handleMessage}/>{/if}</div>
        <div class="business-row">{#if "3" in data}<BusinessBox mobileSize={1} data={data[3]} id={3} onClick={handleMessage}/>{/if}</div>
        {/if}
    </div>
</div>
{:else}
<div class="no-results">
    <img src="sad.png" class="sad-icon" alt="Sad face">
    <div class="no-results-text">No results found</div>
</div>
{/if}

<div class="lower_spacer"></div>

<style> 

.no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    border-radius: 10px;
    margin: 20px auto;
    max-width: 90%;
}

.sad-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 15px;
}

.no-results-text {
    font-family: Arial, sans-serif;
    font-size: 20px;
    color: #333;
    text-align: center;
}


.top-text{
    font-family: Arial, sans-serif;
    font-size: 22px;
    font-weight: bold;
    font-style: italic;
    text-align: center;
    color: darkblue;
    margin-bottom: 15px;
}

.lower_spacer {
    height: 0px;
    clear: both;
}

.business-panel {
    height: fit-content;
    padding-bottom: 20px;
    margin-left: 5%;
    margin-right: 5%;
}

.business-grid {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.business-row {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

@media (min-width: 768px) {
    .business-panel {
        margin-left: 15%;
        margin-right: 15%;
    }

    .business-row {
        flex-direction: row;
        justify-content: space-between;
    }

    .top-text {
        font-size: 26px;
    }

    .no-results {
        height: 300px;
    }

    .sad-icon {
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
    }

    .no-results-text {
        font-size: 24px;
    }
}

</style>