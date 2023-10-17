<script>
  import { TextInput } from "carbon-components-svelte";

  export let props;
</script>

<p style="font-size: 1rem">Route length: {Math.ceil(props.lengthKm)}km</p>

<TextInput labelText="Name" bind:value={props.name} />

<p>This route was created from a CSV file; you can't edit its properties</p>
