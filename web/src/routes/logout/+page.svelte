<script>
	import { goto } from "$app/navigation";
    import { kCloudUserService } from "../../services/kcloud-user-service";
    kcloudService.logout();
    goto("/");
</script>
