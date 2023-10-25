<script>
  import { callPDFDownload, getSquareScore } from "../api.js";

  export let infoForPDF;

  async function downloadPDF() {
    let squareScores = await getSquareScore(infoForPDF["squareID"]);

    infoForPDF = {
      ...infoForPDF,
      squareScores,
    };

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
  .pdfDownloadButton {
    /* position: absolute; */
    /* top: 448px;
    right: 10px; */
    background: white;
    padding: 10px;
    border-radius: 10px;
    /* box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.2); */
    font-size: 1.2rem;
  }
  .white_button {
    background: white;
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 8px;
    font-size: 0.8rem;
    transition: background-color 0.05s ease-in-out;
  }
  .white_button:hover {
    background: #dfdfdf;
  }
</style>
