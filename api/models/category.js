const category = (sequelize, DataTypes) => {
	return sequelize.define('category', {
		name: {
			type: DataTypes.STRING(32),
			allowNull: false,
			defaultValue: '',
		},
		abbr: {
			type: DataTypes.STRING(15),
			allowNull: true,
		},
	});
};

export default category;
