<script>
    export let id;
    export let data;

    export let mobileSize;

    let business = data;

    export let onClick;
    function handleClick() {
        onClick(business);
    }

    console.log(mobileSize);

</script>

    <div class={mobileSize==1 ? 'business-box-wide' : 'business-box'} id={'bb' + id} on:click={handleClick}>
        <div class='business-box-title'>{business.name}</div>
        {#if business.pro1 !== "NULL" || business.pro2 !== "NULL"}<img src='plus.png' class='plus-icon'>{/if}
        {#if business.pro1 !== "NULL"}<div class='text-box pro-box'>{business.pro1}</div>{/if}
        {#if business.pro2 !== "NULL"}<div class='text-box pro-box'>{business.pro2}</div>{/if}
        <div style='height: 10px;'> </div>
        {#if business.con1 !== "NULL" || business.con2 !== "NULL"}<img src='minus.png' class='plus-icon'>{/if}
        {#if business.con1 !== "NULL"}<div class='text-box con-box'>{business.con1}</div>{/if}
        {#if business.con2 !== "NULL"}<div class='text-box con-box'>{business.con2}</div>{/if}
        <div style='height: 10px;'> </div>
        <img src='star.png' class='image-icon'>
        <div class='rating'>{business.avg.toFixed(1)}</div>
        <img src='distance.png' class='image-icon'>
        <div class='distance'>{business.distance}</div>
    </div>

<style>

    .text-box {
        display: block;
        width: 100%;
        margin-bottom: 10px;
    }

    .pro-box {
        font-family: Arial, sans-serif;
        font-size: 14px;
        background-color: lightgreen;
        border: 2px solid green;
        border-radius: 12px;
        padding: 5px;
        margin-bottom: -5px;
        padding-left: 10px;
        position: relative;
    }

    .con-box {
        font-family: Arial, sans-serif;
        font-size: 14px;
        background-color: lightpink;
        border: 2px solid red;
        border-radius: 12px;
        padding: 5px;
        margin-bottom: -5px;
        padding-left: 10px;
    }

    .plus-icon {
        width: 32px;
        height: 32px;
        position: relative;
        left: -16px;
        top: 16px;
        margin-top: -16px;
        z-index: 1;
    }

    .image-icon {
        width: 32px;
        height: 32px;
        position: relative;
        float: left;
        margin-top: 10px;
    }

    .rating {
        float: left;
        margin-left: 10px;
        margin-top: 12px;
        font-size: 28px;
        font-weight: bold;
        color: darkblue;
        font-family: Arial, sans-serif;
        border: 2px solid #3366ff;
        background-color:azure;
        border-radius: 12px;
        padding-left: 5px;
        padding-right: 5px;
        margin-right: 20px;
    }

    .distance {
        float: left;
        margin-left: 10px;
        margin-top: 28px;
        font-size: 14px;
        font-weight: bold;
        color: darkblue;
        font-family: Arial, sans-serif;
        margin-right: 10px;
    }

    .business-box-wide {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        width: 80%;
        margin-left: 20px;
        border: 2px solid #3366ff;
        background-color:azure;
        border-radius: 12px;
        padding: 30px;
        margin-bottom: 10px;
        float: left;
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .business-box-wide:hover {
        transform: scale(1.025);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
        cursor: pointer;
    }

    .business-box {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        width: 40%;
        margin-left: 20px;
        border: 2px solid #3366ff;
        background-color:azure;
        border-radius: 12px;
        padding: 30px;
        margin-bottom: 10px;
        float: left;
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .business-box:hover {
        transform: scale(1.025);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
        cursor: pointer;
    }

    .business-box-title {
        font-size: 18px;
        font-weight: bold;
        background-color: #99aaff;
        border: 2px solid #3366ff;
        color: darkblue;
        border-radius: 12px;
        padding: 10px 20px;
        font-family: Arial, sans-serif;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
    }

</style>