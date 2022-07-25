
var Controller = new function () {
    var service = {}, windowModel, callerOptions, formModel = {},
        counter = { field: 'CounterId', value: "", Operation: 0 };
    function close() {
        windowModel && windowModel.Hide();
    };
    function show() {
        counter.value = callerOptions.model.CounterId;
        callerOptions.filter.push(counter);
        windowModel.Show();
        service.Grid.Bind();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ExpenseArea/Templates/SuplierPaymentReportDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' });
                Global.Form.Bind(formModel, windowModel.View.find('.button_container'));
                windowModel.View.find('.btn_cancel').click(close);
                show();
            }, noop);
        }
    };
    (function () {
        var gridModel, date;

        function onPaymentAdd(model) {
            Global.Add({
                model: model,
                filter:gridModel.page.filter,
                url: '/Content/IqraPharmacy/ExpenseArea/Content/SuplierPayment/AddSuplierPayment.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        function onDetails(model) {
            Global.Add({
                model: model,
                filter: callerOptions.filter.slice(),
                SuplierId: model.SuplierId,
                url: '/Content/IqraPharmacy/ExpenseArea/Content/SuplierPayment/SuplierWiseDetails.js',
                onSaveSuccess: function () {
                    gridModel.Reload();
                }
            });
        };
        function onSuplierDetails(model) {
            Global.Add({
                SuplierId: model.SuplierId,
                name: 'SuplierDetails',
                url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
            });
        };
        function onDataBinding(response) {
            formModel.BillAmount = (response.Data.Total.TradePrice || 0).toMoney(4);
            formModel.PaidAmount = (response.Data.Total.PaidAmount || 0).toMoney(4);
            formModel.DueAmount = (response.Data.Total.DueAmount || 0).toMoney(4);
            response.Data.Total = response.Data.Total.Total;
            response.Data.Data.each(function () {
                this.TradePrice = (this.TradePrice || 0).toMoney(4);
                this.PaidAmount = (this.PaidAmount || 0).toMoney(4);
                this.DueAmount = (this.DueAmount || 0).toMoney(4);
            });
        };
        function rowBound(elm) {
            
        };
        function getOptions() {
            var opts = 
            {
                elm: windowModel.View.find('#report_detail_grid'),
                columns: [
                        { field: 'Name', filter: true, click: onDetails },
                        { field: 'TradePrice', title: 'Bill Amount' },
                        { field: 'PaidAmount', title: 'Paid Amount' },
                        { field: 'DueAmount', title: 'Due Amount' }
                ],
                url: '/ExpenseArea/SuplierPayment/SuplierWise',
                page: { 'PageNumber': 1, 'PageSize': 50, filter: callerOptions.filter },
                pagger: { showingInfo: ' {0}-{1} of {2} Supliers ' },
                dataBinding: onDataBinding,
                rowBound: rowBound,
                Printable: false,
                onComplete: function (model) {
                    gridModel = model;
                },
            }
            return opts;
        };
        this.Bind = function () {
            if (!gridModel) {
                Global.Grid.Bind(getOptions());
            } else {
                gridModel.page.filter = callerOptions.filter;
                gridModel.Reload();
            }
        }
    }).call(service.Grid = {});
};