<script>
    import { beforeUpdate } from "svelte";
    import { kCloudUserService } from '../services/kcloud-user-service';

    beforeUpdate(() => {
        kCloudUserService.reload();
    });
</script>
<div class="container is-fluid">
	<slot />
</div>