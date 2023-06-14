<script>
  import { gjScheme, clearCurrentlyEditing } from "../../../stores.js"

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
    class="govuk-button govuk-button--warning"
    style="font-size: 14px; float: right;"
    data-module="govuk-button"
    type="button"
    on:click={remove}>Delete</button
  >
  <button
    class="govuk-button"
    style="font-size: 14px;"
    data-module="govuk-button"
    type="button"
    on:click={clearCurrentlyEditing}>Save</button
  >
</div>
