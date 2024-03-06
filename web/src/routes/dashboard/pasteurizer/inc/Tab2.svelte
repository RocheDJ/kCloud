<script lang="ts">
	import PastoChart from '$lib/PastoChart.svelte';
    import DateTimeRange from '$lib/DateTimeRange.svelte';
    import { kCloudUserService } from '../../../../services/kcloud-user-service';
    import { onMount } from 'svelte';
    import { Titles_,SelectedInstallation } from '../../../../stores';
	
    
    let ChartDataRaw = [];
    let ChartData = [{  
                        name: 'Line 1',
                        chartType:'line',
                        values: [9, 8, 10, 11, 5, 14, 13],
                        }
                    ];

    let ChartLabels = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
    let mySelectedInstallation;
    let SelectedTitles = []; //JSON.parse(aSelectedTitles);
    let sStart = "2024-03-01 18:00:00";
    let sStop = "2024-03-06 18:59:59";


    const LoadChartData = async () => {
		const DataValues =[];
        ChartDataRaw = await kCloudUserService.getPVOValueSpecific(
					mySelectedInstallation.id,
					SelectedTitles[1].Title,
                    sStart,
                    sStop,
				);
        
        console.log ('Chart Data log ' + ChartDataRaw.length);
    };

	// what happens when there is a change in selected unit
	SelectedInstallation.subscribe((value) => {
		mySelectedInstallation = value;
	});

	// what happens when there is a change in selected titles
	Titles_.subscribe((value) => {
		SelectedTitles = value;
        LoadChartData();
	});

    onMount(async () => {
		LoadChartData();
	});

</script>

<DateTimeRange />

<PastoChart ChartTitle={'Pasteurizer Temp'} 
            ChartType= {'line'} 
            ChartData= {ChartData}
            ChartLabels={ChartLabels}
            />