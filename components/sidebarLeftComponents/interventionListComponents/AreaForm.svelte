<script>
  import { TextInput } from "carbon-components-svelte";

  export let props;
</script>

Area name
<TextInput bind:value={props.name} style="font-size: 16px; background-color: white; border: 1px solid black;" />
