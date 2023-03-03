/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    body: {
      type: 'TEXT',
      notNull: false,
    },
    date: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
  });

  pgm.addConstraint('threads', 'fk_threads.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('threads');
};
