export const dropDown = (title, id, source, position, sibling = 2) => {
    
    let  data = {};

    if(Array.isArray(source))
        data = {dataSource: source};
    
    if(typeof source === 'string')
        data = {url: source, type: 'AutoComplete'};

    return {
        title,
        Id: id,
        position,
        add:  { sibling },
        ...data,
    };
}