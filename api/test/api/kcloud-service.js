require("dotenv").config();
const axios = require("axios");
const serviceUrl = process.env.TEST_SERVICE_URL;

const kCloudService = {
  kCloudURL: serviceUrl,
  // ------------------------- Users --------------------------------------
  async createUser(user) {
    const res = await axios.post(`${this.kCloudURL}/user`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.kCloudURL}/user/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.kCloudURL}/user`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.kCloudURL}/user`);
    return res.data;
  },

  // ------------------------- Auth --------------------------------------

  async authenticate(user) {
    const response = await axios.post(
      `${this.kCloudURL}/user/authenticate`,
      user
    );
    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
    return response.data;
  },

  async clearAuth() {
    axios.defaults.headers.common.Authorization = "";
  },
  // --------------------------------------------------------------------------
};

//--------------------------------------------------------------------------------------------
module.exports = {
  kCloudService,
};
