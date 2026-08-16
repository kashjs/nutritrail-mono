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
    pgm.createTable('meal_items', {
        id: 'id',
        meal_id: {
            type: 'integer',
            notNull: true,
            references: 'meals',
            onDelete: 'CASCADE',
        },
        description: {type: 'text', notNull: true},
        quantity: {type: 'numeric'},
        unit: { type: 'varchar(20)' },
        calories: {type: 'integer', notNull: true},
        protein_g: {type: 'numeric', notNull: true},
        carbs_g: {type: 'numeric', notNull: true},
        fat_g: {type: 'numeric', notNull: true},
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
    pgm.dropTable('meal_items');
};
