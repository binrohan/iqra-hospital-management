
(function () {
    var service = {}, windowModel, dataModel, formModel = {};
    (function () {
        var headers = [
            'Not Define', 'PurchaseInfo', 'Suplier Payment', 'Daily Inventory', 'Sale Return', 'Inventory Adjustment',
            'Advance Salary', 'Employee Salary', 'Employee Loan', 'Expense', 'Opening Balance',
            'Manual Journal', 'Bank Transfer', 'Purchase Cancel', 'Suplier Return'
        ];
        function set(list) {
            list.each(function () {
                var model = dataModel[this.CategoryId];
                model.Items.push(this);
                //if (dataModel[this.CategoryId].isCredit) {
                //    model.Value += this.Credit - this.Debit;
                //} else {
                //    model.Value += this.Debit - this.Credit;
                //}
            });
        }
        this.Load = function () {
            Global.CallServer('/AccountantArea/BalanceSheet/Get' , function (response) {
                if (!response.IsError) {
                    dataModel = {};
                    var acnts=response.Data[1][0].Accounts;
                    for (var key in acnts) {
                        dataModel[key] = dataModel[acnts[key]] = { Items: [], Value: 0, Id: acnts[key] };
                    }
                    console.log(dataModel);
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
        function setItemView(selfContainer, items) {
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
        function setTotalView(selfContainer, title, value) {
            var view = selfContainer.find('.section_total_container').empty(), elm;

            elm = $('<div class="col-md-9 index">' +
                        title +
                        '</div>' +
                        '<div class="col-md-3 total">' +
                        value.toMoney() + //dataModel.Expense.Value
                        '</div>');
            view.append(elm);
        };
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

            view.Asset.Set();
            view.Liability.Set();
            view.Equity.Set();
        };
        (function () {
            var selfContainer, items = [], dic = {};
            function setData() {
                var model;
                dataModel.Asset.Items.each(function () {
                    model = dic[this.GroupId];
                    if (!model) {
                        model = dic[this.GroupId] = { Name: this.Group, Value: 0,Items:[] };
                        items.push(model);
                    }
                    model.Items.push(this);
                    model.Value += (this.Debit-this.Credit);

                    dataModel.Asset.Value += (this.Debit - this.Credit);
                });
                dataModel.Asset.List = items;
            };
            this.Set = function () {
                items = [];
                dic = {};
                selfContainer = selfContainer || container.find('#asset_section');
                setData();
                setItemView(selfContainer, items);
                setTotalView(selfContainer, 'Total Asset', dataModel.Asset.Value);
            };
        }).call(view.Asset = {});
        (function () {
            var selfContainer, items = [], dic = {};
            function setData() {
                var model ;
                dataModel.Liability.Items.each(function () {
                    model = dic[this.GroupId];
                    if (!model) {
                        model =dic[this.GroupId]= { Name: this.Group, Value: 0 };
                        items.push(model);
                    }
                    model.Value += (this.Credit - this.Debit);
                    dataModel.Liability.Value += (this.Credit - this.Debit);
                });
            };
            function setNetAsset(selfContainer, title, value) {
                var view = selfContainer.find('.section_net_asset_container').empty(), elm;

                elm = $('<div class="col-md-9 index">' +
                            title +
                            '</div>' +
                            '<div class="col-md-3 total">' +
                            value.toMoney() + //dataModel.Expense.Value
                            '</div>');
                view.append(elm);
            };
            this.Set = function () {
                items = [];
                dic = {};
                selfContainer = selfContainer || container.find('#liability_section');
                setData();
                setItemView(selfContainer, items);
                setTotalView(selfContainer, 'Total Liability', dataModel.Liability.Value);
                setNetAsset(selfContainer, 'Net Asset', (dataModel.Asset.Value - dataModel.Liability.Value));
            };
        }).call(view.Liability = {});
        (function () {
            var selfContainer, items = [], dic = {};
            function setData() {
                var model;
                dataModel.Equity.Items.each(function () {
                    model = dic[this.GroupId];
                    if (!model) {
                        model = dic[this.GroupId] = { Name: this.Group, Value: 0 };
                        items.push(model);
                    }
                    model.Value += (this.Credit - this.Debit);
                    dataModel.Equity.Value += (this.Credit - this.Debit);
                });

                dataModel.Revenue.Items.each(function () {
                    dataModel.Revenue.Value += (this.Credit - this.Debit);
                });
                dataModel.Expense.Items.each(function () {
                    dataModel.Expense.Value += (this.Debit - this.Credit);
                });
                dataModel.Equity.Value += dataModel.Revenue.Value - dataModel.Expense.Value;
                items.push({ Name: 'Current Year Earning', Value: dataModel.Revenue.Value - dataModel.Expense.Value });
            };
            this.Set = function () {
                items = [];
                dic = {};
                selfContainer = selfContainer || container.find('#equity_section');
                setData();
                setItemView(selfContainer, items);
                setTotalView(selfContainer, 'Total Equity', dataModel.Equity.Value);
            };
        }).call(view.Equity = {});
    }).call(service.View = {});
    service.Loader.Load();
})();
