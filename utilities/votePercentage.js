module.exports = {
	votePercentage: (eligibleVoters, allowedVoters, votesCast) => {
		let actualValidVoters = [];

		if (allowedVoters.length > 0) {
			console.log(eligibleVoters.length);
			eligibleVoters.map(v => {
				if (allowedVoters.includes(v.groups)) {
					actualValidVoters.push(v);
				}
			});

			return actualValidVoters.length;
		} else {
			return eligibleVoters.length;
		}
	},
};
