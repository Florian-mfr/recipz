import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Resource from '#models/resource'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare externalId?: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Resource, {
    pivotTable: 'item_resources',
    pivotForeignKey: 'item_id',
    pivotRelatedForeignKey: 'resource_id',
    pivotColumns: ['quantity_required'],
    pivotTimestamps: true,
  })
  declare resources: ManyToMany<typeof Resource>
}
