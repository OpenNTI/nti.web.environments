const Intervals = {
	ThreeMinutes: 180000
};

export default function getIntervalGenerator () {
	const start = new Date();

	return () => {
		const now = new Date();
		const diff = now - start;

		if (diff <= Intervals.ThreeMinutes) {
			return 5000;
		}

		return 30000;
	};
}