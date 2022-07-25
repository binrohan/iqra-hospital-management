export const tabBuilder = (...tabConfigs) => {
    return tabConfigs.map(tc => ({
        Id: new Date() + Math.random(),
        Name: tc.title.toLowerCase(),
        Title: tc.title,
        filter: tc.filters || [],
        remove: tc.remove || false,
        actions: tc.actions,
        onDataBinding: tc.dataBinding || (() => { }),
        rowBound: tc.rowBound || (() => { }),
        columns: tc.columns || [],
        Printable: tc.printable || { container: $('void') },
        Url: tc.url || 'Get',
    }));
}

export const testModule = () => {
    alert("From Module");
}
