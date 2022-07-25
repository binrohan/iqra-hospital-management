

(function () {
    var gridModel, userId, selfService = {},dataSource=[], selectedDate = new Date(), formModel = {},
        filter = { field: 'CreatedAt', Operation: 2 };
    function rowBound(elm) {

    };
    function onDataBinding(response) {

    };
    function onItemDetails(model) {
        Global.Add({
            ItemId: model.ItemId,
            name: 'ProductDetails',
            url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
        });
    };
    function onChange(date) {
        if (date && gridModel) {
            filter.value = date.format("'yyyy/MM/dd 00:00'");
            gridModel.Reload();
        }
    };
    $('#date').val(selectedDate.format('yyyy/MM/dd 00:00'));
    Global.DatePicker.Bind($('#date'), { format: 'yyyy/MM/dd hh:mm', onChange: onChange });
    filter.value = selectedDate.format("'yyyy/MM/dd 00:00'");
    Global.List.Bind({
        Name: 'ItemInventory',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'TradeName', title: 'Trade Name', filter: true, click: onItemDetails },
                { field: 'Strength', filter: true },
                { field: 'Category', filter: true },
                { field: 'Suplier', filter: true },
                { field: 'TotalStock', title: 'Stock Qnt' },
                { field: 'RequiredQuentity', title: 'Required Qnt' },
                {
                    field: 'Type', title: 'Alert Type', filter: {
                        DropDown: {
                            dataSource: [
                                { text: 'Select Type', value: '' },
                                { text: 'Empty Stock', value: '0' },
                                { text: 'Missmatch', value: '1' },
                                { text: 'Special Order', value: '2' }
                            ]
                        }
                    }
                },
                { field: 'Creator', filter: true },
                { field: 'Computer', filter: true }
            ],
            url: '/InventoryArea/InventoryAlert/Get',
            page: { "PageNumber": 1, "PageSize": 10, filter: [filter] },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Action: { width: 60 },
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: false
    });
})();