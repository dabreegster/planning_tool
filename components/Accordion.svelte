<script>
  export let open = false;
  import { slide } from "svelte/transition";

  const handleClick = () => {
    open = !open;
  };
</script>

<div class="accordion">
  <button class="header" on:click={handleClick}>
    <div class="text">
      <slot name="head" />
    </div>
  </button>

  {#if open}
    <div class="details" transition:slide style="max-height: calc(30vh - 90px)">
      <slot name="details" />
    </div>
  {/if}
</div>

<style>
  div.accordion {
    margin: 1rem 0;
    max-height: calc(85vh - 90px);
  }

  /* button.header {
    display: flex;
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
  } */
  button.header {
    flex: 1; /* Distribute available space equally between headers */
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    color: black;
    cursor: pointer;
    padding: 8px;
    transition: background-color 0.3s ease-in-out;
    /* width: 80%; */
  }
  button.header:hover {
    background: #dfdfdf;
  }

  div.details {
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 1rem;
    margin-top: 10px;
  }
  .text {
    font-size: 14px;
  }
</style>
