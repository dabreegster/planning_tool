<script>
  export let open = false;
  import { slide } from 'svelte/transition';

  const handleClick = () => {
    open = !open;
  };
</script>

<div class="accordion">
  <button class="header" on:click={handleClick}>
    <div class="text">
      <slot name="head"></slot>
    </div>
    

  </button>
  
  {#if open}
  <div class="details" transition:slide>
    <slot name="details"></slot>
  </div>
  {/if}
</div>

<style>
  div.accordion {
    margin: 1rem 0;
  }
  
  button.header {
    display: flex;
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  div.details {
    /* background-color: #cecece; */
    padding: 1rem;
  }
</style>
