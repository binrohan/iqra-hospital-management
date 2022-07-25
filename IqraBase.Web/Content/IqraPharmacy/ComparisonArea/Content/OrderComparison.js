
(function () {
    var that = this, gridModel, voucherGridModel, formModel = {}, service = {}, date = new Date(),
        from = { field: 'CreatedAt', value: "'" + date.format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 2 },
        to = { field: 'CreatedAt', value: "'" + new Date(date.setDate(new Date().getDate() + 1)).format('yyyy/MM/dd') + ' 00:00' + "'", Operation: 3 };
    function resetTab() {
        $('.tab_taggle,.btn_add_print').hide();
        $('.button_container .btn-active').removeClass('btn-active');
    };
    function onDataBinding(response,model) {
        model.OrderPrice = (response.Data.Total.OrderPrice || 0).toMoney(4);
        model.PurchasePrice = (response.Data.Total.PurchasePrice || 0).toMoney(4);
        model.SalePrice = (response.Data.Total.SalePrice || 0).toMoney(4);
        response.Data.Total = response.Data.Total.Total;
        response.Data.Data.each(function () {
            this.Difference = (this.OrderPrice - this.PurchasePrice).toMoney();
            this.OrderPrice = this.OrderPrice.toMoney();
            this.PurchasePrice = this.PurchasePrice.toMoney();
            this.PurchaseDiscount = this.PurchaseDiscount.toMoney();
            this.SalePrice = this.SalePrice.toMoney();
            this.SaleDiscount = this.SaleDiscount.toMoney();
        });
    };
    function onRowBound(elm) {
    };
    (function () {
        var dailyGridModel, isBind;
        this.Bind = function () {
            setBind.call(this, 1, dailyGridModel, isBind, 'daily', 'CreatedAt',
                'GetDaily', 'DailyOrderComparisionDetails.js', [from, to],
                function (model) {
                    gridModel = dailyGridModel = model;
                });
            isBind = true;
        };
    }).call(service.Daily = {});
    (function () {
        var monthlyGridModel, isBind;
        this.Bind = function () {
            setBind.call(this, 2, monthlyGridModel, isBind, 'monthly', 'CreatedAt',
    'GetMonthly', 'MonthlyDetails.js', [from, to],
    function (model) {
        gridModel = monthlyGridModel = model;
    });
            isBind = true;
        };
    }).call(service.Monthly = {});
    (function () {
        var suplierGridModel, isBind;

        this.Bind = function () {
            setBind.call(this, 3, suplierGridModel, isBind, 'suplier', 'Suplier',
                'SuplierWise', 'SuplierWiseDetails.js', [from, to],
                function (model) {
                    gridModel = suplierGridModel = model;
                });
            isBind = true;
        };
    }).call(service.SuplierWise = {});
    (function () {
        var counterGridModel, isBind;
        this.Bind = function () {
            setBind.call(this,4, counterGridModel, isBind, 'counter', 'Counter',
                'CounterWise', 'CounterWiseDetails.js', [from, to],
                function (model) {
                    gridModel = counterGridModel = model;
                });
            isBind = true;
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
                from.value = "'" + formModel.From + ' 00:00' + "'";
                filter.push(from);
            }
            if (formModel.To) {
                to.value = "'" + formModel.To + ' 00:00' + "'";
                filter.push(to);
            }
            gridModel.page.filter = filter;
            gridModel.Reload();
        };
        Global.DatePicker.Bind($(inputs['From']), { format: 'yyyy/MM/dd', onChange: onChange });
        Global.DatePicker.Bind($(inputs['To']), { format: 'yyyy/MM/dd', onChange: onChange });
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
            formModel.From = fromDate.format('yyyy/MM/dd');
            formModel.To = new Date(today.setDate(today.getDate() + 1)).format('yyyy/MM/dd');
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
        Global.Click($('#btn_suplier_wise'), service.SuplierWise.Bind);
        Global.Click($('#btn_counter_wise'), service.CounterWise.Bind);
        Global.Click($('#btn_day_wise'), service.Daily.Bind);
        Global.Click($('#btn_month_wise'), service.Monthly.Bind);
        service.CounterWise.Bind.call($('#btn_counter_wise')[0]);
    })();

    function onDetails(model, detailUrl) {
        Global.Add({
            model: model,
            dataBinding: onDataBinding,
            columns:gridModel.columns,
            filter: gridModel.page.filter.slice(),
            url: '/Content/IqraPharmacy/ComparisonArea/Content/' + detailUrl,
        });
    };
    function set(name) {
        $('#' + name + '_grid, #btn_' + name + '_print').show();
        gridModel && gridModel.Reload();
    };
    function setBind(type, grid, isBind, name, field, dataUrl, detailUrl, filter, complete) {
        if (service.Type === type)
            return;
        service.Type = type;
        resetTab();
        gridModel = grid;
        set(name);
        $(this).addClass('btn-active');
        if (!isBind) {
            setGrid(name, field, dataUrl, detailUrl, filter, complete);
        }
    };
    function setGrid(name, field, dataUrl, detailUrl, filter, complete) {
        Global.Grid.Bind({
            elm: $('#'+name+'_grid'),
            columns: [
                        {
                            field: field, filter: true, click: function (model) {
                                onDetails(model, detailUrl);
                            }
                        },
                        { field: 'OrderPrice', title: 'Order Price' },
                        { field: 'PurchasePrice', title: 'Purchase Price' },
                        { field: 'Difference', sorting: false },
                        { field: 'PurchaseDiscount', title: 'Purchase Discount' },
                        { field: 'SalePrice', title: 'Sale Price' },
                        { field: 'SaleDiscount', title: 'Sale Discount' }
            ],
            url: '/ComparisonArea/OrderCompare/'+dataUrl,
            page: { 'PageNumber': 1, 'PageSize': 50, filter: filter },
            pagger: { showingInfo: ' {0}-{1} of {2} Items ' },
            dataBinding: function (response) {
                onDataBinding(response, formModel);
            },
            onComplete: complete,
            Printable: {
                Container: function () {
                    return $('.empty_style.button_container');
                },
                html: '<a id="btn_' + name + '_print" class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
            },
        });
    };
})();