import {writable} from "svelte/store";

export const user = writable({
  email: "",
  token: "",
  id: "",
});

export const lastCDO = writable({
  requestDate: "",
  InstallationID: "",
  jData: {},
  cdoID:"",
});

// Selected title 
export const Titles_ = writable(
  [{}]
);

// Selected Instillation 
export const SelectedInstallation = writable(
  {
    id: 0,
    description: "",
  }
);

// export
export const SelectedChartInfo=writable(null);

// ChartData 
export const SelectedData= writable(
  [{}]
);