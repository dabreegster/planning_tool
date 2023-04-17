<script>
  export let squareID;

  function downloadPDF() {
    console.log(squareID);
  }
</script>

<div>
  <button
    class="pdfDownloadButton"
    on:click={() => downloadPDF()}
    disabled={squareID == null}
  >
    Download report PDF
  </button>
</div>

<style>
  .pdfDownloadButton {
    position: absolute;
    top: 220px;
    left: 10px;
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2);
    font-size: 1.5rem;
  }
</style>
