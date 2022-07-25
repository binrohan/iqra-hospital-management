
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            model: { CounterId: model.Id },
            name: 'CounterDetails',
            url: '/Content/IqraPharmacy/ProductArea/Content/Counter/CounterDetails.js',
        });
    };
    function onDataBinding(data) {
        var types = ['Pharmacy', 'Pharmacy', 'None-Pharmacy'];
        data.Data.Data.each(function () {
            this.TypeText = types[this.Type] || 'Pharmacy';
        });
    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Counter',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', filter: true, position: 1, Click: onDetails },
                { field: 'TypeText', Add: false,sortField:'Type' },
                { field: 'Description', filter: true, position: 2, Add: {sibling:1,type:'textarea'} },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
                { field: 'Creator', required: false, filter: true, Add: false },
                { field: 'Updator', required: false, filter: true, Add: false }
            ],
            url: '/ProductArea/Counter/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Categories ' },
            onDataBinding: onDataBinding,
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/ProductArea/Counter/Create',
            saveChange: '/ProductArea/Counter/Edit',
            dropdownList: [
                {
                    Id: 'Type',
                    position: 1,
                    dataSource: [
                        { text: 'Pharmacy', value: '1' },
                        { text: 'None-Pharmacy', value: '2' }
                    ]
                }
            ]
        },
        remove: { save: '/ProductArea/Counter/Delete' }
    });

})();
