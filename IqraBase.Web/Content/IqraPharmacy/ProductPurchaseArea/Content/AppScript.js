
(function () {
    var that = this, gridModel, voucherGridModel, formModel = {};
    var opts = {
        name: 'Received',
        url: addScriptUrl,
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    var service = {}, date = new Date(),
        from = { field: 'CreatedAt', value: "'" + new Date(date.setDate(1)).format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 2 },
        to = { field: 'CreatedAt', value: "'" + new Date(date.setDate(new Date().getDate() + 1)).format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 3 },
        filters = typeof window.ItemType == 'undefined' ? [from, to] : [from, to, { field: 'Type', value: ItemType, Operation: 0 }];
    function resetTab() {
        $('.tab_taggle,.btn_add_print').hide();
        $('.button_container .btn-active').removeClass('btn-active');
    };
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onAdd() {
        opts.model = undefined;
        Global.Add(opts);
    };
    function onEdit(model) {
        opts.model = model;
        Global.Add(opts);
    };
    function onBaseDataBinding(response) {
        formModel.TotalTP = (response.Data.Total.TotalTP || response.Data.Total.TradePrice || 0).toMoney(4);
        response.Data.Total = response.Data.Total.Total;
        console.log(response);
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            this.TradePrice = (this.TradePrice || 0).toMoney();
            this.ItemCount = (this.ItemCount || 0).toMoney();
            this.TotalDiscount = (this.TotalDiscount || 0).toMoney();
            this.SalePrice = (this.SalePrice || 0).toMoney();
        });
        onBaseDataBinding(response);
    };
    function rowBound(elm) {
        var link = '="/Pharmacy/PharmacyItemReceive/Picture?Id=' + this.Id + '" '
        $(elm.find('td')[0]).html('<a href' + link + ' target="_blank"><img src' + link + 'style="max-width: 100px; max-height: 100px;"></a>');
        if (this.Status === 11) {
            elm.find('.action .icon_container').remove();
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDetails(model) {
        Global.Add({
            PurchaseId: model.Id,
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
    Global.List.Bind({
        Name:'PurchaseInfo',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Image', title: 'Image', filter: false, sorting: false },
                { field: 'VoucherNo', title: 'Voucher', filter: true, Click: onDetails },
                { field: 'Suplier', filter: true, Click: onSuplierDetails },
                { field: 'Creator', filter: true },
                { field: 'Discount' },
                { field: 'VAT' },
                { field: 'TradePrice', title: 'Trade Price' },
                { field: 'MarginDiscount', title: 'Margin Discount' },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
            ],
            url: '/PharmacyItemReceive/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, filter: filters, showingInfo: ' {0}-{1} of {2} Received Info ' },
            onDataBinding: onBaseDataBinding,
            rowBound: rowBound,
            onComplete: function (model) {
                gridModel = voucherGridModel = model;
            },
            Printable: {
                Container: function () {
                    return $('.empty_style.button_container');
                },
                html: '<a id="btn_voucher_print" class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
            }
        },
        add: false,
        Edit: false,
        remove: {
            save: '/ProductPurchaseArea/Purchase/Cancel'
        }
    });
    function itemBind() {
        if (service.Type === 0)
            return;
        service.Type = 0;
        resetTab();
        gridModel = voucherGridModel;
        $('#grid, #btn_voucher_print').show();
        gridModel.Reload();
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
                                { field: 'ItemCount' },
                                { field: 'TradePrice' },
                                { field: 'TotalDiscount' },
                                { field: 'SalePrice' }
                    ],
                    url: '/ProductPurchaseArea/Purchase/GetDaily',
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: filters.slice() },
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
                                { field: 'ItemCount' },
                                { field: 'TradePrice' },
                                { field: 'TotalDiscount' },
                                { field: 'SalePrice' }
                    ],
                    url: '/ProductPurchaseArea/Purchase/GetMonthly',
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: filters.slice() },
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
                name: 'DailyPurchaseDetails',
                url: '/Content/IqraPharmacy/ProductPurchaseArea/Content/SuplierWisePurchaseDetails.js',
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
                                { field: 'ItemCount' },
                                { field: 'TradePrice' },
                                { field: 'TotalDiscount' },
                                { field: 'SalePrice' }
                    ],
                    url: '/ProductPurchaseArea/Purchase/SuplierWise',
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: filters.slice() },
                    pagger: { showingInfo: ' {0}-{1} of {2} Supliers ' },
                    dataBinding: onDataBinding,
                    onComplete: function (model) {
                        gridModel = suplierGridModel = model;
                    },
                    Printable: {
                        Container: function () {
                            return $('.empty_style.button_container');
                        },
                        html: '<a id="btn_suplier_print" class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                    },
                });
            }
        };
    }).call(service.SuplierWise = {});
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
            if (formModel.PurchaseFrom) {
                from.value = "'" + formModel.PurchaseFrom + "'";
                filter.push(from);
            }
            if (formModel.PurchaseTo) {
                to.value = "'" + formModel.PurchaseTo + "'";
                filter.push(to);
            }
            gridModel.page.filter = filter;
            gridModel.Reload();
        };
        Global.DatePicker.Bind($(inputs['PurchaseFrom']), { format: 'yyyy/MM/dd HH:mm', onChange: onChange });
        Global.DatePicker.Bind($(inputs['PurchaseTo']), { format: 'yyyy/MM/dd HH:mm', onChange: onChange });
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
            formModel.PurchaseFrom = fromDate.format('yyyy/MM/dd') + ' 00:00';
            formModel.PurchaseTo = new Date(today.setDate(today.getDate() + 1)).format('yyyy/MM/dd') + ' 00:00';
            onChange();
        };
        $(inputs['Period']).val('ThisMonth');
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
        Global.Click($('#btn_add_new'), onAdd);
        Global.Click($('#btn_voucher_wise'), itemBind);
        Global.Click($('#btn_suplier_wise'), service.SuplierWise.Bind);
        Global.Click($('#btn_day_wise'), service.Daily.Bind);
        Global.Click($('#btn_month_wise'), service.Monthly.Bind);
    })();
})();
