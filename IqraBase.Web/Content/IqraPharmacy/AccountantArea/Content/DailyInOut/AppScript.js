
(function () {
    var that = this, gridModel;
    function onDataBinding(data) {
        data.Data.Data.each(function () {
            this.BeforeBalance = this.BeforeBalance.toMoney();
            this.In = this.In.toMoney();
            this.Out = this.Out.toMoney();
            this.AfterBalance = this.AfterBalance.toMoney();
        });
        //data.Data.Total = data.Data.Total.Total;
    };
    function onRowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDetails(model) {
        console.log(model);
        Global.Add({
            name: 'InOutDetails',
            url: '/Content/IqraPharmacy/AccountantArea/Content/DailyInOut/Details.js',
            model: model
        });
    };
    Global.List.Bind({
        Name: 'Account',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Date', dateFormat: 'dd/MM/yyyy' },
                { field: 'BeforeBalance', title: 'Before Balance' },
                { field: 'In', title: 'Cash In' },
                { field: 'Out', title: 'Cash Out' },
                { field: 'AfterBalance', title: 'After Balance' },
                { field: 'Remarks', filter: true },
                { field: 'Creator', filter: true },
                //{ field: 'Approver', filter: true }
            ],
            url: '/AccountantArea/DailyInOut/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} items ' },
            onDataBinding: onDataBinding,
            rowbound: onRowBound,
            Actions: [{
                click: onDetails,
                html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-open"></span></span>'
            }]
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit: false,
        remove: false
    });

    Global.Click($('#btn_add_new'), function () {
        Global.Add({
            name: 'AddDailyInOut',
            url: '/Content/IqraPharmacy/AccountantArea/Content/DailyInOut/AddNew.js',
            OnSuccess: function () {
                gridModel.Reload();
            }
        });
    });
})();
