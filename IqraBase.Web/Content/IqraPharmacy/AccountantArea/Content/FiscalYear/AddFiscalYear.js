

var Controller = new function () {
    var service = {}, windowModel, dataSource = [], formModel = {}, callerOptions;
    function save() {
        //var data = service.Grid.GetData();
        if (formModel.Name) {
            windowModel.Wait();
            Global.CallServer('/AccountantArea/FiscalYear/Create', function (response) {
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
            }, { Name: formModel.Name}, 'POST');
        } else {
            alert('Please enter a Name.');
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
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/AddFiscalYear.html', function (response) {
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
        function getInput(attr, placeHolder, tabIndex) {
            return $('<input data-type="float" data-binding="' + attr + '" name="' + attr + '" class="form-control" type="text" style="max-width: calc(100% - 24px); max-height: 20px; margin: 2px 0px;" placeholder="' + placeHolder + '" tabindex="' + tabIndex + '" autocomplete="off">');
        };
        function getTd(text,colSapan,fontSize) {
            return '<td colspan="' + (colSapan || 1) + '" style="font-size: ' + (fontSize||1.5) + 'em; font-weight: bold; color: rgb(85, 85, 85);">' + text + '</td>'
        };
        function rowBound(elm,container) {
            if (ctgr != this.Category) {
                ctgr = this.Category;
                var model = dst[this.Category];
                var tr = $('<tr role="row">' + getTd(this.Category, 3, 2) + getTd(model.Debit.toMoney()) + getTd(model.Credit.toMoney()) + getTd(model.Balance.toMoney()) + '</tr>');
                container.append(tr);
            }
        };
        function setDST() {
            dst = {
                Assets: {
                    Credit: 0,
                    L: [],
                    Debit: 0,
                    Balance: 0,
                    Pls: 'Debit',
                    Mns: 'Credit'
                },
                Liability: {
                    Credit: 0,
                    L: [],
                    Debit: 0,
                    Balance: 0,
                    Pls: 'Credit',
                    Mns: 'Debit'
                },
                'Owners Equity(Capital)': {
                    Credit: 0,
                    L: [],
                    Debit: 0,
                    Balance: 0,
                    Pls: 'Credit',
                    Mns: 'Debit'
                }
            };

        };
        function onDataBinding(response) {
            var model;
            ctgr = '';
            setDST();
            response.Data.each(function () {
                model = dst[this.Category];
                if (model) {
                    model.L.push(this);
                    model.Debit += this.Debit;
                    model.Credit += this.Credit;
                    this.Balance = (this[model.Pls] - this[model.Mns]);
                    model.Balance += this.Balance;
                }
            });
            response.Data.Data = dst.Assets.L.concat(dst.Liability.L, dst['Owners Equity(Capital)'].L);
            dataSource = response.Data.Data;
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#set_opening_grid'),
                columns: [
                    { field: 'Account', sorting: false },
                    { field: 'Group', sorting: false },
                    { field: 'Category', sorting: false },
                    { field: 'Debit', autobind: false, sorting: false, type: 2 },
                    { field: 'Credit', autobind: false, sorting: false, type: 2 },
                    { field: 'Balance', autobind: false, sorting: false, type: 2 }
                ],
                url: '/AccountantArea/FiscalYear/GetClosingBalance',
                page: { 'PageNumber': 1, 'PageSize': 100000 },
                dataBinding: onDataBinding,
                pagging:false,
                rowBound: rowBound,
                Printable: false,
                //Printable: {
                //    Container: function () {
                //        return windowModel.View.find('.empty_style.button_container');
                //    }
                //},
                onComplete: function (model) {
                    gridModel = model;
                }
            };
            return opts;
        };
        (function () {
            function onSoldDaysChanged(model, e, stock) {
                
            };
            this.Set = function (td, model,tabIndex) {
                td.html(getInput('OpeningCredit', 'Credit', tabIndex));
            };
        }).call(selfService.Credit = {});
        (function () {
            this.Set = function (td, model, tabIndex) {
                td.html(getInput('OpeningDebit', 'Debit', tabIndex));
            };
        }).call(selfService.Debit = {});
        this.GetData = function () {
            var list = [];
            dataSource.each(function () {
                if (this.OpeningDebit != this.FormModel.OpeningDebit || this.OpeningCredit != this.FormModel.OpeningCredit) {
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