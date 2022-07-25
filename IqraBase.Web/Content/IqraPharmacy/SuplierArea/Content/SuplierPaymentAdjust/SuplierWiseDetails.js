
var Controller = new function () {
    var service = {}, windowModel, callerOptions, formModel = {},
        suplier = { field: 'SuplierId', value: "", Operation: 0 };
    function close() {
        windowModel && windowModel.Hide();
    };
    function show() {
        suplier.value = callerOptions.model.SuplierId;
        callerOptions.filter.push(suplier);
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
                filter: gridModel.page.filter,
                url: '/Content/IqraPharmacy/ExpenseArea/Content/SuplierPayment/AddSuplierPayment.js',
                onSaveSuccess: function (response) {
                    gridModel.Reload();
                    callerOptions &&callerOptions.onSaveSuccess&&callerOptions.onSaveSuccess(response)
                    
                }
            });
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
        function onDataBinding(response) {
            formModel.BillAmount = (response.Data.Total.TradePrice || 0).toMoney(4);
            formModel.PaidAmount = (response.Data.Total.PaidAmount || 0).toMoney(4);
            formModel.DueAmount = (response.Data.Total.DueAmount || 0).toMoney(4);
            response.Data.Total = response.Data.Total.Total;
        };
        function rowBound(elm) {
            
        };
        function getOptions() {
            var opts = 
            {
                Name: 'CounterWiseDetails',
                Grid: {
                    elm: windowModel.View.find('#report_detail_grid'),
                    columns: [
                            { field: 'Suplier', filter: true, Click: onSuplierDetails },
                            { field: 'VoucherNo', filter: true, Click: onDetails },
                            { field: 'TradePrice', title: 'Bill' },
                            { field: 'PaidAmount', title: 'Paid' },
                            { field: 'DueAmount', title: 'Due' },
                            { field: 'CreatedAt', title: 'BillAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'Creator', click: onCreatorDetails, filter: true }
                    ],
                    url: '/ExpenseArea/SuplierPayment/VoucherWise',
                    page: { 'PageNumber': 1, 'PageSize': 50, filter: callerOptions.filter },
                    pagger: { showingInfo: ' {0}-{1} of {2} Vouchers ' }, Actions: [{
                        click: onPaymentAdd,
                        html: '<a style="margin-right:8px;" title="Change Barcode"><i class="glyphicon glyphicon-plus" aria-hidden="true"></i></a>'
                    }],
                    onDataBinding: onDataBinding,
                    rowBound: rowBound,
                    Printable: false,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: false, Edit: false,
                remove: false
            }
            return opts;
        };
        this.Bind = function () {
            if (!gridModel) {
                Global.List.Bind(getOptions());
            } else {
                gridModel.page.filter = callerOptions.filter;
                gridModel.Reload();
            }
        }
    }).call(service.Grid = {});
};