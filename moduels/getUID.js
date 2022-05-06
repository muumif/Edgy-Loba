const axios = require("axios");
const JSONBigInt = require("json-bigint")({ "storeAsString": true });
require("dotenv").config();

async function getUserUID(IGN, platform) {
	const URI = `${process.env.ALS_ENDPOINT}/nametouid?auth=${process.env.ALS_TOKEN}&player=${IGN}&platform=${platform}`;
	return await axios.get(encodeURI(URI), { transformResponse: [data => data] })
		.then(function(response) {
			if (platform == "PC") {
				return JSONBigInt.parse(response.data).uid;
			}
			return JSONBigInt.parse(response.data).result;
		}).catch((error) => {
			return Promise.reject(error);
		});
}

module.exports = {
	getUserUID,
};