<script>
  export let open = {
    headLeft: false,
    headRight: false
  };

  import { slide } from "svelte/transition";

  const handleClick = (header) => {
    open[header] = !open[header];
    if (header === "headRight") {
      open.headLeft = false; // Close headLeft when headRight is clicked
    }
    if (header === "headLeft") {
      open.headRight = false; // Close headRight when headLeft is clicked
    }
  };
</script>

<div class="accordion-container">
  <div class="accordion">
    <div class="header-container">
      <button class="header" on:click={() => handleClick("headLeft")}>
        <div class="text">
          <slot name="headLeft" />
        </div>
      </button>

      <button class="header" on:click={() => handleClick("headRight")}>
        <div class="text">
          <slot name="headRight" />
        </div>
      </button>
    </div>

    <div class="accordion-content" style="{open.headLeft || open.headRight ? 'max-height: 95vh; overflow: auto;' : ''}">
      {#if open.headLeft}
        <div class="details" transition:slide>
          <slot name="details" />
        </div>
      {/if}

      {#if open.headRight}
        <div class="details" transition:slide>
          <slot name="details2" />
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  /* .accordion-container {
    max-height: 90%;
    overflow: hidden;
  } */

  div.accordion {
    margin: 1rem 0;
  }

  div.header-container {
    display: flex;
    gap: 15px; 
  }

  button.header {
    flex: 1; /* Distribute available space equally between headers */
    background: #00703c;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    padding: 10px 15px;
    transition: background-color 0.3s ease-in-out;
  }

  button.header:hover {
    background: #005a31;
  }

  div.accordion-content {
    transition: max-height 0.3s ease-in-out, overflow 0.3s ease-in-out;
  }

  div.details {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 1rem;
    margin-top: 10px;
  }
</style>
