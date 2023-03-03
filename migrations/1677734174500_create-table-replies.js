/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
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
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true,
      defaultValue: false,
    },
  });

  pgm.addConstraint('replies', 'fk_replies.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.thread_id_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.comment_id_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
