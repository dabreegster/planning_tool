<script>
  import { callPDFDownload } from "../api.js";

  export let infoForPDF;

  async function downloadPDF() {
    const pdfResponse = await callPDFDownload(infoForPDF);
    const blob = await pdfResponse.blob();

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.pdf";
    link.style.display = "none";

    // Append the link to the body and click it to initiate download
    document.body.appendChild(link);
    link.click();

    // Clean up by revoking the URL object after the download
    URL.revokeObjectURL(url);
  }
</script>

<div>
  <button
    class="white_button"
    on:click={() => downloadPDF()}
    disabled={infoForPDF == null}
  >
    Download report PDF
  </button>
</div>

<style>
  .white_button {
    background: white;
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 8px;
    font-size: 0.9rem;
    transition: background-color 0.05s ease-in-out;
    margin-left: -6px;
  }
  .white_button:not([disabled]):hover {
    background: #dfdfdf;
  }
</style>
