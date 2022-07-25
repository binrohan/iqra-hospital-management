Global.DatePicker.ServerFormat = 'dd/MM/yyyy hh:mm';
var Controller = new function () {
    var service = {}, windowModel, callerOptions, formModel = {},
         date = new Date(),
        from = { field: 'CreatedAt', value: "", Operation: 2 },
        to = { field: 'CreatedAt', value: "", Operation: 3 };
    function close() {
        windowModel && windowModel.Hide();
    };
    function show() {
        var date = Global.DateTime.GetObject(callerOptions.Date + '/01', 'yyyy/MM/dd');
        from.value = "'" + date.format('yyyy/MM/dd') + ' 00:00' + "'";
        date.setMonth(date.getMonth() + 1);
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
            Global.LoadTemplate('/Content/IqraPharmacy/ProductPurchaseArea/Templates/DailyPurchaseDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                Global.Form.Bind(formModel, windowModel.View.find('.button_container'));
                windowModel.View.find('.btn_cancel').click(close);
                show();
            }, noop);
        }
    };
    (function () {
        var gridModel, date;

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
        function onBaseDataBinding(response) {
            formModel.TotalTP = (response.Data.Total.TotalTP || response.Data.Total.TradePrice || 0).toMoney(4);
            response.Data.Total = response.Data.Total.Total;
        };
        function rowBound(elm) {
            var link = '="/Pharmacy/PharmacyItemReceive/Picture?Id=' + this.Id + '" '
            $(elm.find('td')[0]).html('<a href' + link + ' target="_blank"><img src' + link + 'style="max-width: 100px; max-height: 100px;"></a>');
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#daily_purchase_grid'),
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
                page: { 'PageNumber': 1, 'PageSize': 50, filter: callerOptions.filter },
                pagger: { showingInfo: ' {0}-{1} of {2} purchases ' },
                dataBinding: onBaseDataBinding,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#daily_purchase_details .button_container');
                    },
                    html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                },
            };
            return opts;
        };
        this.Bind = function () {
            if (!gridModel) {
                date = callerOptions.Date;
                Global.Grid.Bind(getOptions());
            } else {
                gridModel.page.filter = callerOptions.filter;
                gridModel.Reload();
            }
        }
    }).call(service.Grid = {});
};