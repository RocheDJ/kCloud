<script>
	import { goto } from "$app/navigation";
    import { kcloudService } from "../../services/kcloud-service";
    kcloudService.logout();
    goto("/");
</script>
