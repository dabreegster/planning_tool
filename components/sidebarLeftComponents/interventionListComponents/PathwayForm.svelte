<script>
  import { TextInput } from "carbon-components-svelte";

  export let props;
</script>

<div style="font-size: 1rem">Path name:</div>
<TextInput bind:value={props.name} style="font-size: 16px;" />
<br />
<p style="font-size: 20px;">Pathway length: {props.lengthKm.toFixed(3)}km</p>
