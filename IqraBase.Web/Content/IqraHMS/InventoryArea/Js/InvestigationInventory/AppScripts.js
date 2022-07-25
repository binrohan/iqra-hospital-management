
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onHMSInventoryItemDetails(model) {
        Global.Add({
            HMSInventoryItemId: model.HMSInventoryItemId,
            name: 'HMSInventoryItemDetails',
            url: '/Content/IqraHMS/InventoryArea/Js/HMSInventoryItem/OnDetails.js',
        });
    };
    function onInvestigationDetails(model) {
        Global.Add({
            InvestigationId: model.InvestigationId,
            name: 'InvestigationDetails',
            url: '/Content/IqraHMS/InvestigationArea/Js/Investigation/OnDetails.js',
        });
    }
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
        Name: 'InvestigationInventory',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'InvestigationName', title: 'Investigation Name', filter: true, Add: false, click: onInvestigationDetails },
                { field: 'HMSInventoryItemName', title: 'Inventory Item Name', filter: true, Add: false, click: onHMSInventoryItemDetails },
                { field: 'Quantity', title: 'Quantity', filter: true, Add: {dataType:'float'} },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm', Add: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy hh:mm', Add: false },
                { field: 'Remarks', title: 'Remarks', required: false, Add: {type:'textarea',sibling:1} }
            ],
            url: '/InventoryArea/InvestigationInventory/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} InvestigationInventory ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/InventoryArea/InvestigationInventory/Create',
            saveChange: '/InventoryArea/InvestigationInventory/Edit',
            dropdownList: [
                {
                    Id: 'InvestigationId',
                    position: 2,
                    url: '/InvestigationArea/Investigation/AutoComplete',
                    TYPE: 'AutoComplete'
                },
                {
                    Id: 'HMSInventoryItemId',
                    position: 3,
                    url: '/InventoryArea/HMSInventoryItem/AutoComplete',
                    TYPE: 'AutoComplete'
                }

            ],
        },
        remove: { save: '/InventoryArea/InvestigationInventory/Delete' }
    });
})();;
