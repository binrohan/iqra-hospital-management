
var Controller = new function () {
    var service = {}, windowModel, callerOptions, formModel = {},
                from = { field: 'CreatedAt', value: "", Operation: 2 },
        to = { field: 'CreatedAt', value: "", Operation: 3 };
    function close() {
        windowModel && windowModel.Hide();
    };
    function show() {
        var date = Global.DateTime.GetObject(callerOptions.model.CreatedAt + '/01', 'yyyy/MM/dd');
        from.value = "'" + date.format('yyyy/MM/dd') + ' 00:00' + "'";
        date.setMonth(date.getMonth() + 1);
        to.value = "'" + date.format('yyyy/MM/dd') + ' 00:00' + "'";
        callerOptions.filter.push(from);
        callerOptions.filter.push(to);
        windowModel.Show();
        service.Tab.Bind();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ComparisonArea/Templates/MonthlyOrderComparisionDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                Global.Form.Bind(formModel, windowModel.View.find('#filter_container_details'));
                windowModel.View.find('.btn_cancel').click(close);
                show();
            }, noop);
        }
    };
    (function () {
        function onDataBinding(response, model) {
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
                setBind.call(this, 4, counterGridModel, isBind, 'counter', 'Counter',
                    'CounterWise', 'CounterWiseDetails.js', [from, to],
                    function (model) {
                        gridModel = counterGridModel = model;
                    });
                isBind = true;
            };
        }).call(service.CounterWise = {});
        this.Bind = function () {
            Global.Click(windowModel.View.find('#btn_suplier_wise_details'), service.SuplierWise.Bind);
            Global.Click(windowModel.View.find('#btn_counter_wise_details'), service.CounterWise.Bind);
            Global.Click(windowModel.View.find('#btn_day_wise_details'), service.Daily.Bind);
            service.Daily.Bind.call(windowModel.View.find('#btn_day_wise_details')[0]);
        };


        function resetTab() {
            windowModel.View.find('.tab_taggle,.btn_add_print').hide();
            windowModel.View.find('.button_container_details .btn-active').removeClass('btn-active');
        };
        function onDetails(model, detailUrl) {
            Global.Add({
                model: model,
                dataBinding: onDataBinding,
                columns: gridModel.columns,
                filter: gridModel.page.filter.slice(),
                url: '/Content/IqraPharmacy/ComparisonArea/Content/' + detailUrl,
            });
        };
        function set(name) {
            windowModel.View.find('#' + name + '_grid_details, #btn_' + name + '_print').show();
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
                setGrid(name, field, dataUrl, detailUrl, callerOptions.filter, complete);
            } else {
                gridModel.page.filter = callerOptions.filter;
                gridModel.Reload();
            }

        };
        function setGrid(name, field, dataUrl, detailUrl, filter, complete) {
            Global.Grid.Bind({
                elm: windowModel.View.find('#' + name + '_grid_details'),
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
                url: '/ComparisonArea/OrderCompare/' + dataUrl,
                page: { 'PageNumber': 1, 'PageSize': 50, filter: filter },
                pagger: { showingInfo: ' {0}-{1} of {2} Items ' },
                dataBinding: function (response) {
                    onDataBinding(response, formModel);
                },
                onComplete: complete,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('.empty_style.button_container_details');
                    },
                    html: '<a id="btn_' + name + '_print" class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                },
            });
        };
    }).call(service.Tab = {});
};