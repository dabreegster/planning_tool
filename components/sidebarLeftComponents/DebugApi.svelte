<script>
  import { Modal, TextArea } from "carbon-components-svelte";

  export let requestJson;
  export let responseJson;

  let openRequest = false;
  let openResponse = false;

  function toggleRequest() {
    openResponse = false;
    openRequest = !openRequest;
  }
  function toggleResponse() {
    openRequest = false;
    openResponse = !openResponse;
  }
</script>

<Modal passiveModal modalHeading="Request JSON" bind:open={openRequest}>
  <TextArea
    readonly
    rows="20"
    value={JSON.stringify(requestJson, null, "  ")}
  />
</Modal>
<Modal passiveModal modalHeading="Response JSON" bind:open={openResponse}>
  <TextArea
    readonly
    rows="20"
    value={JSON.stringify(responseJson, null, "  ")}
  />
</Modal>

<button
  type="button"
  class="white_button"
  data-module="govuk-button"
  style="font-size: 1rem; float: right;"
  on:click={toggleResponse}
  disabled={responseJson == null}>API response</button
>

<button
  type="button"
  class="white_button"
  data-module="govuk-button"
  style="font-size: 1rem; float: right;  margin-right: 10px;"
  on:click={toggleRequest}
  disabled={requestJson == null}>API request</button
>

<style>
  button {
    border-radius: 5px;
    transition: background-color 0.05s ease-in-out;
  }

  .white_button {
    background: white;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 8px;
    font-size: 0.8rem;
    transition: background-color 0.05s ease-in-out;
  }
  .white_button:hover {
    background: #dfdfdf;
  }
</style>
