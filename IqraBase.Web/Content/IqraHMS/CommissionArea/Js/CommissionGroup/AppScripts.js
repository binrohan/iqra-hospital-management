
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'CommissionGroup',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', title: 'Name', filter: true },
                { field: 'MaxCommission', title: 'Max Commission', type: 2, Add: { datatype: 'float' } },
                { field: 'Creator', title: 'Creator', filter: true, Add: false },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm', Add: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy hh:mm', Add: false },
                { field: 'Remarks', title: 'Remarks', required: false, Add: { type: 'textarea', sibling: 1 } }
            ],
            url: '/CommissionArea/CommissionGroup/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Commission Group ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/CommissionArea/CommissionGroup/Create',
            saveChange: '/CommissionArea/CommissionGroup/Edit',
        },
        remove: { save: '/CommissionArea/CommissionGroup/Delete' }
    });
})();;
                