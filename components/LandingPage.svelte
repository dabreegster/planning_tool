<script>
  import Range from "./Range.svelte";
  let value = 42;
  let theme = "default";

  import {
    useForm,
    validators,
    HintGroup,
    Hint,
    required,
  } from "svelte-use-form";

  const form = useForm();
  export let login_username;
  export let login_password;

  function handleLogin() {
    let { username, password } = $form.values;
    login_username = username;
    login_password = password;
  }

  function handleKeyPress(event) {
    if (event.key === "Enter" && $form.valid) {
      handleLogin();
    }
  }
</script>

<br />
<img
  aria-label="DfT logo"
  src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/planning_tool/main/assets/images/dft-landingpage-logo.png"
  height="177"
  width="261"
/>

<br />
<form use:form>
  <h1>Connectivity Planning Tool Login</h1>
  <br />
  <input
    type="username"
    name="username"
    use:validators={[required]}
    on:keydown={handleKeyPress}
  />
  <HintGroup for="username">
    <Hint on="required">This is a mandatory field</Hint>
  </HintGroup>

  <input
    type="password"
    name="password"
    use:validators={[required]}
    on:keydown={handleKeyPress}
  />
  <Hint for="password" on="required">This is a mandatory field</Hint>
</form>
<br />
<button disabled={!$form.valid} on:click={handleLogin}>Login</button>

<div class="purple-theme">
  <label for="basic-range">Opacity Level</label>
  <Range on:change={(e) => (value = e.detail.value)} id="basic-slider" />
</div>
<h3>
  {value}
</h3>

<style>
  :global(.touched:invalid) {
    border-color: red;
    outline-color: red;
  }

  .purple-theme {
    --track-focus: #c368ff;
    --track-highlight-bgcolor: #c368ff;
    --track-highlight-bg: linear-gradient(90deg, #c368ff, #c965ff);
    --thumb-holding-outline: rgba(191, 102, 251, 0.3);
    --tooltip-bgcolor: #c368ff;
    --tooltip-bg: linear-gradient(45deg, #c368ff, #c965ff);
  }

  .theme-buttons {
    display: flex;
    justify-content: center;
  }

  h3 {
    text-align: center;
  }

  label {
    margin: 8px;
    font-size: 16px;
    font-weight: 600;
  }
</style>
