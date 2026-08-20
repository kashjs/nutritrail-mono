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
    pgm.alterColumn('meals', 'calories', { notNull: false });
    pgm.alterColumn('meals', 'protein_g', { notNull: false });
    pgm.alterColumn('meals', 'carbs_g', { notNull: false });
    pgm.alterColumn('meals', 'fat_g', { notNull: false });
};
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.alterColumn('meals', 'calories', { notNull: true });
    pgm.alterColumn('meals', 'protein_g', { notNull: true });
    pgm.alterColumn('meals', 'carbs_g', { notNull: true });
    pgm.alterColumn('meals', 'fat_g', { notNull: true });
};
