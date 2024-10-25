import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'craft_resources';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('crafted_resource_id').unsigned().references('resources.id').onDelete('CASCADE');
            table
                .integer('required_resource_id')
                .unsigned()
                .references('resources.id')
                .onDelete('CASCADE');
            table.integer('quantity').unsigned().notNullable();
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1729677541018_create_craft_resources_table.js.map