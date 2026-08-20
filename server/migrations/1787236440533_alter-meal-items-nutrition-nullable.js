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
    pgm.alterColumn('meal_items', 'calories', { notNull: false });
    pgm.alterColumn('meal_items', 'protein_g', { notNull: false });
    pgm.alterColumn('meal_items', 'carbs_g', { notNull: false });
    pgm.alterColumn('meal_items', 'fat_g', { notNull: false });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.alterColumn('meal_items', 'calories', { notNull: true });
    pgm.alterColumn('meal_items', 'protein_g', { notNull: true });
    pgm.alterColumn('meal_items', 'carbs_g', { notNull: true });
    pgm.alterColumn('meal_items', 'fat_g', { notNull: true });
};
