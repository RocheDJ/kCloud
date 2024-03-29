<script>
    import { beforeUpdate } from "svelte";
    import { kCloudUserService } from '../services/kcloud-user-service';
    import TopMenu from '$lib/TopMenu.svelte';
    beforeUpdate(() => {
        kCloudUserService.reload();
    });
</script>

<div class="container is-fluid">  
    <TopMenu title={'kCloud Portal'} subTitle={'by David Roche for Kilderry V1.0.24083'} />
	<slot></slot> 
</div>