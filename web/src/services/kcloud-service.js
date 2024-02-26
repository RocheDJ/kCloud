import axios from "axios";
import { user } from "../stores";

export const kcloudService = {
   // baseUrl: "http://34.240.177.253:3000",
   baseUrl: "http://127.0.0.1:3000",

    /**
     * @param {any} email
     * @param {any} password
     */
    async login(email, password) {
        try {
            const response = await axios.post(`${this.baseUrl}/user/authenticate`, { email, password });
            axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
            if (response.data.success) {
                user.set({
                    email: email,
                    token: response.data.token
                });
                localStorage.kCloud = JSON.stringify({ email: email, token: response.data.token });
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    async logout() {
        user.set({
            email: "",
            token: "",
          });
        axios.defaults.headers.common["Authorization"] = "";
        localStorage.removeItem("kCloud");
    },

    /**
     * @param {any} firstName
     * @param {any} lastName
     * @param {any} email
     * @param {any} password
     * @param {any} [mobile]
     */
    async signup(firstName, lastName, email, password, mobile) {
        try {
            const userDetails = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                mobile : mobile
            };
            await axios.post(this.baseUrl + "/user", userDetails);
            return true;
        } catch (error) {
            return false;
        }
    },
    reload() {
        const donationCredentials = localStorage.donation;
        if (donationCredentials) {
            const savedUser = JSON.parse(donationCredentials);
            user.set({
                email: savedUser.email,
                token: savedUser.token
            });
            axios.defaults.headers.common["Authorization"] = "Bearer " + savedUser.token;
        }
    }
};
