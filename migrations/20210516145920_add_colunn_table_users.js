
exports.up = function(knex) {
    return knex.schema.table('users', table => {        
        table.string('codPassword')
        
    })
};

exports.down = function(knex) {
    return knex.schema.table('users', table => {
        table.dropColumn('codPassword');
      })
};
