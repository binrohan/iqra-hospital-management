
(function () {
    var service = {}, windowModel, dataModel, formModel = {}, filters = Global.Filters().Bind({
        container: $('#filter_container'),
        type : 'ThisMonth',
        formModel: formModel,
        onchange: function (filter) {
            service.Loader.Load();
        }
    });
    (function () {
        var headers = [
            'Not Define', 'PurchaseInfo', 'Suplier Payment', 'Daily Inventory', 'Sale Return', 'Inventory Adjustment',
            'Advance Salary', 'Employee Salary', 'Employee Loan', 'Expense', 'Opening Balance',
            'Manual Journal', 'Bank Transfer', 'Purchase Cancel', 'Suplier Return'
        ];
        function set(list) {
            list.each(function () {
                var model = dataModel[this.AccountId] || dataModel[this.CategoryId];
                model.Items.push(this);
                if (dataModel[this.CategoryId].isCredit) {
                    model.Value += this.Credit - this.Debit;
                } else {
                    model.Value += this.Debit - this.Credit;
                }
            });
        }
        this.Load = function () {
            var to = '?from=' + filters[0].value + '&to=' + filters[1].value;
            Global.CallServer('/AccountantArea/IncomeStatement/Get' + to, function (response) {
                if (!response.IsError) {
                    dataModel = {
                        SalesRevenue: { Items: [], Value: 0, Id: response.Data[1][0].Accounts.SalesRevenue },
                        SaleDiscount: { Items: [], Value: 0, Id: response.Data[1][0].Accounts.SaleDiscount },
                        CashMismatch: { Items: [], Value: 0, Id: response.Data[1][0].Accounts.CashMismatch },
                        CostOfGoodsSold: { Items: [], Value: 0, Id: response.Data[1][0].Accounts.CostOfGoodsSold },
                        Revenue: { Items: [], Value: 0, Id: response.Data[1][0].Accounts.Revenue,isCredit:true },
                        Expense: { Items: [], Value: 0, Id: response.Data[1][0].Accounts.Expense, isCredit: false },
                    };
                    console.log(dataModel);
                    dataModel[dataModel.SalesRevenue.Id] = dataModel.SalesRevenue;
                    dataModel[dataModel.SaleDiscount.Id] = dataModel.SaleDiscount;
                    dataModel[dataModel.CashMismatch.Id] = dataModel.CashMismatch;
                    dataModel[dataModel.CostOfGoodsSold.Id] = dataModel.CostOfGoodsSold;
                    dataModel[dataModel.Revenue.Id] = dataModel.Revenue;
                    dataModel[dataModel.Expense.Id] = dataModel.Expense;


                    set(response.Data[0]);
                    service.View.Create(response.Data);
                } else {
                    Global.Error.Show(response, '');
                }
            }, function (response) {
                windowModel.Free();
                response.Id = -8;
                alert(' Errors');
            }, null, 'Get');
        };
    }).call(service.Loader = {});
    (function () {
        var container, view = {};
        function onDetails(model) {
            console.log(model);
            Global.Add({
                name: 'DailyInOutDetails',
                url: '/Content/IqraPharmacy/AccountantArea/Content/DailyInOut/ItemDetails.js',
                model: model,
                Date: formModel.Date
            });
        };
        function opening() {
            container.append('<tr>' +
                '<td>Day Opening Balance </td>' +
                '<td></td>' +
                '<td></td>' +
                '<td class="text-right">' + formModel.BeforeBalance.toMoney() + '</td>' +
                '<td class="text-right lead">' + formModel.BeforeBalance.toMoney() + '</td>' +
            '</tr>');
        };
        function createCash(list, total, field) {
            field = field || 'Debit';
            if (list.length == 0) {
                list.push({ Head: '', Debit: 0, Credit: 0 });
            }
            list.each(function (i) {
                if (i === 0) {
                    var rowSpan = 'rowspan = "' + list.length + '"'
                    container.append(Global.Click($('<tr>' +
                '<td class="lead" ' + rowSpan + '>' + (field === 'Debit' ? "Cash In" : "Cash Out") + '</td>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + this.Head + '</td>' +
                '<td class="text-right">' + this[field].toMoney() + '</td>' +
                '<td class="text-right lead" ' + rowSpan + '>' + total.toMoney() + '</td>' +
            '</tr>'), onDetails, this));
                } else {
                    container.append(Global.Click($('<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + this.Head + '</td>' +
                '<td class="text-right">' + this[field].toMoney() + '</td>' +
            '</tr>'), onDetails, this));
                }
            });
        };
        function closing() {
            container.append('<tr>' +
                '<td>Day Closing Balance </td>' +
                '<td></td>' +
                '<td></td>' +
                '<td class="text-right">' + formModel.AfterBalance.toMoney() + '</td>' +
                '<td class="text-right lead">' + formModel.AfterBalance.toMoney() + '</td>' +
            '</tr>');
        };
        this.Create = function (list) {
            container = container || $('#data_container');

            view.Revenue.Set();
            view.Expense.Set();
            view.LossProfit.Set();
        };
        (function () {
            var selfContainer, items = [],netProfit=0;
            function setSale() {
                var model = { "Name": "Net Sales", "Group": "Net Sales", "Credit": 0, Debit:0 };
                model.Credit =netProfit= dataModel.SalesRevenue.Value - dataModel.SaleDiscount.Value - dataModel.CashMismatch.Value;
                items.push(model);
                dataModel.Revenue.Items.each(function () {
                    items.push(this);
                });
                netProfit += dataModel.Revenue.Value;
            };
            function setItemView() {
                var view = selfContainer.find('.section_item_container').empty(),elm;
                items.each(function (i) {
                    elm = $('<div class="col-md-1 index">'+
                            (i+1)+'. '+
                            '</div>'+
                            '<div class="col-md-8">'+
                            this.Name+
                            '</div>'+
                            '<div class="col-md-3 total">'+
                            (this.Credit - this.Debit).toMoney()+
                            '</div>');  
                    view.append(elm);
                });
            };
            function setTotalView() {
                var view = selfContainer.find('.section_total_container').empty(), elm;

                elm = $('<div class="col-md-9 index">' +
                            'Net Profit' +
                            '</div>' +
                            '<div class="col-md-3 total">' +
                            netProfit.toMoney() +
                            '</div>');
                view.append(elm);
            };
            function setGrossItemView() {
                var view = selfContainer.find('.section_gross_item_container').empty(), elm, total = 0;
                elm = $('<div class="col-md-9 index">' +
                            'Cost Of Good Sold' +
                            '</div>' +
                            '<div class="col-md-3 total">' +
                            '(-) '+dataModel.CostOfGoodsSold.Value.toMoney() +
                            '</div>');
                view.append(elm);
            };
            function setGrossTotalView() {
                var view = selfContainer.find('.section_gross_total_container').empty(), elm, total = 0;
                dataModel.Revenue.GrossProfit=(netProfit - dataModel.CostOfGoodsSold.Value);
                elm = $('<div class="col-md-9 index">' +
                            'Gross Profit' +
                            '</div>' +
                            '<div class="col-md-3 total">' +
                            dataModel.Revenue.GrossProfit.toMoney() +
                            '</div>');
                view.append(elm);
            };
            this.Set = function () {
                items = [];
                netProfit = 0;
                selfContainer = selfContainer || container.find('#revenue_section');
                setSale();
                setItemView();
                setTotalView();
                setGrossItemView();
                setGrossTotalView();
            };
        }).call(view.Revenue = {});
        (function () {
            var selfContainer, items = [], dic = {};
            function setData() {
                var model ;
                dataModel.Expense.Items.each(function () {
                    model = dic[this.GroupId];
                    if (!model) {
                        model = dic[this.GroupId] = { Name: this.Group, Value: 0, GroupId: this.GroupId };
                        items.push(model);
                    }
                    model.Value += this.Debit;
                });
            };
            function setItemView() {
                var view = selfContainer.find('.section_item_container').empty(), elm;
                items.each(function (i) {
                    elm = $('<div class="col-md-1 index">' +
                            (i + 1) + '. ' +
                            '</div>' +
                            '<div class="col-md-8">' +
                            this.Name +
                            '</div>' +
                            '<div class="col-md-3 total">' +
                            this.Value.toMoney() +
                            '</div>');
                    view.append(elm);
                });
            };
            function setTotalView() {
                var view = selfContainer.find('.section_total_container').empty(), elm;

                elm = $('<div class="col-md-9 index">' +
                            'Total Expense ' +
                            '</div>' +
                            '<div class="col-md-3 total">' +
                            dataModel.Expense.Value.toMoney() +
                            '</div>');
                view.append(elm);
            };
            this.Set = function () {
                items = [];
                dic = {};
                selfContainer = selfContainer || container.find('#expense_section');
                setData();
                setItemView();
                setTotalView();
            };
        }).call(view.Expense = {});
        (function () {
            var selfContainer;
            function setItemView() {
                var view = selfContainer.find('.section_item_container').empty(), elm;
                elm = $('<div class="col-md-9 index">' +
                            'Gross Profit' +
                            '</div>' +
                            '<div class="col-md-3 total">' +
                            dataModel.Revenue.GrossProfit.toMoney() +
                            '</div>');
                view.append(elm);
                elm = $('<div class="col-md-9 index">' +
                            'Total Expense ' +
                            '</div>' +
                            '<div class="col-md-3 total">' +
                            '(-) '+dataModel.Expense.Value.toMoney() +
                            '</div>');
                view.append(elm);
            };
            function setTotalView() {
                var view = selfContainer.find('.section_total_container').empty(), elm,text='Profit',sign='';
                dataModel.Profit = dataModel.Revenue.GrossProfit - dataModel.Expense.Value;
                if (dataModel.Profit < 0) {
                    text = "Loss";
                    sign = "(-) ";
                }
                elm = $('<div class="col-md-9 index">' +
                            text +
                            '</div>' +
                            '<div class="col-md-3 total">' +
                            sign+Math.abs(dataModel.Profit).toMoney() +
                            '</div>');
                view.append(elm);
            };
            this.Set = function () {
                selfContainer = selfContainer || container.find('#loss_profit_section');
                setItemView();
                setTotalView();
            };
        }).call(view.LossProfit = {});
    }).call(service.View = {});
    service.Loader.Load();
})();
