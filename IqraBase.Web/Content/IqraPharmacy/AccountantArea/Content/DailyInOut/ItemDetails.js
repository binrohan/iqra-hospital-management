var Controller = new function () {
    var that = this, formModel = {}, callarOptions = {}, windowModel, service = {}, gridModel,
        from = { field: 'CreatedAt', value: "", Operation: 2 },
        to = { field: 'CreatedAt', value: "", Operation: 3 };
    function reset() {
        windowModel.View.find('.daily_in_out_details_grid').hide();
    };
    function cancel() {
        windowModel.Hide(function () {
        });
    };
    function show() {
        windowModel.Show();
        from.value = "'" + callarOptions.Date.format('yyyy/MM/dd') + ' 00:00' + "'"
        to.value = "'" + new Date(callarOptions.Date.setDate(callarOptions.Date.getDate() + 1)).format('yyyy/MM/dd') + ' 00:00' + "'"
        reset();
        service.Utill.Bind();
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, { width: '98%' });
        formInputs = Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);

        show();
    };
    this.Show = function (opts) {
        opts.Date = Global.DateTime.GetObject(opts.Date, 'dd/MM/yyyy');
        console.log(opts);
        callarOptions = opts;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/AddDailyInOutDetails.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
    (function () {
        var dataUrls = [
'#',
'/ProductPurchaseArea/Purchase/Get',
'/ExpenseArea/SuplierPayment/ByItem', // Url For SuplierPayment
'/EmployeeArea/Employee/GetReportData',// Url For Daily Sale
'Sale Return', 'Inventory Adjustment',
'Advance Salary', 'Employee Salary', 'Employee Loan',
'/ExpenseArea/Expense/Get',// Url For Expense
'Opening Balance',
'/AccountantArea/ManualJournal/Get',// Url For ManualJournal
'/AccountantArea/Bank/Get',// Url For Bank
'Purchase Cancel',
'Suplier Return'
        ];
        var columns = [
            [],
            [],
            //[
            //    { field: 'PaidAmount', title: 'Amount' },
            //    { field: 'Suplier', filter: true, },
            //    { field: 'Description', filter: true },
            //    { field: 'PurchaseAmount' },
            //    { field: 'VoucherNo', filter: true },
            //    { field: 'Creator', className: 'creator' },
            //    { field: 'Approver', className: 'approver' }
            //],
            //[
            //            { field: 'Name', title: 'Employee', click: onCreatorDetails },
            //            { field: 'SalePrice', title: 'Sale' },
            //            { field: 'Discount', title: 'Discount', className: 'hide_on_mobile' },
            //            { field: 'TradePrice', title: 'TP Price' },
            //            { field: 'ReturnAmount', title: 'Return' },
            //            { field: 'TotalCash', title: 'Cash', sorting: false },
            //            { field: 'TradeMargin', title: 'Trade Margin', sorting: false, className: 'hide_on_mobile' },
            //],
        ];
        var attr = [
    'NotDefine', 'PurchaseInfo', 'SuplierPayment', 'DailyInventory', 'SaleReturn', 'InventoryAdjustment',
    'AdvanceSalary', 'EmployeeSalary', 'EmployeeLoan', 'Expense', 'OpeningBalance',
    'ManualJournal', 'BankTransfer', 'PurchaseCancel', 'SuplierReturn'
        ];
        this.getUrl = function (sourceType) {
            return dataUrls[sourceType] || '#';
        };
        this.getUrl = function (sourceType) {

        };
        this.Bind = function () {
            service[attr[callarOptions.model.SourceType]].Bind();
        };
    }).call(service.Utill = {});
    (function () {
        this.Bind = function () {

        };
    }).call(service.NotDefine = {});
    (function () {
        this.Bind = function () {

        };
    }).call(service.PurchaseInfo = {});
    (function () {
        var SuplierPayment;
        function set() {
            formModel.Title = 'Suplier Payment on ' + from.value.substring(0, 11) + "'";
            windowModel.View.find('#suplier_payment').show();
        };
        function onDataBinding(data) {
            data.Data.Data.each(function () {
                this.PaidAmount = this.PaidAmount.toMoney();
                this.PurchaseAmount = this.PurchaseAmount.toMoney();
            });
            formModel.SuplierPaidAmount = (data.Data.Total.PaidAmount || 0).toMoney(4);
            data.Data.Total = data.Data.Total.Total;
        };
        function setGrid() {
            Global.Grid.Bind({
                elm: windowModel.View.find('#suplier_payment_grid'),
                columns: [
                { field: 'Suplier', filter: true },
                { field: 'VoucherNo', filter: true },
                { field: 'PaidAmount', title: 'Amount' },
                { field: 'PurchaseAmount' },
                { field: 'Description', filter: true },
                { field: 'Creator', className: 'creator' },
                { field: 'Approver', className: 'approver' }
                ],
                url: '/ExpenseArea/SuplierPayment/ByItem',
                page: {
                    'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Payments ',
                    filter: [from, to]
                },
                dataBinding: onDataBinding,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#suplier_payment .filter_container');
                    },
                    html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                },
                onComplete: function (model) {
                    gridModel = SuplierPayment = model;
                }
            });
        };
        this.Bind = function () {
            set();
            if (SuplierPayment) {
                gridModel = SuplierPayment;
                SuplierPayment.Reload();
            } else {
                setGrid();
            }
        };
    }).call(service.SuplierPayment = {});
    (function () {
        var dailyInventory;
        function onCreatorDetails(model) {
            Global.Add({
                UserId: model.Id,
                name: 'UserDetails',
                url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
            });
        };
        function set() {
            formModel.Title = 'Sales  on ' + from.value.substring(0, 11) + "'";
            windowModel.View.find('#daily_sale').show();
        };
        function setSummary(model) {
            formModel.TotalSale = (model.SalePrice + model.Discount).toMoney();
            formModel.TotalDiscount = model.Discount.toMoney();
            formModel.TotalReturn = model.ReturnAmount.toMoney();
            formModel.TotalCash = (model.SalePrice - model.ReturnAmount).toMoney();
            formModel.TradePrice = model.TradePrice.toMoney();
            formModel.TradeMargin = (model.SalePrice - model.TradePrice).toMoney();
            formModel.TotalVoucher = model.Items.toMoney();
        };
        function rowBound(elm) {
            Global.Click(elm, function (model) {
                Global.Add({
                    name: 'DailySaleDetails',
                    url: '/Content/IqraPharmacy/AccountantArea/Content/DailyInOut/Details/SaleDetails.js',
                    model: model,
                    from: "'" + model.From + "'",
                    to: "'" + model.To + "'"
                });
            }, this);
        };
        function onDataBinding(data) {
            //setSummary(data.Data.Total);
            //data.Data.Total = data.Data.Total.Total;
            data.Data.Data.each(function () {
                this.SoldPrice = this.SoldPrice.toMoney();
                this.Discount = this.Discount.toMoney();
                this.CashInHand = this.CashInHand.toMoney();
                this.CashInBank = this.CashInBank.toMoney();
                this.CashMismatch = this.CashMismatch.toMoney();
                this.TradePrice = this.TradePrice.toMoney();
                this.PurchaseDiscount = this.PurchaseDiscount.toMoney();
            });
        };
        function setGrid() {
            Global.Grid.Bind({
                elm: windowModel.View.find('#daily_sale_grid'),
                columns: [
            { field: 'From', filter: true, dateFormat: 'yyyy/MM/dd HH:mm' },
            { field: 'To', filter: true, dateFormat: 'yyyy/MM/dd HH:mm' },
            { field: 'SoldPrice', tilte: 'Sold' },
            { field: 'Discount' },
            { field: 'CashInHand', title: 'Cash' },
            { field: 'CashInBank', title: 'Bank' },
            { field: 'CashMismatch', title: 'Mismatch' },
            { field: 'TradePrice', title: 'TP' },
            { field: 'PurchaseDiscount', title: 'TP Discount' },
            { field: 'Description', filter: true }
                ],
                url: '/ItemSalesArea/DailySale/Get',
                page: { 'PageNumber': 1, filter: [from, to], 'PageSize': 50, showingInfo: ' {0}-{1} of {2} Employees ' },
                dataBinding: onDataBinding,
                rowBound: rowBound,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#daily_sale .btn_print_container');
                    },
                    html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                },
                onComplete: function (model) {
                    gridModel = dailyInventory = model;
                }
            });
        };
        this.Bind = function () {
            set();
            if (dailyInventory) {
                gridModel = dailyInventory
                dailyInventory.Reload();
            } else {
                setGrid();
            }
        };
    }).call(service.DailyInventory = {});
    (function () {
        this.Bind = function () {

        };
    }).call(service.SaleReturn = {});
    (function () {
        this.Bind = function () {

        };
    }).call(service.InventoryAdjustment = {});
    (function () {
        this.Bind = function () {

        };
    }).call(service.AdvanceSalary = {});
    (function () {
        this.Bind = function () {

        };
    }).call(service.EmployeeSalary = {});
    (function () {
        this.Bind = function () {

        };
    }).call(service.EmployeeLoan = {});
    (function () {
        var expenseGrid;
        function set() {
            formModel.Title = 'Expense at ' + from.value.substring(0, 11) + "'";
            windowModel.View.find('#expense').show();
        };
        function setImage(model, elm) {
            if (model.FileCount > 1) {
                var link = $('<a href="#"><img src="/Content/Img/folderIcon.png" style="max-width: 100%; max-height:100px;"/></a>');
                elm.find('.picture').append(link);
                Global.Click(link, onFileView, model);
            } else if (model.FileCount == 1) {
                var link = $('<a href="#"><img src="/Expense/Picture/' + model.Id + '" style="max-width: 100%; max-height:100px;"/></a>');
                elm.find('.picture').append(link);
                Global.Click(link, onFileView, model);
            } else if (model.FileCount == 0) {
                elm.find('.picture').append('<img src="/Content/Img/NoImage.png" style="max-width: 100%; max-height:100px;"/>');
            }
        }
        function onRowBound(elm) {
            setImage(this, elm);
        };
        function onDataBinding(response) {
            formModel.ExpenseAmount = (response.Data.Total.Amount || 0).toMoney(4);
            response.Data.Total = response.Data.Total.Total;
            response.Data.Data.each(function () {
                this.Active = this.Active ? "Yes" : "No";
                this.Amount = this.Amount.toMoney();
            });
        };
        function setGrid() {
            Global.Grid.Bind({
                elm: windowModel.View.find('#daily_expense_grid'),
                columns: [
                { field: 'Amount' },
                { field: 'Description', filter: true, },
                { field: 'ResponsibleUser', filter: true },
                { field: '', title: 'Image', className: 'picture' },
                { field: 'Type', filter: true },
                { field: 'Creator', filter: true },
                { field: 'ExpenseAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'Status' }
                ],
                url: '/ExpenseArea/Expense/Get',
                page: {
                    'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Expenses ',
                    filter: [from, to]
                },
                dataBinding: onDataBinding,
                rowBound: onRowBound,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#expense .filter_container');
                    },
                    html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                },
                onComplete: function (model) {
                    gridModel = expenseGrid = model;
                }
            });
        };
        this.Bind = function () {
            set();
            if (expenseGrid) {
                gridModel = expenseGrid;
                expenseGrid.Reload();
            } else {
                setGrid();
            }
        };
    }).call(service.Expense = {});
    (function () {
        this.Bind = function () {

        };
    }).call(service.OpeningBalance = {});
    (function () {
        var manualJournalGrid;
        function set() {
            formModel.Title = 'ManualJournal at ' + from.value.substring(0, 11) + "'";
            windowModel.View.find('#manual_journal').show();
        };
        function onDataBinding(data) {
            data.Data.Data.each(function () {

            });
            //data.Data.Total = data.Data.Total.Total;
        };
        function onRowBound(elm) {

        };
        function setGrid() {
            Global.Grid.Bind({
                elm: windowModel.View.find('#manual_journal_grid'),
                columns: [
                    { field: 'DebitAccount', filter: true },
                    { field: 'Amount', },
                    { field: 'CreditAccount', filter: true },
                    { field: 'Remarks', filter: true }
                ],
                url: '/AccountantArea/ManualJournal/Get',
                page: {
                    'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} ManualJournals ',
                    filter: [from, to]
                },
                dataBinding: onDataBinding,
                rowBound: onRowBound,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#manual_journal .filter_container');
                    },
                    html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                },
                onComplete: function (model) {
                    gridModel = manualJournalGrid = model;
                }
            });
        };
        this.Bind = function () {
            set();
            if (manualJournalGrid) {
                gridModel = manualJournalGrid;
                manualJournalGrid.Reload();
            } else {
                setGrid();
            }
        };
    }).call(service.ManualJournal = {});
    (function () {
        this.Bind = function () {

        };
    }).call(service.BankTransfer = {});
    (function () {
        this.Bind = function () {

        };
    }).call(service.PurchaseCancel = {});
    (function () {
        this.Bind = function () {

        };
    }).call(service.SuplierReturn = {});
};

