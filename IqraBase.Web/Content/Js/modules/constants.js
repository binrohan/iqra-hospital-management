export const objectToArray = (object) => {
    const array = [];
    
    for (const key in object) {
        array.push({ text: object[key], value: object[key] });            
    }

    return array;
}

export const OPERATION_STAGES = [
    { text: 'Initialted', value: 'Initialted'  },
    { text: 'Pre Operation Stage', value: 'Pre Operation Stage' },
    { text: 'Post Operation Stage', value: 'Post Operation Stage' },
    { text: 'Running', value: 'Running' },
    { text: 'Cancelled', value: 'Cancelled' },
    { text: 'Finished', value: 'Finished' }
];

export const SURGERY_TYPE = [
    { text: 'Package', value: 'Package' },
    { text: 'Non Package', value: 'Non Package' }
];

export const SURGON_STATUS_DICT = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive'
}
