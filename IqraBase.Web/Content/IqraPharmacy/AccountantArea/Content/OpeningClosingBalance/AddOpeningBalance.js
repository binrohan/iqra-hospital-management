

var Controller = new function () {
    var service = {}, windowModel, dataSource = [], formModel = {}, callerOptions;
    function save() {
        if (formModel.TopDebit != formModel.TopCredit) {
            alert('Total Debit and Credit must be equal.');
            return;
        }
        var data = service.Grid.GetData();
        if (data.length>0) {
            windowModel.Wait();
            Global.CallServer('/AccountantArea/OpeningBalance/SetOpeningBalance', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    close();
                    callerOptions.onSaveSuccess(response);
                } else {
                    Global.Error.Show(response, {});
                }
            }, function (response) {
                windowModel.Free();
                response.Id = -8;
                alert('Network Errors.');
            }, data, 'POST');
        } else {
            alert('No Item Changed.');
        }
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/AddOpeningBalance.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '98%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_save').click(save);
                Global.Form.Bind(formModel, windowModel.View);
                windowModel.Show();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        var gridModel, selfService = {}, ctgr = '', dst = { Assets: [], Liability: [], 'Owners Equity(Capital)': [] };
        function bind() {
            if (!gridModel) {
                Global.Grid.Bind(getOptions());
            }
        };
        function onItemDetails(model) {
            Global.Add({
                ItemId: model.Id,
                name: 'ProductDetails',
                url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
            });
        };
        function setSummary() {
            console.log([dst, dst.Assets.OpeningDebit , dst.Liability.OpeningDebit , dst['Owners Equity(Capital)'].OpeningDebit]);
            formModel.TopDebit = formModel.BottomDebit = (dst.Assets.OpeningDebit + dst.Liability.OpeningDebit + dst['Owners Equity(Capital)'].OpeningDebit).toMoney();
            formModel.TopCredit = formModel.BottomCredit = (dst.Assets.OpeningCredit + dst.Liability.OpeningCredit + dst['Owners Equity(Capital)'].OpeningCredit).toMoney();
            formModel.TopBalance = formModel.BottomBalance = (dst.Assets.Balance - dst.Liability.Balance - dst['Owners Equity(Capital)'].Balance).toMoney();
        };
        function getInput(attr, placeHolder, tabIndex,func) {
            return $('<input data-type="float" data-binding="' + attr + '" name="' + attr + '" class="form-control" type="text" style="max-width: calc(100% - 24px); max-height: 20px; margin: 2px 0px;" placeholder="' + placeHolder + '" tabindex="' + tabIndex + '" autocomplete="off">').keyup(func).blur(func);
        };
        function getTd(text,binding, colSapan, fontSize) {
            return '<td class="auto_bind" data-binding="' + binding + '" colspan="' + (colSapan || 1) + '" style="font-size: ' + (fontSize || 1.5) + 'em; font-weight: bold; color: rgb(85, 85, 85);">' + text + '</td>'
        };
        function setDST() {
            dst = {
                Assets: {
                    OpeningCredit: 0,
                    L: [],
                    OpeningDebit: 0,
                    Balance: 0,
                    Pls: 'OpeningDebit',
                    Mns: 'OpeningCredit'
                },
                Liability: {
                    OpeningCredit: 0,
                    L: [],
                    OpeningDebit: 0,
                    Balance: 0,
                    Pls: 'OpeningCredit',
                    Mns: 'OpeningDebit'
                },
                'Owners Equity(Capital)': {
                    OpeningCredit: 0,
                    L: [],
                    OpeningDebit: 0,
                    Balance: 0,
                    Pls: 'OpeningCredit',
                    Mns: 'OpeningDebit'
                }
            };
        };
        function rowBound(elm,container) {
            if (ctgr != this.Category) {
                ctgr = this.Category;
                var model = dst[this.Category];
                var tr = $('<tr role="row">' + getTd(this.Category, 'Category') + getTd(model.OpeningDebit.toMoney(), 'OpeningDebitView') + getTd(model.OpeningCredit.toMoney(), 'OpeningCreditView') + getTd(model.Balance.toMoney(), 'BalanceView') + '</tr>');
                container.append(tr);
                Global.Form.Bind(model, tr);
            }
            var td = elm.find('td'), index = 1,tabIndex=0;
            selfService.Debit.Set($(td[index]), this, tabIndex++);
            selfService.Credit.Set($(td[index + 1]), this, tabIndex + dataSource.length);
            this.FormModel = {};
            Global.Form.Bind(this.FormModel, elm);
            for (var key in this.FormModel) { if (typeof (this[key]) != 'undefined') this.FormModel[key] = this[key]; }
        };
        function onDataBinding(response) {
            var model;
            ctgr = '';
            setDST();
            response.Data.Data.each(function () {
                model = dst[this.Category];
                if (model) {
                    model.L.push(this);
                    model.OpeningDebit += this.OpeningDebit;
                    model.OpeningCredit += this.OpeningCredit;
                    this.Balance = (this[model.Pls] - this[model.Mns]);
                    model.Balance += this.Balance;
                    this.Orginal = Global.Copy({}, this.true);
                }
            });
            response.Data.Data = dst.Assets.L.concat(dst.Liability.L, dst['Owners Equity(Capital)'].L);
            dataSource = response.Data.Data;
            setSummary();
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#set_opening_grid'),
                columns: [
                    { field: 'AccountName', title: 'Account', sorting: false },
                    { field: 'OpeningDebit', title: 'Debit', autobind: false, sorting: false },
                    { field: 'OpeningCredit', title: 'Credit', autobind: false, sorting: false },
                    { field: 'Balance', sorting: false, type: 2 }
                ],
                url: '/AccountantArea/OpeningBalance/Get',
                page: { 'PageNumber': 1, 'PageSize': 100000 },
                dataBinding: onDataBinding,
                pagging:false,
                rowBound: rowBound,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('.empty_style.button_container');
                    }
                },
                onComplete: function (model) {
                    gridModel = model;
                }
            };
            return opts;
        };
        (function () {
            function onChange() {
                var model = dst[this.Category], credit = 0,balance=0;
                this.OpeningCredit = parseFloat(this.FormModel.OpeningCredit || 0) || 0;
                this.Balance = (this[model.Pls] - this[model.Mns]);
                model.L.each(function () {
                    credit += this.OpeningCredit;
                    balance += this.Balance;
                });
                model.OpeningCredit = credit;
                model.OpeningCreditView = credit.toMoney();
                model.BalanceView = balance.toMoney();
                model.Balance = balance;
                setSummary();
            };
            this.Set = function (td, model,tabIndex) {
                td.html(getInput('OpeningCredit', 'Credit', tabIndex, function () {
                    onChange.call(model);
                }));
            };
        }).call(selfService.Credit = {});
        (function () {
            function onChange() {
                var model = dst[this.Category], debit = 0, balance = 0;
                this.OpeningDebit = parseFloat(this.FormModel.OpeningDebit || 0) || 0;
                this.Balance = (this[model.Pls] - this[model.Mns]);
                model.L.each(function () {
                    debit += this.OpeningDebit;
                    balance += this.Balance;
                });
                model.Balance = balance;
                model.OpeningDebit = debit;
                model.OpeningDebitView = debit.toMoney();
                model.BalanceView = balance.toMoney();
                setSummary();
                console.log([this,model]);
            };
            this.Set = function (td, model, tabIndex) {
                td.html(getInput('OpeningDebit', 'Debit', tabIndex, function () {
                    onChange.call(model);
                }));
            };
        }).call(selfService.Debit = {});
        this.GetData = function () {
            var list = [];
            dataSource.each(function () {
                if (this.OpeningDebit != this.Orginal.OpeningDebit || this.OpeningCredit != this.Orginal.OpeningCredit) {
                    list.push({
                        AccountId: this.AccountId,
                        Id: this.OpeningClosingBalanceId,
                        OpeningDebit: this.FormModel.OpeningDebit || 0,
                        OpeningCredit: this.FormModel.OpeningCredit || 0
                    });
                }
            });
            //console.log([dataSource, list]);
            return list;
        };
        this.Bind = function () {
            bind();
            if (gridModel) {
                gridModel.Reload();
            }
        };
    }).call(service.Grid = {});
};