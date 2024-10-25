export function serializeWithPivot(model) {
    if (!model)
        return model;
    const serialized = typeof model.serialize === 'function' ? model.serialize() : { ...model };
    if (!model.$extras)
        return serialized;
    const pivotFields = Object.entries(model.$extras)
        .filter(([key]) => key.startsWith('pivot_'))
        .reduce((acc, [key, value]) => {
        const cleanedKey = key
            .replace('pivot_', '')
            .split('_')
            .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
            .join('');
        return { ...acc, [cleanedKey]: value };
    }, {});
    return {
        ...serialized,
        ...pivotFields,
    };
}
export function serializeWithPivotDeep(model, relations = []) {
    if (!model)
        return model;
    const serialized = serializeWithPivot(model);
    relations.forEach((relation) => {
        const relationParts = relation.split('.');
        const currentRelation = relationParts[0];
        const nextRelations = relationParts.slice(1);
        if (model[currentRelation]) {
            if (Array.isArray(model[currentRelation])) {
                serialized[currentRelation] = model[currentRelation].map((item) => serializeWithPivotDeep(item, nextRelations.length ? [nextRelations.join('.')] : []));
            }
            else {
                serialized[currentRelation] = serializeWithPivotDeep(model[currentRelation], nextRelations.length ? [nextRelations.join('.')] : []);
            }
        }
    });
    return serialized;
}
export function serializeManyWithPivotDeep(models, relations = []) {
    return models.map((model) => serializeWithPivotDeep(model, relations));
}
//# sourceMappingURL=serializer.js.map