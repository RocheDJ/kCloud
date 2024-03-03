import axios from 'axios';
import { user } from '../stores';

export const kCloudUserService = {
	// baseUrl: "http://34.240.177.253:3000",
	baseUrl: 'http://127.0.0.1:3000',

	/**
	 * @param {any} email
	 * @param {any} password
	 */
	async login(email, password) {
		try {
			const response = await axios.post(`${this.baseUrl}/user/authenticate`, { email, password });
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
			if (response.data.success) {
				user.set({
					email: email,
					token: response.data.token,
					id: response.data.id
				});
				localStorage.kCloudUser = JSON.stringify({
					email: email,
					token: response.data.token,
					id: response.data.id
				});
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
			email: '',
			token: '',
			id: ''
		});
		axios.defaults.headers.common['Authorization'] = '';
		localStorage.clear();
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
				mobile: mobile
			};
			await axios.post(this.baseUrl + '/user', userDetails);
			return true;
		} catch (error) {
			return false;
		}
	},
	reload() {
		const kCloudCredentials = localStorage.getItem('kCloudCredentials');
		if (kCloudCredentials) {
			const savedUser = JSON.parse(kCloudCredentials);
			user.set({
				email: savedUser.email,
				token: savedUser.token,
				id: savedUser.id
			});
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + savedUser.token;
		}
	},

	/**
	 * @param {any} userId
	 */
	async getInstallations(userId) {
		try {
			const response = await axios.get(this.baseUrl + '/Installation/user/' + userId);
			const Installations = response.data;
			localStorage.kCloudInstallations = JSON.stringify(Installations);
			return Installations;
		} catch (error) {
			return [];
		}
	},
	/**
	 * @param {any} InstallationID
	 */
	async getPVOTitles(InstallationID) {
		try {
			const response = await axios.get(this.baseUrl + '/pvo/title/' + InstallationID);
			const PVOTitles = response.data;
			try {
				let aTitleData = [];
				let Data = {};
				PVOTitles.forEach(function (item, index) {
					Data = {
						id:index,
						Title: item.Title,
						Enabled: true,
					};
					aTitleData.push(Data);
				  });
				const StorageID_Enable = 'Titles_' + InstallationID;
				localStorage.setItem(StorageID_Enable, JSON.stringify(aTitleData));
			} catch (error) {
				console.log("getPVOTitles "+error)
			}

			return PVOTitles;
		} catch (error) {
			return [];
		}
	},
	/**
	 * @param {any} InstallationID
	 * @param {any} TitleID
	 */
	async getPVOValue(InstallationID, TitleID) {
		try {
			const response = await axios.get(this.baseUrl + '/pvo/' + InstallationID + '/' + TitleID);
			const PVOValue = response.data;
			const StorageID = 'PVO_' + InstallationID + '_' + TitleID;
			localStorage.setItem(StorageID, JSON.stringify(PVOValue));
			return PVOValue;
		} catch (error) {
			return [];
		}
	}
};
