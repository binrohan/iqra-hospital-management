
(function () {
    var that = this, gridModel, service = {}, formModel = {};
    function onDataBinding(response) {
        //{"Total":6,"Deposit":51000,"Withdraw":36000}
        
        response.Data.Data.each(function () {
            //this.Amount = this.Amount.toMoney();
        });
    };
    function onRowBound(elm) {
        if (!this.IsEditable) {
            elm.find('.icon_container').remove();
        }
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    Global.List.Bind({
        Name: 'BankTransaction',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'AccountName', title: 'Account', filter: true },
                { field: 'OpeningDebit', title: 'Debit',type:2 },
                { field: 'OpeningCredit', title: 'Credit', type: 2 }
            ],
            url: '/AccountantArea/OpeningBalance/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Accountss ' },
            onDataBinding: onDataBinding,
            rowbound: onRowBound,
            Actions: [
                //{
                //click: onEdit,
                //html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
                //}
            ]
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: false
    });
    (function () {
        Global.Click($('#btn_add_opening_balance'), function () {
            Global.Add({
                name: 'SetOpeningBalance',
                url: '/Content/IqraPharmacy/AccountantArea/Content/OpeningClosingBalance/AddOpeningBalance.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        });
    })();
})();
