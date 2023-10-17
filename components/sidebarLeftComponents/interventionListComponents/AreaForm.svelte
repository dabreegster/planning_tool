<script>
  import { TextInput } from "carbon-components-svelte";

  export let props;
</script>

<div style="font-size: 1rem">Area name:</div>
<TextInput
  bind:value={props.name}
  style="font-size: 14px; background-color: white; border: 1px solid black; height: 30px;"
/>
