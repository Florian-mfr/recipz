/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import CraftingList from '#models/crafting_list'
import Item from '#models/item'
import Resource from '#models/resource'
import ResourceInventory from '#models/resource_inventory'
import User from '#models/user'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { serializeManyWithPivotDeep, serializeWithPivotDeep } from '../app/utils/serializer.js'
router.on('/').redirectToPath('/crafting-list').use(middleware.auth())

router
  .group(() => {
    router
      .get('/login', ({ inertia }) => {
        return inertia.render('Auth/Login')
      })
      .as('auth.login')

    router
      .post('/login', async ({ request, auth, response }) => {
        const { email, password } = request.only(['email', 'password'])

        try {
          const user = await User.verifyCredentials(email, password)
          if (!user) {
            return response.redirect().back()
          }
          await auth.use('web').login(user)
          return response.redirect().toRoute('/crafting-list')
        } catch (error) {
          console.log('error', error)
          return response.redirect().back()
        }
      })
      .as('auth.login.post')

    router
      .post('/logout', async ({ auth, response }) => {
        await auth.use('web').logout()
        return response.redirect().toRoute('auth.login')
      })
      .as('auth.logout')

    router
      .post('/register', async ({ request, auth, response }) => {
        const { email, password, username } = request.only(['email', 'password', 'username'])

        const user = await User.create({ email, password, username })
        await auth.use('web').login(user)

        return response.redirect().toRoute('/crafting-list')
      })
      .as('auth.register.post')
  })
  .use(middleware.guest())

router
  .group(() => {
    // router
    //   .get('/', async ({ inertia }) => {
    //     const resources = await Resource.all()
    //     return inertia.render('Resources/Index', { resources })
    //   })
    //   .as('resources.index')
    // router
    //   .get('/create', async ({ inertia }) => {
    //     return inertia.render('Resources/Create')
    //   })
    //   .as('resources.create')
    // router
    //   .post('/', async ({ request, response }) => {
    //     const data = request.only(['name', 'price', 'type', 'isCraftable', 'externalId'])
    //     await Resource.create(data)
    //     return response.redirect().toRoute('resources.index')
    //   })
    //   .as('resources.store')
    // router
    //   .get('/:id/edit', async ({ params, inertia }) => {
    //     const resource = await Resource.findOrFail(params.id)
    //     return inertia.render('Resources/Edit', { resource })
    //   })
    //   .as('resources.edit')
    // router
    //   .put('/:id', async ({ params, request, response }) => {
    //     const resource = await Resource.findOrFail(params.id)
    //     const data = request.only(['name', 'price'])
    //     resource.merge(data)
    //     await resource.save()
    //     return response.redirect().toRoute('resources.index')
    //   })
    //   .as('resources.update')
    // router
    //   .delete('/:id', async ({ params, response }) => {
    //     const resource = await Resource.findOrFail(params.id)
    //     await resource.delete()
    //     return response.redirect().toRoute('resources.index')
    //   })
    //   .as('resources.destroy')
  })
  .prefix('/resources')
  .use(middleware.auth())

router
  .group(() => {
    // Liste tous les items
    // router
    //   .get('/', async ({ inertia }) => {
    //     const items = await Item.query().preload('resources', (query) => {
    //       query.pivotColumns(['quantity_required'])
    //     })

    //     const itemsWithPivot = items.map((item) => {
    //       return {
    //         ...item.toJSON(),
    //         resources: item.resources.map((resource) => ({
    //           ...resource.toJSON(),
    //           quantity_required: resource.$extras.pivot_quantity_required, // Ajoute le champ pivot au résultat
    //         })),
    //       }
    //     })

    //     console.log(JSON.stringify(itemsWithPivot))
    //     return inertia.render('Items/Index', { items: itemsWithPivot })
    //   })
    //   .as('items.index')

    router.get('/search', async ({ request, response }) => {
      const query = request.input('q')

      const items = await Item.query().where('name', 'ilike', `%${query}%`).limit(10)

      return response.json(items)
    })

    // Affiche le formulaire de création d'un item
    // router
    //   .get('/create', async ({ inertia }) => {
    //     const resources = await Resource.all()
    //     console.log(resources)
    //     return inertia.render('Items/Create', { availableResources: resources })
    //   })
    //   .as('items.create')

    // // Traite la création d'un nouvel item
    // router
    //   .post('/', async ({ request, response }) => {
    //     const itemData = request.only(['name'])
    //     const resourcesData: { id: number; quantity: number }[] = request.input('resources', {})

    //     const item = await Item.create(itemData)

    //     // Transformer les données des ressources pour l'attachement

    //     console.log('resourcesData', resourcesData)

    //     for (const resourceRequired of resourcesData) {
    //       await item.related('resources').attach({
    //         [resourceRequired.id]: {
    //           quantity_required: resourceRequired.quantity,
    //         },
    //       })
    //     }

    //     // await item.related('resources').attach(resourcesForAttach)

    //     return response.redirect().toRoute('items.index')
    //   })
    //   .as('items.store')

    // // Affiche le formulaire d'édition d'un item
    // router
    //   .get('/:id/edit', async ({ params, inertia }) => {
    //     const item = await Item.findOrFail(params.id)
    //     await item.load('resources')
    //     return inertia.render('Items/Edit', { item })
    //   })
    //   .as('items.edit')

    // Traite la mise à jour d'un item
    // router
    //   .put('/:id', async ({ params, request, response }) => {
    //     const item = await Item.findOrFail(params.id)
    //     const itemData = request.only(['name'])
    //     const resourcesData = request.input('resources', [])

    //     item.merge(itemData)
    //     await item.save()
    //     await item.related('resources').sync(resourcesData)

    //     return response.redirect().toRoute('items.index')
    //   })
    //   .as('items.update')

    // // Supprime un item
    // router
    //   .delete('/:id', async ({ params, response }) => {
    //     const item = await Item.findOrFail(params.id)
    //     await item.delete()
    //     return response.redirect().toRoute('items.index')
    //   })
    //   .as('items.destroy')
  })
  .prefix('/items')
  .use(middleware.auth())

router
  .group(() => {
    router
      .get('/', async ({ auth, inertia }) => {
        const craftingLists = await CraftingList.query()
          .preload('items', (query) => {
            query.pivotColumns(['quantity'])
            query.preload('resources', (resourceQuery) => {
              resourceQuery.pivotColumns(['quantity_required'])
            })
          })
          .where('userId', auth.user!.id)
          .exec()

        const serializedCraftingLists = serializeManyWithPivotDeep(craftingLists, [
          'items',
          'items.resources',
        ])

        const inventory = await ResourceInventory.query()
          .where('userId', auth.user!.id)
          .join('resources', 'resource_inventories.resource_id', 'resources.id')
          .orderBy('resources.name', 'asc')
          .select('resource_inventories.*')
          .preload('resource')

        return inertia.render('CraftingList/Index', {
          craftLists: serializedCraftingLists,
          inventory,
        })
      })
      .as('crafting-list.index')

    // router.get('/create', async ({ inertia }) => {
    //   const items = await Item.all()
    //   return inertia.render('CraftingList/Create', { availableItems: items })
    // })

    router.get('/:id', async ({ params, auth, inertia }) => {
      const craftingList = await CraftingList.query()
        .where('id', params.id)
        .andWhere('userId', auth.user!.id)
        .preload('items', (query) => {
          query.pivotColumns(['quantity'])
          query.preload('resources', (resourceQuery) => {
            resourceQuery.pivotColumns(['quantity_required'])
          })
        })
        .firstOrFail()

      const serializedCraftingList = serializeWithPivotDeep(craftingList, [
        'items',
        'items.resources',
      ])

      const user = await User.query()
        .where('id', auth.user!.id)
        .preload('resourceInventories', (query) => {
          query.preload('resource')
        })
        .firstOrFail()

      return inertia.render('CraftingList/Show', {
        craftList: serializedCraftingList,
        inventory: user.resourceInventories,
      })
    })

    router
      .post('/', async ({ request, response, auth }) => {
        const { items, name, redirectRoute, redirectRouteOptions } = request.only([
          'items',
          'name',
          'redirectRoute',
          'redirectRouteOptions',
        ])

        console.log({ items, name })

        const craftingList = await CraftingList.create({ userId: auth.user!.id, name })

        for (const item of items) {
          await craftingList.related('items').attach({
            [item.id]: {
              quantity: item.quantity,
            },
          })
        }

        return response
          .redirect()
          .toRoute(redirectRoute || 'crafting-list.index', redirectRouteOptions?.params)
      })
      .as('crafting-list.add')

    function transformArrayToObject(array: any[], key: string) {
      return array.reduce((acc, item) => {
        acc[item.id] = { [key]: item[key] }
        return acc
      }, {})
    }

    router
      .put('/:id', async ({ params, request, response }) => {
        const craftingList = await CraftingList.findOrFail(params.id)
        const { items, name, redirectRoute, redirectRouteOptions } = request.only([
          'items',
          'name',
          'redirectRoute',
          'redirectRouteOptions',
        ])

        craftingList.merge({ name })
        await craftingList.save()
        console.log('items', items)
        const updatedItems = transformArrayToObject(items, 'quantity')
        await craftingList.related('items').sync(updatedItems)

        console.log('redirectRoute', redirectRoute)
        return response
          .redirect()
          .toRoute(redirectRoute || 'crafting-list.index', redirectRouteOptions?.params || {})
      })
      .as('crafting-list.update')

    router
      .delete('/:id', async ({ params, response }) => {
        console.log('delete', params.id)
        const craftingList = await CraftingList.findOrFail(params.id)
        await craftingList.delete()
        return response.redirect().toRoute('crafting-list.index')
      })
      .as('crafting-list.delete')
  })
  .prefix('/crafting-list')
  .use(middleware.auth())

router
  .group(() => {
    // router
    //   .get('/', async ({ inertia, auth }) => {
    //     const inventory = await ResourceInventory.query()
    //       .where('userId', auth.user!.id)
    //       .preload('resource')

    //     const availableResources = await Resource.all()

    //     return inertia.render('Inventory/Index', { inventory, availableResources })
    //   })
    //   .as('inventory.index')

    router.post('/', async ({ request, response, auth }) => {
      const { resource, quantity, redirectRoute, redirectRouteOptions } = request.only([
        'resource',
        'quantity',
        'redirectRoute',
        'redirectRouteOptions',
      ])

      console.log({ resource, quantity })
      await ResourceInventory.updateOrCreate(
        { userId: auth.user!.id, resourceId: resource.id },
        { quantity }
      )

      return response
        .redirect()
        .toRoute(redirectRoute || '/crafting-list', redirectRouteOptions?.params || {})
    })

    // router
    //   .delete('/:id', async ({ params, response }) => {
    //     const resourceInventory = await ResourceInventory.query()
    //       .where('resource_id', params.id)
    //       .firstOrFail()
    //     await resourceInventory.delete()
    //     return response.redirect().toRoute('inventory.index')
    //   })
    //   .as('inventory.delete')
  })
  .prefix('/inventory')
  .use(middleware.auth())

router
  .group(() => {
    router.post('/resource', async ({ request, response }) => {
      try {
        const data = request.only(['name', 'externalId', 'price', 'type', 'isCraftable'])
        const newResource = await Resource.create(data)
        response.json(newResource)
      } catch (error) {
        response.json(error)
      }
    })

    router.delete('/resource/table', async ({ response }) => {
      try {
        await Resource.query().delete()
        response.json({ message: 'All resources deleted' })
      } catch (error) {
        response.json(error)
      }
    })

    router.post('/item', async ({ request, response }) => {
      try {
        const data = request.only(['externalId', 'name', 'type', 'level', 'recipe'])
        console.log('data', data)
        const createItemData = {
          externalId: data.externalId,
          name: data.name,
          type: data.type,
        }
        const newItem = await Item.create(createItemData)
        for (const resource of data.recipe) {
          const dbResource = await Resource.findByOrFail('externalId', resource.id)
          if (dbResource) {
            await newItem.related('resources').attach({
              [dbResource.id]: {
                quantity_required: resource.quantity,
              },
            })
          }
        }
        response.json(newItem)
      } catch (error) {
        console.log('error', error)
        response.json(error)
      }
    })

    router.delete('/item/table', async ({ response }) => {
      try {
        await Item.query().delete()
        response.json({ message: 'All items deleted' })
      } catch (error) {
        response.json(error)
      }
    })

    router.delete('/item/:id', async ({ params, response }) => {
      try {
        const item = await Item.findOrFail(params.id)
        await item.delete()
        response.json({ message: 'Item deleted' })
      } catch (error) {
        response.json(error)
      }
    })

    router.get('/item/:id', async ({ params, response }) => {
      try {
        const items = await Item.query().where('externalId', params.id).preload('resources').exec()
        response.json(items)
      } catch (error) {
        response.json(error)
      }
    })
  })
  .prefix('/api')
  .use(middleware.api())
