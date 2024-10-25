var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm';
import User from './user.js';
import Item from './item.js';
import { DateTime } from 'luxon';
export default class CraftingList extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], CraftingList.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], CraftingList.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], CraftingList.prototype, "name", void 0);
__decorate([
    belongsTo(() => User),
    __metadata("design:type", Object)
], CraftingList.prototype, "user", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], CraftingList.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], CraftingList.prototype, "updatedAt", void 0);
__decorate([
    manyToMany(() => Item, {
        pivotTable: 'crafting_list_items',
        pivotForeignKey: 'crafting_list_id',
        pivotRelatedForeignKey: 'item_id',
        pivotColumns: ['quantity'],
    }),
    __metadata("design:type", Object)
], CraftingList.prototype, "items", void 0);
//# sourceMappingURL=crafting_list.js.map