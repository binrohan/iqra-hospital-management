
(function () {
    var that = this, gridModel, types = ['No Tax', 'Tax Included', 'Tax Excluded'];
    function onUserDetails(model) {
        Global.Add({
            UserId: model.CreatedBy,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function getTypeFileter() {
        return {
            DropDown: {
                dataSource: [
                    { value: '0', text: 'No Tax' },
                    { value: 1, text: 'Tax Included' },
                    { value: 2, text: 'Tax Excluded' }
                ]
            }
        };
    };
    function onDataBinding(data) {
        data.Data.Data.each(function () {
            this.TaxType = types[this.TaxType]||'';
        });
    };
    function onRowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    Global.Grid.Bind({
        elm: $('#grid'),
        Name: 'ManualJournal',
        columns: [
            { field: 'TaxType', title: 'Tax Type', filter: getTypeFileter(), Operation: 0 },
            { field: 'Debit', type: 2 },
            { field: 'Credit', type: 2 },
            { field: 'DebitTax', title: 'Tax Expense', type: 2 },
            { field: 'CreditTax', title: 'Tax Payable', type: 2 },
            { field: 'Amount', title: 'Amount', type: 2 },
            { field: 'Creator', filter: true },
            { field: 'CreatedAt', Add: false, selected: false, dateFormat: 'dd/MM/yyyy hh:mm' },
            { field: 'Remarks', filter: true, selected: false }
        ],
        url: '/AccountantArea/ManualJournal/Get',
        page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} ManualJournals ' },
        dataBinding: onDataBinding,
        rowbound: onRowBound,
        //Actions: [{
        //    click: onEdit,
        //    html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-edit"></span></span>'
        //}],
        onComplete: function (model) {
            gridModel = model;
        },
    });
    Global.Click($('#btn_add_new'), function () {
        Global.Add({
            name: 'OnAddManualJournal',
            url: '/Content/IqraPharmacy/AccountantArea/Content/ManualJournal/AddManualJournal.js',
            OnSuccess: function () {
                gridModel.Reload();
            }
        });
    });
})();
