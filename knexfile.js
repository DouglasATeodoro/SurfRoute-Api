module.exports = {
	client: 'postgresql',
	connection: {
		database: 'surfroute',
		user: 'postgres',
		password: '03072017'
	},
	pool: {
		min: 2,
		max: 10
	},
	migrations: {
		tableName: 'knex_migrations'
	}
};
