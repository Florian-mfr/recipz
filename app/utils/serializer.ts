// app/Utils/SerializerUtils.ts

type AnyObject = { [key: string]: any }

export function serializeWithPivot<T extends AnyObject>(model: T): AnyObject {
  if (!model) return model

  // Récupérer l'objet sérialisé de base
  const serialized = typeof model.serialize === 'function' ? model.serialize() : { ...model }

  // Si pas d'extras, retourner l'objet tel quel
  if (!model.$extras) return serialized

  // Parcourir les $extras pour trouver les champs pivot
  const pivotFields = Object.entries(model.$extras)
    .filter(([key]) => key.startsWith('pivot_'))
    .reduce((acc, [key, value]) => {
      // Transformer pivot_field_name en fieldName
      const cleanedKey = key
        .replace('pivot_', '')
        .split('_')
        .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
        .join('')

      return { ...acc, [cleanedKey]: value }
    }, {})

  return {
    ...serialized,
    ...pivotFields,
  }
}

// Version pour gérer les relations imbriquées
export function serializeWithPivotDeep<T extends AnyObject>(
  model: T,
  relations: string[] = []
): AnyObject {
  if (!model) return model

  const serialized = serializeWithPivot(model)

  // Parcourir les relations demandées
  relations.forEach((relation) => {
    const relationParts = relation.split('.')
    const currentRelation = relationParts[0]
    const nextRelations = relationParts.slice(1)

    if (model[currentRelation]) {
      if (Array.isArray(model[currentRelation])) {
        serialized[currentRelation] = model[currentRelation].map((item) =>
          serializeWithPivotDeep(item, nextRelations.length ? [nextRelations.join('.')] : [])
        )
      } else {
        serialized[currentRelation] = serializeWithPivotDeep(
          model[currentRelation],
          nextRelations.length ? [nextRelations.join('.')] : []
        )
      }
    }
  })

  return serialized
}

export function serializeManyWithPivotDeep<T extends AnyObject>(
  models: T[],
  relations: string[] = []
): AnyObject[] {
  return models.map((model) => serializeWithPivotDeep(model, relations))
}
