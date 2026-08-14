/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('meals', {
        id: 'id',
        user_id: {
            type: 'integer',
            notNull: true,
            references: 'users',
            onDelete: 'CASCADE',
        },
        description: {type: 'text', notNull: true},
        calories: {type: 'integer', notNull: true},
        protein_g: {type: 'numeric', notNull: true},
        carbs_g: {type: 'numeric', notNull: true},
        fat_g: {type: 'numeric', notNull: true},
        meal_type: {type: 'varchar(20)', notNull: true},
        consumed_at: {type: 'timestamp', notNull: true},
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('meals');
};
