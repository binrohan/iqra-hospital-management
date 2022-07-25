

var Controller = new function () {
    var service = {}, windowModel, callerOptions, formModel = {}
    from = { field: 'CreatedAt', value: "", Operation: 2 },
    to = { field: 'CreatedAt', value: "", Operation: 3 };

    function close() {
        windowModel && windowModel.Hide();
    };
    function show() {
        var date = Global.DateTime.GetObject(callerOptions.model.CreatedAt, 'yyyy/MM/dd');
        from.value = "'" + date.format('yyyy/MM/dd') + ' 00:00' + "'";
        date.setDate(date.getDate() + 1);
        to.value = "'" + date.format('yyyy/MM/dd') + ' 00:00' + "'";
        callerOptions.filter.push(from);
        callerOptions.filter.push(to);
        windowModel.Show();
        service.Grid.Bind();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ComparisonArea/Templates/ComparisionReportDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                Global.Form.Bind(formModel, windowModel.View.find('.button_container'));
                windowModel.View.find('.btn_cancel').click(close);
                show();
            }, noop);
        }
    };
    (function () {
        var gridModel, statuses = ['Initiated', 'Received', 'Qnt', 'Price', 'Qnt & Price', 'Item', 'Item & Qnt', 'Item & Price', 'All Changed', '', '', 'Canceled'];
        function onDetails(model) {
            Global.Add({
                OrderId: model.OrderId,
                name: 'OrderDetails',
                url: '/Content/IqraPharmacy/ProductOrderArea/Content/OrderDetails.js',
            });
        };
        function setSummary(model) {
            formModel.OrderPrice = (model.OrderPrice).toMoney();
            formModel.PurchasePrice = model.PurchasePrice.toMoney();
        };
        function onDataBinding(data) {
            setSummary(data.Data.Total);
            data.Data.Total = data.Data.Total.Total;
            data.Data.Data.each(function () {
                this.OrderPrice = this.OrderPrice || 0;
                this.PurchasePrice = this.PurchasePrice || 0;
                this.OrderedQuentity = this.OrderedQuentity || 0;
                this.PurchaseQuentity = this.PurchaseQuentity || 0;
                this.PriceChanged = (this.PurchasePrice - this.OrderPrice).toMoney();
                this.OrderedQuentity = this.PurchaseQuentity + ' - ' + this.OrderedQuentity + ' = ' + (this.PurchaseQuentity - this.OrderedQuentity);
                this.OrderPrice = this.OrderPrice.toMoney();
                this.PurchasePrice = this.PurchasePrice.toMoney();
                this.Status = statuses[this.Status] || '';
            });
        };

        function onSelect(model) {
            Global.Add({
                model: model,
                name: 'Details',
                url: '/Content/IqraPharmacy/ComparisonArea/Content/ComparisonDetailController.js',
            });
        };
        function rowBound(elm) {
            Global.Click(elm, onSelect, this);
        };
        function getOptions() {
            var opts =
            {
                elm: windowModel.View.find('#report_detail_grid'),
                columns: [
                            { field: 'Voucher', Click: onDetails },
                            { field: 'OrderedQuentity', title: 'Ordered Item', width: 130 },
                            { field: 'OrderPrice', },
                            { field: 'PurchasePrice' },
                            { field: 'PriceChanged', sorting: false },
                            { field: 'MarginDiscount' },
                            { field: 'Status', title: 'Change Type' },
                            { field: 'OrderedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'PurchasedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                ],
                url: '/ComparisonArea/OrderCompare/Get',
                page: { 'PageNumber': 1, filter: callerOptions.filter.where('itm=>itm.field != "Suplier"'), 'PageSize': 50, showingInfo: ' {0}-{1} of {2} Items ' },
                dataBinding: onDataBinding,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#comparision_report_details .button_container');
                    },
                    html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                }
            }
            return opts;
        };
        this.Bind = function () {
            if (!gridModel) {
                Global.Grid.Bind(getOptions());
            } else {
                gridModel.page.filter = callerOptions.filter.where('itm=>itm.field != "Suplier"');
                gridModel.Reload();
            }
        }
    }).call(service.Grid = {});
};
