var Controller = new function () {
    function onSubmit(formModel, data, isDeposit) {
        if (data) {
            formModel.Id = data.Id
        }
        formModel.IsDeposit = isDeposit;
    };
    this.Show = function (opts) {
        Global.Add({
            name: opts.Name || 'Deposite',
            onSubmit: function (formModel, data) { onSubmit(formModel, data, opts.IsDeposit) },
            save: '/AccountantArea/Bank/AddTransaction',
            columns: [
                { field: 'Amount', add: { dataType: 'float', sibling: 3 }, position: 2 },
                { field: 'CheckNumber', filter: true, required: false, add: { sibling: 3 }, position: 3 },
                { field: 'Descroption', filter: true, required: false, add: { type: 'textarea', sibling: 1 }, position: 10 }
            ],
            onSaveSuccess: opts.onSuccess,
            dropdownList: [{ Id: 'AccountId', position: 1, url: '/AccountantArea/Bank/AutoComplete', Type: 'AutoComplete', add: { sibling: 3 } }]
        });
    };
};

