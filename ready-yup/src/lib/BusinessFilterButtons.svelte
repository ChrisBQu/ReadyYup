<script>
    import { onMount } from 'svelte';

    export let selectedButton;

    export let onClick;
    function selectButton(buttonId) {
        selectedButton = buttonId;
        onClick(selectedButton);
    }

    function resizeIcons() {
        const pageWidth = window.innerWidth;
        const iconSize = Math.min(pageWidth * 0.05, 40); // Cap the size at 40px
        const icons = document.querySelectorAll('.image-icon');
        icons.forEach(icon => {
            icon.style.width = `${iconSize}px`;
            icon.style.height = `${iconSize}px`;
        });
    }

    onMount(() => {
        resizeIcons();
        window.addEventListener('resize', resizeIcons);
        return () => {
            window.removeEventListener('resize', resizeIcons);
        };
    });
</script>

<div class="filter-buttons">
    <button class="filter-button" class:selected={selectedButton === 'PIZZA'} on:click={() => selectButton('PIZZA')}><img src="pizza.png" class="image-icon" alt="Pizza"></button>
    <button class="filter-button" class:selected={selectedButton === 'BREAKFAST'} on:click={() => selectButton('BREAKFAST')}><img src="breakfast.png" class="image-icon" alt="Breakfast"></button>
    <button class="filter-button" class:selected={selectedButton === 'CHINESE'} on:click={() => selectButton('CHINESE')}><img src="chinese.png" class="image-icon" alt="Chinese"></button>
    <button class="filter-button" class:selected={selectedButton === 'TACO'} on:click={() => selectButton('TACO')}><img src="taco.png" class="image-icon" alt="Taco"></button>
    <button class="filter-button" class:selected={selectedButton === 'COFFEE'} on:click={() => selectButton('COFFEE')}><img src="coffee.png" class="image-icon" alt="Coffee"></button>
    <button class="filter-button" class:selected={selectedButton === 'FASTFOOD'} on:click={() => selectButton('FASTFOOD')}><img src="fastfood.png" class="image-icon" alt="Fast Food"></button>
    <button class="filter-button" class:selected={selectedButton === 'ITALIAN'} on:click={() => selectButton('ITALIAN')}><img src="italian.png" class="image-icon" alt="Italian"></button>
</div>

<style> 
.filter-button {
    background-color: azure;
    color: white;
    border-radius: 12px;
    border-color: darkblue;
    padding: 8px;
    margin: 4px;
    transition: background-color 0.1s ease;
}

.filter-button:hover {
    background-color: #3366ff;
    cursor: pointer;
}

.filter-button.selected {
    background-color: #1a3399;
}

.image-icon {
    width: 9vw;
    height: 9vw;
    max-width: 60px;
    max-height: 60px;
}

.filter-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 10px;
}

@media (max-width: 600px) {
    .filter-button {
        padding: 6px;
        margin: 2px;
    }
    
    .image-icon {
        width: 30px;
        height: 30px;
    }
}
</style>