var Controller = new function () {
    var formModel = {}, callarOptions = {}, windowModel, service = {}, gridModel,
    from = { field: 'CreatedAt', value: '', Operation: 2 },
    to = { field: 'CreatedAt', value: '', Operation: 3 },
    saleFrom = { field: 'from', value:'', Operation: 2 },
    saleTo = { field: 'to', value: '', Operation: 3 };

    function cancel() {
        windowModel.Hide(function () {
        });
    };
    function show() {
        windowModel.Show();
        service.Bind();
    };
    function onComputerDetails(model) {
        Global.Add({
            ComputerId: model.ComputerId,
            name: 'ComputerDetails',
            url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
        });
    };
    function onCreatorDetails(model) {
        Global.Add({
            UserId: model.CreatedBy || model.Id,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onUpdatorDetails(model) {
        Global.Add({
            UserId: model.UpdatedBy,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, { width: '98%' });
        Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        service.Set();
        show();
    };
    this.Show = function (opts) {
        callarOptions = opts;
        from.value = callarOptions.from;
        to.value = callarOptions.to;
        saleFrom.value = callarOptions.from;
        saleTo.value = callarOptions.to;

        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/DailyItemSaleDetails.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
    (function () {
        function setSummary(model) {
            formModel.TotalSale = (model.SalePrice + model.Discount).toMoney();
            formModel.TotalDiscount = model.Discount.toMoney();
            formModel.TotalReturn = model.ReturnAmount.toMoney();
            formModel.TotalCash = (model.SalePrice - model.ReturnAmount).toMoney();
            formModel.TradePrice = model.TradePrice.toMoney();
            formModel.TradeMargin = (model.SalePrice - model.TradePrice).toMoney();
            formModel.TotalVoucher = model.Items.toMoney();
        };
        function onDataBinding(data) {
            setSummary(data.Data.Total);
            data.Data.Total = data.Data.Total.Total;
            data.Data.Data.each(function () {
                this.TotalCash = (this.SalePrice - this.ReturnAmount).toMoney();
                this.TradeMargin = (this.SalePrice - this.TradePrice).toMoney();
                this.ReturnAmount = this.ReturnAmount.toMoney();
                this.SalePrice = (this.SalePrice + this.Discount).toMoney();
                this.TradePrice = this.TradePrice.toMoney();
                this.Discount = this.Discount.toMoney();
            });
        };
        this.Get = function () {
            return {
                Name: 'Employee-Wise',
                Url: '/EmployeeArea/Employee/GetReportData',
                filter: [saleFrom,saleTo],
                columns: [
                            { field: 'Name', title: 'Employee', click: onCreatorDetails },
                            { field: 'SalePrice', title: 'Sale' },
                            { field: 'Discount', title: 'Discount', className: 'hide_on_mobile' },
                            { field: 'TradePrice', title: 'TP Price' },
                            { field: 'ReturnAmount', title: 'Return' },
                            { field: 'TotalCash', title: 'Cash', sorting: false },
                            { field: 'TradeMargin', title: 'Trade Margin', sorting: false, className: 'hide_on_mobile' },
                ],
                binding: onDataBinding,
                //bound: onRowBound
            }
        };
    }).call(service.EmployeeWise = {});
    (function () {
        function onDetails(model) {
            Global.Add({
                name: 'SaleInfo',
                url: '/Content/IqraPharmacy/ItemSalesArea/Content/SaleDetails.js',
                SaleInfoId: model.Id
            });
        };
        function onDataBinding(data) {
            var totalPrice = 0, totalDiscount = 0
            data.Data.Data.each(function () {
                totalPrice += this.SalePrice;
                totalDiscount += this.Discount;
            });
            //formModel.TotalPrice = 'TotalPrice : ' + totalPrice;
            //formModel.TotalDiscount = 'TotalDiscount : ' + totalDiscount;
        };
        this.Get = function () {
            return {
                Name: 'Voucher-Wise',
                Url: '/ItemSalesArea/ItemSales/Get',
                filter: [from, to],
                columns: [
                    { field: 'VoucherNo', title: 'Voucher', filter: true, click: onDetails },
                    { field: 'Customer', filter: true },
                    { field: 'ItemCount', title: 'Items', width: 60 },
                    { field: 'SalePrice' },
                    { field: 'TradePrice' },
                    { field: 'Discount', width: 70 },
                    { field: 'Computer', click: onComputerDetails },
                    { field: 'Creator', filter: true, Add: false, Click: onCreatorDetails },
                    { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                ],
                binding: onDataBinding,
                //bound: onRowBound
            }
        };
    }).call(service.VoucherWise = {});
    (function () {
        var model;
        this.Set = function () {
            model = {
                container: windowModel.View,
                Base: {
                    Url: '',
                },
                items: [
                    service.EmployeeWise.Get(),
                    service.VoucherWise.Get(),
                ]
            };
            Global.Tabs(model);
        };
        this.Bind = function () {
            model.items[0].set(model.items[0]);
            console.log(model);
        }
    }).call(service);
};

