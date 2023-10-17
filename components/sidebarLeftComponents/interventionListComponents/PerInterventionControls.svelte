<script>
  import { gjScheme, clearCurrentlyEditing } from "../../../stores.js";

  export let id;

  function remove() {
    gjScheme.update((gj) => {
      gj.features = gj.features.filter((f) => f.id != id);
      return gj;
    });
  }
</script>

<div>
  <button
    class="red_button"
    style="float: right;"
    type="button"
    on:click={remove}>Delete</button
  >
  <button class="green_button" type="button" on:click={clearCurrentlyEditing}
    >Save</button
  >
</div>

<style>
  button {
    font-size: 0.8rem;
    border-radius: 8px;
    padding: 8px;
    transition: background-color 0.3s ease-in-out;
  }
  .green_button {
    background: #00703c;
    border: 1px solid #ccc;
    color: white;
  }
  .green_button:hover {
    background: #005a31;
  }
  .red_button {
    background: #d4361b;
    border: 1px solid #ccc;
    color: white;
  }
  .red_button:hover {
    background: #aa2a16;
  }
</style>
