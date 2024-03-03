import {writable} from "svelte/store";

export const user = writable({
  email: "",
  token: "",
  id: "",
});

// Selected title 
export const Titles_ = writable(
  [{}]
);