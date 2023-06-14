<script>
  import {
    SelectItem,
    Select,
    TextInput,
    NumberInput,
  } from "carbon-components-svelte";

  export let props;
</script>

Building name
<TextInput bind:value={props.name} style="font-size: 16px;" />

<br />
Purpose
<Select bind:selected={props.purpose} style="font-size: 16px;">
  <SelectItem text="Business" value="Business" />
  <SelectItem text="Residential" value="Visit friends at private home" />

  <SelectItem text="Allotment" value="Allotment" />
  <SelectItem text="Amusement Park" value="Amusement Park" />
  <SelectItem text="Amusements" value="Amusements" />
  <SelectItem text="Arena / Stadium" value="Arena / Stadium" />
  <SelectItem text="Bank" value="bank" />
  <SelectItem
    text="Bingo Hall / Cinema / Conference / Exhibition Centre / Theatre / Concert Hall"
    value="Bingo Hall / Cinema / Conference / Exhibition Centre / Theatre / Concert Hall"
  />
  <SelectItem text="Campsite" value="Campsite" />
  <SelectItem text="Education: Further" value="further education" />
  <SelectItem text="Education: Pre-school/Nursery" value="pre school nursery" />
  <SelectItem text="Education: Primary school" value="Primary school" />
  <SelectItem text="Education: Secondary School" value="Secondary School" />
  <SelectItem
    text="Education: Special Needs Establishment"
    value="special needs establishment"
  />
  <SelectItem text="Education: university" value="university" />
  <SelectItem text="Historic" value="historic" />
  <SelectItem text="Leisure (generic)" value="Leisure (generic)" />
  <SelectItem text="Library" value="Library" />
  <SelectItem text="Motor sports" value="Motor sports" />
  <SelectItem text="Museum" value="Museum" />
  <SelectItem text="Pub/Nightclub" value="pub_nightclub" />
  <SelectItem
    text="Recreation and Sports Ground"
    value="Recreation and Sports Ground"
  />
  <SelectItem text="Retail: Food" value="food_retail" />
  <SelectItem text="Retail: Garden" value="gardening_retail" />
  <SelectItem text="Retail: Generic" value="retail_generic" />
  <SelectItem text="Retail: Petrol" value="petrol_retail" />
  <SelectItem text="Retail: Shop" value="retail_shop" />
  <SelectItem
    text="Royal Mail Infrastructure"
    value="royal_mail_infrastructure"
  />
  <SelectItem text="Spiritual/Religious" value="spiritual_religious" />
  <SelectItem text="Theatre" value="Theatre" />
</Select>

<br />

{#if props.purpose == "Visit friends at private home"}
  Number of people to live here
  <NumberInput bind:value={props.num_people} style="font-size: 16px;" />
{:else if props.purpose == "Business"}
  Number of jobs
  <NumberInput bind:value={props.num_jobs} style="font-size: 16px;" />
{:else}
  Total square meters of floor-space
  <NumberInput bind:value={props.areaSquareMeters} style="font-size: 16px;" />
{/if}
