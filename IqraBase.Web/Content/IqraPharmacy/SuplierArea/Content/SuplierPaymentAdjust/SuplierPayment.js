
(function () {
    var that = this, gridModel, voucherGridModel, formModel = {}, service = {}, date = new Date(),
        from = { field: 'CreatedAt', value: "'" + date.format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 2 },
        to = { field: 'CreatedAt', value: "'" + new Date(date.setDate(new Date().getDate() + 1)).format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 3 };
    function resetTab() {
        $('.tab_taggle,.btn_add_print').hide();
        $('.button_container .btn-active').removeClass('btn-active');
    };
    function onDetails(model) {
        Global.Add({
            PurchaseId: model.PurchaseId,
            name: 'PurchaseDetails',
            url: '/Content/IqraPharmacy/ProductPurchaseArea/Content/PurchaseDetails.js',
        });
    };
    function onSuplierDetails(model) {
        Global.Add({
            SuplierId: model.SuplierId,
            name: 'SuplierDetails',
            url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
        });
    };
    function onUserDetails(Id) {
        Global.Add({
            UserId: Id,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    };
    function onApproverDetails(model) {
        onUserDetails(model.ApprovedBy);
    };
    function onApprove(model) {
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'Approve Payment',
                msg: 'Are you sure you want to Approve this Payment?',
                save: '/ExpenseArea/SuplierPayment/Approve',
                data: { Id: model.Id },
                onsavesuccess: function () {
                    gridModel.Reload();
                }, onerror: function (response) {

                },
            }
        });
    };
    function onDataBinding(response) {
        formModel.Bill = (response.Data.Total.TradePrice || 0).toMoney(4);
        formModel.Paid = (response.Data.Total.PaidAmount || 0).toMoney(4);
        formModel.DueAmount = (response.Data.Total.DueAmount || 0).toMoney(4);
        response.Data.Total = response.Data.Total.Total;
        response.Data.Data.each(function () {
            if (!this.Approver) {
                this.ApprovedAt = '';
            }
            this.PaidAmount = this.PaidAmount.toFloat();
            this.TradePrice = this.TradePrice.toFloat();
            this.DueAmount = this.DueAmount.toFloat();
            this.TradePriceStr = (this.TradePrice || 0).toMoney(4);
            this.PaidAmountStr = (this.PaidAmount || 0).toMoney(4);
            this.DueAmountStr = (this.DueAmount || 0).toMoney(4);

        });
        //data.Data.Data = list;
    };
    function onRowBound(elm) {
        //var link = $('<a href="/Paid/Picture/' + this.Id + '"><img src="/Paid/Picture/' + this.Id + '" style="max-width: 100px; max-height:100px;"/></a>');
        //elm.find('.picture').append(link);
    };
    function onPaymentAdd(model) {
        Global.Add({
            model: model,
            filter: gridModel.page.filter,
            url: '/Content/IqraPharmacy/ExpenseArea/Content/SuplierPayment/AddSuplierPayment.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    function bind() {
        Global.List.Bind({
            Name: 'SuplierPayment',
            Grid: {
                elm: $('#grid'),
                columns: [
                    { field: 'Suplier', filter: true, Click: onSuplierDetails },
                    { field: 'VoucherNo', filter: true, Click: onDetails },
                    { field: 'TradePriceStr', actionfield: 'TradePrice', title: 'Bill' },
                    { field: 'PaidAmountStr', actionfield: 'PaidAmount', title: 'Paid' },
                    { field: 'DueAmountStr', actionfield: 'DueAmount', title: 'Due',sorting:false },
                    { field: 'CreatedAt', title: 'BillAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                    { field: 'Creator', click: onCreatorDetails, filter: true }
                ],
                Actions: [{
                    click: onPaymentAdd,
                    html: '<a style="margin-right:8px;" title="Change Barcode"><i class="glyphicon glyphicon-plus" aria-hidden="true"></i></a>'
                }],
                url: '/ExpenseArea/SuplierPayment/VoucherWise',
                page: { 'PageNumber': 1, 'PageSize': 10, filter: [from, to], showingInfo: ' {0}-{1} of {2} Payments ' },
                rowBound: onRowBound,
                onDataBinding: onDataBinding,
                Printable: {
                    Container: function () {
                        return $('.empty_style.button_container');
                    },
                    html: '<a id="btn_voucher_print" class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                }
            },
            onComplete: function (model) {
                gridModel = voucherGridModel = model;
            }, Add: false, remove: false, Edit: false
        });
    };
    function itemBind() {
        if (service.Type === 0)
            return;
        service.Type = 0;
        resetTab();
        gridModel = voucherGridModel;
        $('#grid, #btn_voucher_print').show();
        if (voucherGridModel) {
            gridModel.Reload();
        } else {
            bind();
        }
        $(this).addClass('btn-active');
    };
    (function () {
        var dailyGridModel, isBind;
        function set() {
            $('#daily_grid, #btn_daily_print').show();
            gridModel && gridModel.Reload();
        };
        function onDetails(model) {
            Global.Add({
                model: model,
                Date: model.CreatedAt,
                filter: dailyGridModel.page.filter.slice(),
                name: 'DailyPurchaseDetails',
                url: '/Content/IqraPharmacy/ProductPurchaseArea/Content/DailyPurchaseDetails.js',
            });
        };
        this.Bind = function () {
            if (service.Type === 1)
                return;
            service.Type = 1;
            resetTab();
            gridModel = dailyGridModel;
            set();
            $(this).addClass('btn-active');
            if (!isBind) {
                isBind = true;
                Global.Grid.Bind({
                    elm: $('#daily_grid'),
                    columns: [
                        { field: 'CreatedAt', click: onDetails },
                        { field: 'TradePriceStr', actionfield: 'TradePrice', title: 'Bill Amount' },
                        { field: 'PaidAmountStr', actionfield: 'PaidAmount', title: 'Paid Amount' },
                        { field: 'DueAmountStr', actionfield: 'DueAmount', title: 'Due Amount' },
                    ],
                    url: '/ExpenseArea/SuplierPayment/GetDaily',
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: [from, to] },
                    pagger: { showingInfo: ' {0}-{1} of {2} days ' },
                    dataBinding: onDataBinding,
                    onComplete: function (model) {
                        gridModel = dailyGridModel = model;
                    },
                    Printable: {
                        Container: function () {
                            return $('.empty_style.button_container');
                        },
                        html: '<a id="btn_daily_print" class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                });
            }
        };
    }).call(service.Daily = {});
    (function () {
        var monthlyGridModel, isBind;
        function set() {
            $('#monthly_grid, #btn_monthly_print').show();
            gridModel && gridModel.Reload();
        };
        function onDetails(model) {
            Global.Add({
                model: model,
                Date: model.CreatedAt,
                filter: monthlyGridModel.page.filter.slice(),
                name: 'MonthlyPurchaseDetails',
                url: '/Content/IqraPharmacy/ProductPurchaseArea/Content/MonthlyPurchaseDetails.js',
            });
        };
        this.Bind = function () {
            if (service.Type === 2)
                return;
            service.Type = 2;
            resetTab();
            gridModel = monthlyGridModel;
            set();
            $(this).addClass('btn-active');


            if (!isBind) {
                isBind = true;
                Global.Grid.Bind({
                    elm: $('#monthly_grid'),
                    columns: [
                        { field: 'CreatedAt', click: onDetails },
                        { field: 'TradePriceStr', actionfield: 'TradePrice', title: 'Bill Amount' },
                        { field: 'PaidAmountStr', actionfield: 'PaidAmount', title: 'Paid Amount' },
                        { field: 'DueAmountStr', actionfield: 'DueAmount', title: 'Due Amount' },
                    ],
                    url: '/ExpenseArea/SuplierPayment/GetMonthly',
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: [from, to] },
                    pagger: { showingInfo: ' {0}-{1} of {2} Months ' },
                    dataBinding: onDataBinding,
                    onComplete: function (model) {
                        gridModel = monthlyGridModel = model;
                    },
                    Printable: {
                        Container: function () {
                            return $('.empty_style.button_container');
                        },
                        html: '<a id="btn_monthly_print" class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                });
            }
        };
    }).call(service.Monthly = {});
    (function () {
        var suplierGridModel, isBind;
        function set() {
            $('#suplier_grid, #btn_suplier_print').show();
            gridModel && gridModel.Reload();
        };
        function onDetails(model) {
            Global.Add({
                model: model,
                filter: suplierGridModel.page.filter.slice(),
                SuplierId: model.SuplierId,
                url: '/Content/IqraPharmacy/ExpenseArea/Content/SuplierPayment/SuplierWiseDetails.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        this.Bind = function () {
            if (service.Type === 3)
                return;
            service.Type = 3;
            resetTab();
            gridModel = suplierGridModel;
            set();
            $(this).addClass('btn-active');

            if (!isBind) {
                isBind = true;
                Global.Grid.Bind({
                    elm: $('#suplier_grid'),
                    columns: [
                        { field: 'Name', filter: true, click: onDetails },
                        { field: 'TradePriceStr', actionfield: 'TradePrice', title: 'Bill Amount' },
                        { field: 'PaidAmountStr', actionfield: 'PaidAmount', title: 'Paid Amount' },
                        { field: 'DueAmountStr', actionfield: 'DueAmount', title: 'Due Amount' },
                    ],
                    url: '/ExpenseArea/SuplierPayment/SuplierWise',
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: [from, to] },
                    pagger: { showingInfo: ' {0}-{1} of {2} Supliers ' },
                    dataBinding: onDataBinding,
                    Printable: {
                        Container: function () {
                            return $('.empty_style.button_container');
                        },
                        html: '<a id="btn_suplier_print" class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                    onComplete: function (model) {
                        gridModel = suplierGridModel = model;
                    },
                });
            }
        };
    }).call(service.SuplierWise = {});
    (function () {
        var counterGridModel, isBind;
        function set() {
            $('#counter_grid, #btn_counter_print').show();
            gridModel && gridModel.Reload();
        };
        function onDetails(model) {
            Global.Add({
                model: model,
                filter: counterGridModel.page.filter.slice(),
                url: '/Content/IqraPharmacy/ExpenseArea/Content/SuplierPayment/CounterWiseDetails.js',
            });
        };
        this.Bind = function () {
            if (service.Type === 4)
                return;
            service.Type = 4;
            resetTab();
            gridModel = counterGridModel;
            set();
            $(this).addClass('btn-active');

            if (!isBind) {
                isBind = true;
                Global.Grid.Bind({
                    elm: $('#counter_grid'),
                    columns: [
                        { field: 'Counter', filter: true, click: onDetails },
                        { field: 'TradePriceStr', actionfield: 'TradePrice', title: 'Bill Amount' },
                        { field: 'PaidAmountStr', actionfield: 'PaidAmount', title: 'Paid Amount' },
                        { field: 'DueAmountStr', actionfield: 'DueAmount', title: 'Due Amount' },
                    ],
                    url: '/ExpenseArea/SuplierPayment/CounterWise',
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: [from, to] },
                    pagger: { showingInfo: ' {0}-{1} of {2} Counters ' },
                    dataBinding: onDataBinding,
                    onComplete: function (model) {
                        gridModel = counterGridModel = model;
                    },
                    Printable: {
                        Container: function () {
                            return $('.empty_style.button_container');
                        },
                        html: '<a id="btn_counter_print" class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                });
            }
        };
    }).call(service.CounterWise = {});
    (function () {
        var inputs = Global.Form.Bind(formModel, $('#filter_container'));
        function onChange() {
            var filter = [];
            if (!gridModel)
                return;
            gridModel.page.filter = gridModel.page.filter || [];
            (gridModel.page.filter || []).each(function () {
                if (this.field != 'CreatedAt') {
                    filter.push(this);
                }
            });
            if (formModel.From) {
                from.value = "'" + formModel.From + "'";
                filter.push(from);
            }
            if (formModel.To) {
                to.value = "'" + formModel.To + "'";
                filter.push(to);
            }
            gridModel.page.filter = filter;
            gridModel.Reload();
        };
        Global.DatePicker.Bind($(inputs['From']), { format: 'yyyy/MM/dd HH:mm', onChange: onChange });
        Global.DatePicker.Bind($(inputs['To']), { format: 'yyyy/MM/dd HH:mm', onChange: onChange });
        function onPeriodChange(data) {
            var today = new Date(), fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()), today = new Date(fromDate);
            switch (data.value) {
                case 'Yesterday':
                    fromDate.setDate(fromDate.getDate() - 1);
                    today = new Date(fromDate);
                    break;
                case 'ThisWeek':
                    fromDate.setDate(fromDate.getDate() - fromDate.getDay());
                    break;
                case 'LastWeek':
                    today.setDate(fromDate.getDate() - fromDate.getDay());
                    fromDate.setDate(fromDate.getDate() - 7);
                    break;
                case 'ThisMonth':
                    fromDate.setDate(1);
                    break;
                case 'LastMonth':
                    today.setDate(0);
                    fromDate = new Date(fromDate);
                    fromDate.setMonth(fromDate.getMonth() - 1);
                    fromDate.setDate(1);
                    break;
                case 'ThisYear':
                    fromDate.setMonth(0);
                    fromDate.setDate(1);
                    break;
                case 'LastOneYear':
                    fromDate.setFullYear(fromDate.getFullYear() - 1);
                    break;
                case 'LastYear':
                    today.setMonth(0);
                    today.setDate(0);
                    fromDate = new Date(today);
                    fromDate.setMonth(0);
                    fromDate.setDate(1);
                    break;
            }
            formModel.From = fromDate.format('yyyy/MM/dd') + ' 00:00';
            formModel.To = new Date(today.setDate(today.getDate() + 1)).format('yyyy/MM/dd') + ' 00:00';
            onChange();
        };
        $(inputs['Period']).val('Today');
        Global.DropDown.Bind({
            Id: 'PeriodId',
            dataSource: [{ text: 'Today', value: 'Today' },
                { text: 'Yesterday', value: 'Yesterday' }, { text: 'This Week', value: 'ThisWeek' },
                { text: 'Last Week', value: 'LastWeek' }, { text: 'This Month', value: 'ThisMonth' },
                { text: 'Last Month', value: 'LastMonth' }, { text: 'This Year', value: 'ThisYear' },
                { text: 'Last One Year', value: 'LastOneYear' }, { text: 'Last Year', value: 'LastYear' }],
            elm: $(inputs['Period']),
            change: onPeriodChange,

        });
    }).call(service.Filter = {});
    (function () {
        //Global.Click($('#btn_add_new'), onAdd);
        Global.Click($('#btn_voucher_wise'), itemBind);
        Global.Click($('#btn_suplier_wise'), service.SuplierWise.Bind);
        Global.Click($('#btn_counter_wise'), service.CounterWise.Bind);
        Global.Click($('#btn_day_wise'), service.Daily.Bind);
        Global.Click($('#btn_month_wise'), service.Monthly.Bind);
        service.CounterWise.Bind.call($('#btn_counter_wise')[0]);
    })();
})();