<script>

  let hexlookup = [
      "#eeeeee",
      "#9594c7",
      "#bccff5",
      "#8ef4f5",
      "#94fa94",
      "#f9fa94",
      "#f6bca8",
      "#f48f8e",
      "#c69494",
      "#614a4a",
    ];


</script>
<body>
  <div class="description">
    % score brackets
  </div>
  <div class="container">
    <div class="column">
      <div class="box" style="background-color: {hexlookup[0]}"></div>
      <div class="description">0-10</div>
      <div class="box ten_to_twenty" style="background-color: {hexlookup[5]}"></div>
      <div class="description">50-60</div>
    </div>
    <div class="column">
      <div class="box" style="background-color: {hexlookup[1]}"></div>
      <div class="description">10-20</div>
      <div class="box" style="background-color: {hexlookup[6]}"></div>
      <div class="description">60-70</div>
    </div>
    <div class="column">
      <div class="box" style="background-color: {hexlookup[2]}"></div>
      <div class="description">20-30</div>
      <div class="box" style="background-color: {hexlookup[7]}"></div>
      <div class="description">70-80</div>
    </div>
    <div class="column">
      <div class="box" style="background-color: {hexlookup[3]}"></div>
      <div class="description">30-40</div>
      <div class="box" style="background-color: {hexlookup[8]}"></div>
      <div class="description">80-90</div>
    </div>
    <div class="column">
      <div class="box" style="background-color: {hexlookup[4]}"></div>
      <div class="description">40-50</div>
      <div class="box" style="background-color: {hexlookup[9]}"></div>
      <div class="description">90-100</div>
    </div>
  </div>
</body>

<style>
    .container {
      display: flex;
      flex-wrap: wrap;
      border-radius: 5px;
    }

    .box {
      width: 20px;
      height: 20px;
      margin: 8px 19px;
      opacity: 1;
      border-width: 1px;
      border-color: black;
    }

    .description {
      text-align: center;
      font-size: 0.9rem;
    }
</style>
