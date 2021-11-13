module.exports = {
	widthValue: (candidates, candidateVote) => {
		const votes = candidates.map(can => can.voteCount);

		const totalVotes = votes.reduce((total, vote) => total + vote);

		return ((candidateVote / totalVotes) * 100).toFixed(1) + "%";
	},

	totalVoteCast: (candidates) => {
		const votes = candidates.map(can => can.voteCount);

		const totalVotes = votes.reduce((total, vote) => total + vote);

		return totalVotes;
	},
};
