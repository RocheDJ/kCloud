<script>
    import { goto } from "$app/navigation";
    import { kCloudUserService } from "../services/kcloud-user-service";

    let email = "";
    let password = "";
    let errorMessage = "";

    async function login() {
        console.log(`attempting to log in email: ${email} with password: ${password}`);
        let success = await kCloudUserService.login(email, password);
        if (success) {
            goto("/dashboard");
        } else {
            email = "";
            password = "";
            errorMessage = "Invalid Credentials";
        }
    }
</script>


<form on:submit|preventDefault={login}>
    <div class="field">
        <label class="label" for="email">Email</label>
        <input bind:value={email} class="input" id="email" name="email" placeholder="Enter email" type="text" />
    </div>
    <div class="field">
        <label class="label" for="password">Password</label>
        <input bind:value={password} class="input" id="password" name="password" placeholder="Enter Password" type="password" />
    </div>
    <div class="field is-grouped">
        <button class="button is-link">Log In</button>
    </div>
    {#if errorMessage}
    <div class="section">
        {errorMessage}
    </div>
{/if}
</form>
