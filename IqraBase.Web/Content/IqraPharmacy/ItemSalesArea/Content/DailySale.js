
(function () {
    function onUserDetails(userId) {
        Global.Add({
            UserId: userId,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    }
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    }
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.Grid.Bind({
        elm: $('#grid'),
        columns: [
            { field: 'From', filter: true, dateFormat: 'dd/MM/yyyy hh:mm' },
            { field: 'To', filter: true, dateFormat: 'dd/MM/yyyy hh:mm' },
            { field: 'SoldPrice', tilte:'Sold',type:2 },
            { field: 'Discount', type: 2 },
            { field: 'ReturnAmount', title: 'Return', type: 2 },
            { field: 'Due', type: 2 },
            { field: 'CashInHand', title: 'Cash', type: 2 },
            { field: 'CashInBank', title: 'Bank', type: 2 },
            { field: 'CashMismatch', title: 'Mismatch' ,type:2},
            { field: 'TradePrice', title: 'TP', type: 2 },
            { field: 'PurchaseDiscount', title: 'TP Discount', type: 2 },
            { field: 'Description',  filter: true ,selected:false},
            { field: 'Approver', filter: true, Click: onCreatorDetails },
            //{ field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
            { field: 'Creator', filter: true, Click: onCreatorDetails, selected: false },
            //{ field: 'UpdatedAt', dateFormat: 'dd/MM/yyyy hh:mm', Add: false },
            { field: 'Updator', filter: true, Click: onUpdatorDetails, selected: false }
        ],
        url: '/ItemSalesArea/DailySale/Get',
        page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Daily Sale  ' },
        dataBinding: onDataBinding,
        onComplete: function (model) {
            gridModel = model;
        }
    });
    Global.Click($('#btn_add_new'), function () {
        Global.Add({
            name: 'AddDailySale',
            url: '/Content/IqraPharmacy/ItemSalesArea/Content/AddDailySale.js',
            OnSuccess: function () {
                gridModel.Reload();
            }
        });
    });
})();
