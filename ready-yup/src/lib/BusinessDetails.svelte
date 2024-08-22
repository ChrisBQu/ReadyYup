<script>
    
    import SimpleMap from '$lib/SimpleMap.svelte';

    export let data;

    let image_source = data['photo'];

    console.log(data);

</script>

<div class="business-details">
    <div class="top-text">{data['name']}</div>
    {#if image_source !== "NULL"}
        <img src={image_source} class="business-image"/>
    {:else}
        <img src="blank.png" class="business-image"/>
    {/if}
    <SimpleMap address={data['address']}/>
</div>


<style>

.business-details {
    margin-left: 5%;
}

.business-image {
    border: 2px solid darkblue;
    border-radius: 8px;
    max-width: 100%;
    max-height: 300px;
    height: auto;
    display: block;
    margin: 10px auto;
}

.top-text{
    font-family: Arial, sans-serif;
    font-size: 26px;
    font-weight: bold;
    font-style: italic;
    text-align: center;
    color: darkblue;
    margin-bottom: 10px;
}

</style>