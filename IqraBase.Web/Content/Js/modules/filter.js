export const OPERATION_TYPE = {
    EQUAL: 0,
    GREATER_THAN: 1,
    GREATER_OR_EQUAL: 2,
    LESS_THAN: 3,
    LESS_OR_EQUAL: 4,
    CONTAINS: 5,
    STARTS_WITH: 6,
    ENDS_WITH: 7,
    SOUND_EQUAL: 8,
    SOUND_CONTAINS: 9,
    SOUNND_STARTS_WITH: 10,
    SOUND_ENDS_WITH: 11,
    IN: 12,
    NOT_IN: 13,
    NOT_EQUAL: 14
}

export const nonDeletedRecord = { "field": 'IsDeleted', "value": 0, Operation: OPERATION_TYPE.EQUAL }
export const deletedRecord = { "field": 'IsDeleted', "value": 1, Operation: OPERATION_TYPE.EQUAL }

export const filter = (key, value, operation = OPERATION_TYPE.EQUAL) => {
    return { "field": key, "value": value, Operation: operation };
}