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
export const Titles_ = writable(null);

// Selected Instillation 
export const SelectedInstallation = writable(
  {
    id: 0,
    description: "",
  }
);

// export
export const SelectedDateRange=writable(null);

// Data for pasto chart
export const SelectedData= writable(null);

// Data for power chart
export const SelectedMultiData= writable(null);