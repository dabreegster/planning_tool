<script>
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
  src="https://raw.githubusercontent.com/ADD-William-WaltersDavis/dft_hackathon/main/assets/images/dft-landingpage-logo.png"
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

<!-- <pre>
{JSON.stringify($form, null, " ")}
</pre> -->
<style>
  :global(.touched:invalid) {
    border-color: red;
    outline-color: red;
  }
</style>
