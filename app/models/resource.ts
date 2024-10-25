import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Item from '#models/item'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare price?: number

  @column()
  declare type: string

  @column()
  declare isCraftable: boolean

  @column()
  declare externalId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Item, {
    pivotTable: 'item_resources',
    pivotForeignKey: 'resource_id',
    pivotRelatedForeignKey: 'item_id',
    pivotColumns: ['quantity_required'],
    pivotTimestamps: true,
  })
  declare items: ManyToMany<typeof Item>

  @manyToMany(() => Resource, {
    pivotTable: 'resource_crafts',
    pivotForeignKey: 'crafted_resource_id',
    pivotRelatedForeignKey: 'required_resource_id',
    pivotColumns: ['quantity'],
    pivotTimestamps: true,
  })
  declare craftResources: ManyToMany<typeof Resource>
}
