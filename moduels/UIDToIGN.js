const axios = require("axios");
require("dotenv").config();

async function UIDToIGN(UID, platform) {
	const URI = `${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform}&skipRank=true`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			return response.data.global.name;
		}).catch(function(error) {
			return Promise.reject(error);
		});
}

module.exports = {
	UIDToIGN,
};