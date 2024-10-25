import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Item from './item.js'
import { DateTime } from 'luxon'

export default class CraftingList extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Item, {
    pivotTable: 'crafting_list_items',
    pivotForeignKey: 'crafting_list_id',
    pivotRelatedForeignKey: 'item_id',
    pivotColumns: ['quantity'],
  })
  declare items: ManyToMany<typeof Item>
}
