<script>
    import { beforeUpdate } from "svelte";
    import { kCloudUserService } from '../services/kcloud-user-service';
    import { goto } from '$app/navigation';
    beforeUpdate(() => {
        kCloudUserService.reload();
       // goto(`/home`);
    });
</script>
<div class="container is-fluid">
	<slot />
</div>