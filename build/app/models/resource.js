var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DateTime } from 'luxon';
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm';
import Item from '#models/item';
export default class Resource extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Resource.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Resource.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Resource.prototype, "price", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Resource.prototype, "type", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Resource.prototype, "isCraftable", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Resource.prototype, "externalId", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Resource.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Resource.prototype, "updatedAt", void 0);
__decorate([
    manyToMany(() => Item, {
        pivotTable: 'item_resources',
        pivotForeignKey: 'resource_id',
        pivotRelatedForeignKey: 'item_id',
        pivotColumns: ['quantity_required'],
        pivotTimestamps: true,
    }),
    __metadata("design:type", Object)
], Resource.prototype, "items", void 0);
__decorate([
    manyToMany(() => Resource, {
        pivotTable: 'resource_crafts',
        pivotForeignKey: 'crafted_resource_id',
        pivotRelatedForeignKey: 'required_resource_id',
        pivotColumns: ['quantity'],
        pivotTimestamps: true,
    }),
    __metadata("design:type", Object)
], Resource.prototype, "craftResources", void 0);
//# sourceMappingURL=resource.js.map