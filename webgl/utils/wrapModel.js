function wrapModel(obj) {
	obj.get = (name, all = false) => {
		const result = [];
		obj.traverse(
			(child) => child.name.toLowerCase().includes(name.toLowerCase()) && result.push(child),
		);
		return all ? result : result[0];
	};

	return obj;
}

export { wrapModel };
export default wrapModel;
