
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
        Name: 'InventoryUnit',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', title: 'Name', filter: true },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'Remarks', title: 'Remarks', required: false, sorting: false }
                    
            ],
            //Actions: [{
            //    click: onAddOrderCategory,
            //    html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
            //}],
            url: '/InventoryArea/InventoryUnit/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} InventoryUnits ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/InventoryArea/InventoryUnit/Create',
            saveChange: '/InventoryArea/InventoryUnit/Edit',
        },
        remove: { save: '/InventoryArea/InventoryUnit/Delete' }
    });
})();;
                