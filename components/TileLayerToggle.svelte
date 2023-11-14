<script>
  export let tileSettings;

  function modes() {
    return [
      "Overall",
      "Public transport",
      "Walking",
      "Cycling",
      "Driving",
    ]
  }

  function purposes() {
    return [
      "Overall",
      "Business",
      "Education",
      "Entertainment",
      // "Health", // TODO: uncomment this when health scores found
      "Shopping",
      "Residential",
    ]
  }
  function tileLevels() {
    return [
      "National",
      "Local authority",
    ]
  }

  function LAnames() {
    return [
      "Hide",
      "Adur",
      "Allerdale",
      "Amber Valley",
      "Arun",
      "Ashfield",
      "Ashford",
      "Aylesbury Vale",
      "Babergh",
      "Barking and Dagenham",
      "Barnet",
      "Barnsley",
      "Barrow-in-Furness",
      "Basildon",
      "Basingstoke and Deane",
      "Bassetlaw",
      "Bath and North East Somerset",
      "Bedford",
      "Bexley",
      "Birmingham",
      "Blaby",
      "Blackburn with Darwen",
      "Blackpool",
      "Blaenau Gwent",
      "Bolsover",
      "Bolton",
      "Boston",
      "Bournemouth, Christchurch and Poole",
      "Bracknell Forest",
      "Bradford",
      "Braintree",
      "Breckland",
      "Brent",
      "Brentwood",
      "Bridgend",
      "Brighton and Hove",
      "Bristol, City of",
      "Broadland",
      "Bromley",
      "Bromsgrove",
      "Broxbourne",
      "Broxtowe",
      "Burnley",
      "Bury",
      "Caerphilly",
      "Calderdale",
      "Cambridge",
      "Camden",
      "Cannock Chase",
      "Canterbury",
      "Cardiff",
      "Carlisle",
      "Carmarthenshire",
      "Castle Point",
      "Central Bedfordshire",
      "Ceredigion",
      "Charnwood",
      "Chelmsford",
      "Cheltenham",
      "Cherwell",
      "Cheshire East",
      "Cheshire West and Chester",
      "Chesterfield",
      "Chichester",
      "Chiltern",
      "Chorley",
      "City of London",
      "Colchester",
      "Conwy",
      "Copeland",
      "Corby",
      "Cornwall",
      "Cotswold",
      "County Durham",
      "Coventry",
      "Craven",
      "Crawley",
      "Croydon",
      "Dacorum",
      "Darlington",
      "Dartford",
      "Daventry",
      "Denbighshire",
      "Derby",
      "Derbyshire Dales",
      "Doncaster",
      "Dorset",
      "Dover",
      "Dudley",
      "Ealing",
      "East Cambridgeshire",
      "East Devon",
      "East Hampshire",
      "East Hertfordshire",
      "East Lindsey",
      "East Northamptonshire",
      "East Riding of Yorkshire",
      "East Staffordshire",
      "East Suffolk",
      "Eastbourne",
      "Eastleigh",
      "Eden",
      "Elmbridge",
      "Enfield",
      "Epping Forest",
      "Epsom and Ewell",
      "Erewash",
      "Exeter",
      "Fareham",
      "Fenland",
      "Flintshire",
      "Folkestone and Hythe",
      "Forest of Dean",
      "Fylde",
      "Gateshead",
      "Gedling",
      "Gloucester",
      "Gosport",
      "Gravesham",
      "Great Yarmouth",
      "Greenwich",
      "Guildford",
      "Gwynedd",
      "Hackney",
      "Halton",
      "Hambleton",
      "Hammersmith and Fulham",
      "Harborough",
      "Haringey",
      "Harlow",
      "Harrogate",
      "Harrow",
      "Hart",
      "Hartlepool",
      "Hastings",
      "Havant",
      "Havering",
      "Herefordshire, County of",
      "Hertsmere",
      "High Peak",
      "Hillingdon",
      "Hinckley and Bosworth",
      "Horsham",
      "Hounslow",
      "Huntingdonshire",
      "Hyndburn",
      "Ipswich",
      "Isle of Anglesey",
      "Isle of Wight",
      "Isles of Scilly",
      "Islington",
      "Kensington and Chelsea",
      "Kettering",
      "King's Lynn and West Norfolk",
      "Kingston upon Hull, City of",
      "Kingston upon Thames",
      "Kirklees",
      "Knowsley",
      "Lambeth",
      "Lancaster",
      "Leeds",
      "Leicester",
      "Lewes",
      "Lewisham",
      "Lichfield",
      "Lincoln",
      "Liverpool",
      "Luton",
      "Maidstone",
      "Maldon",
      "Malvern Hills",
      "Manchester",
      "Mansfield",
      "Medway",
      "Melton",
      "Mendip",
      "Merthyr Tydfil",
      "Merton",
      "Mid Devon",
      "Mid Suffolk",
      "Mid Sussex",
      "Middlesbrough",
      "Milton Keynes",
      "Mole Valley",
      "Monmouthshire",
      "Neath Port Talbot",
      "New Forest",
      "Newark and Sherwood",
      "Newcastle upon Tyne",
      "Newcastle-under-Lyme",
      "Newham",
      "Newport",
      "North Devon",
      "North East Derbyshire",
      "North East Lincolnshire",
      "North Hertfordshire",
      "North Kesteven",
      "North Lincolnshire",
      "North Norfolk",
      "North Somerset",
      "North Tyneside",
      "North Warwickshire",
      "North West Leicestershire",
      "Northampton",
      "Northumberland",
      "Norwich",
      "Nottingham",
      "Nuneaton and Bedworth",
      "Oadby and Wigston",
      "Oldham",
      "Oxford",
      "Pembrokeshire",
      "Pendle",
      "Peterborough",
      "Plymouth",
      "Portsmouth",
      "Powys",
      "Preston",
      "Reading",
      "Redbridge",
      "Redcar and Cleveland",
      "Redditch",
      "Reigate and Banstead",
      "Rhondda Cynon Taf",
      "Ribble Valley",
      "Richmond upon Thames",
      "Richmondshire",
      "Rochdale",
      "Rochford",
      "Rossendale",
      "Rother",
      "Rotherham",
      "Rugby",
      "Runnymede",
      "Rushcliffe",
      "Rushmoor",
      "Rutland",
      "Ryedale",
      "Salford",
      "Sandwell",
      "Scarborough",
      "Sedgemoor",
      "Sefton",
      "Selby",
      "Sevenoaks",
      "Sheffield",
      "Shropshire",
      "Slough",
      "Solihull",
      "Somerset West and Taunton",
      "South Bucks",
      "South Cambridgeshire",
      "South Derbyshire",
      "South Gloucestershire",
      "South Hams",
      "South Holland",
      "South Kesteven",
      "South Lakeland",
      "South Norfolk",
      "South Northamptonshire",
      "South Oxfordshire",
      "South Ribble",
      "South Somerset",
      "South Staffordshire",
      "South Tyneside",
      "Southampton",
      "Southend-on-Sea",
      "Southwark",
      "Spelthorne",
      "St Albans",
      "St. Helens",
      "Stafford",
      "Staffordshire Moorlands",
      "Stevenage",
      "Stockport",
      "Stockton-on-Tees",
      "Stoke-on-Trent",
      "Stratford-on-Avon",
      "Stroud",
      "Sunderland",
      "Surrey Heath",
      "Sutton",
      "Swale",
      "Swansea",
      "Swindon",
      "Tameside",
      "Tamworth",
      "Tandridge",
      "Teignbridge",
      "Telford and Wrekin",
      "Tendring",
      "Test Valley",
      "Tewkesbury",
      "Thanet",
      "Three Rivers",
      "Thurrock",
      "Tonbridge and Malling",
      "Torbay",
      "Torfaen",
      "Torridge",
      "Tower Hamlets",
      "Trafford",
      "Tunbridge Wells",
      "Uttlesford",
      "Vale of Glamorgan",
      "Vale of White Horse",
      "Wakefield",
      "Walsall",
      "Waltham Forest",
      "Wandsworth",
      "Warrington",
      "Warwick",
      "Watford",
      "Waverley",
      "Wealden",
      "Wellingborough",
      "Welwyn Hatfield",
      "West Berkshire",
      "West Devon",
      "West Lancashire",
      "West Lindsey",
      "West Oxfordshire",
      "West Suffolk",
      "Westminster",
      "Wigan",
      "Wiltshire",
      "Winchester",
      "Windsor and Maidenhead",
      "Wirral",
      "Woking",
      "Wokingham",
      "Wolverhampton",
      "Worcester",
      "Worthing",
      "Wrexham",
      "Wychavon",
      "Wycombe",
      "Wyre",
      "Wyre Forest",
      "York",
    ];
  }
</script>

<div class="govuk-label" style="font-size: 0.9rem;">
  Tiles on/off:
  <input type="checkbox" 
    bind:checked={tileSettings["toggle"]} 
  />
</div>
<br/>

<div class="govuk-form-group" style="display: flex; margin-bottom: 20px">
  <div
    class="govuk-label"
    style="padding: 5px 32px 0px 0px; font-size: 0.9rem;"
  >    
    Purpose:
  </div>
  <select
    class="govuk-select"
    bind:value={tileSettings["purpose"]}
  >
    {#each purposes() as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>

<div class="govuk-form-group" style="display: flex;  margin-bottom: 20px">
  <div
    class="govuk-label"
    style="padding: 5px 49px 0px 0px; font-size: 0.9rem;"
  >
    Mode:
  </div>
  <select
    class="govuk-select"
    bind:value={tileSettings["mode"]}
    >
    {#each modes() as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>

<div class="govuk-form-group" style="display: flex;  margin-bottom: 15px">
  <div
    class="govuk-label"
    style="padding: 5px 52px 0px 0px; font-size: 0.9rem;"
  >
    Level:
  </div>
  <select
    class="govuk-select"
    bind:value={tileSettings["level"]}
  >
    {#each tileLevels() as x}
      <option value={x}>{x}</option>
    {/each}
  </select>
</div>

<div class="govuk-form-group" style="display: flex;">
  <label 
    class="govuk-label"
    for="scoreLayer"
    style="padding: 1px 27px 0px 0px; font-size: 0.9rem;"
  > 
    Local <br> authority: 
  </label>
  <select
    class="govuk-select"
    id="scoreLayer"
    name="scoreLayer"
    style="margin-top: 5px;"
    bind:value={tileSettings["LA"]}
  >
    {#each LAnames() as LAName}
      <option value={LAName}>{LAName}</option>
    {/each}
  </select>
</div>

<style>
  select {
    padding: 4px 8px;
    font-size: 0.9rem;
    height: 35px;
    /* float: right; */
    border: 1px solid rgb(0, 0, 0);
    height: 30px;
    width: 68%;

  }
</style>
