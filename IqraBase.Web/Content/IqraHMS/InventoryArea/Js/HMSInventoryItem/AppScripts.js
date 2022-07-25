
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            HMSInventoryItemId: model.Id,
            name: 'HMSInventoryItemDetails',
            url: '/Content/IqraHMS/InventoryArea/Js/HMSInventoryItem/OnDetails.js',
        });
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
        Name: 'HMSInventoryItem',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', title: 'Name', filter: true, click: onDetails },
                { field: 'UnitName', title: 'Unit', sorting: false, filter: true, Add: false },
                { field: 'UnitPrice', title: 'Unit Price', filter: true },
                { field: 'MinStockToAlert', title: 'Min Stock To Alert', filter: true },
                { field: 'UsedDaysForPurchaseRequired', title: 'Used Days For Purchase Required', required: false},
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'Remarks', title: 'Remarks', required: false, sorting: false }
                    
            ],
            //Actions: [{
            //    click: onAddOrderCategory,
            //    html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
            //}],
            url: '/InventoryArea/HMSInventoryItem/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} HMSInventoryItems ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/InventoryArea/HMSInventoryItem/Create',
            saveChange: '/InventoryArea/HMSInventoryItem/Edit',
            dropdownList: [
                {
                    Id: 'InventoryUnitId',
                    position: 2,
                    url: '/InventoryArea/InventoryUnit/AutoComplete',
                    TYPE: 'AutoComplete'
                }
            ],
        },
        remove: { save: '/InventoryArea/HMSInventoryItem/Delete' }
    });
})();;
                