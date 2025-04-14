// Requirements:
// Provide the GitHub username as an argument when running the CLI. DONE
// Fetch the recent activity of the specified GitHub user using the GitHub API. DONE
// Display the fetched activity in the terminal. DONE
// Handle errors gracefully, such as invalid usernames or API failures. DONE

const https = require("https");
const process = require("process");
const fs = require("fs");

let user = process.argv[2];

console.log(`Public information about the user ${user}`);

const options = {
	hostname: "api.github.com",
	path: `/users/${user}/events`,
	headers: {
		"User-Agent": "TonyHdez-Pi",
	},
};

function getData(options) {
	return new Promise((resolve, reject) => {
		let gitHubData = "";
		const req = https.get(options, (response) => {
			response.on("data", (chunk) => (gitHubData += chunk));
			response.on("end", () => {
				try {
					resolve(JSON.parse(gitHubData));
				} catch (error) {
					reject(error);
				}
			});
			response.on("error", reject);
		});
		req.on("error", reject);
	});
}

async function writeData() {
	const gitHubData = await getData(options);
	console.log(gitHubData);
	await fs.writeFile(
		`${__dirname}/storage.json`,
		JSON.stringify(gitHubData),
		(err) => {
			if (err) {
				console.log(err);
			} else {
				console.log("file written successfully");
			}
		}
	);
}
writeData();
