var Controller = new function () {
    var that = this, windowModel, gridModel, formModel = {}, callarOptions = {}, service = {}, formInputs;
    function checkError(model) {
        if (formModel.TotalDebit != formModel.TotalCredit) {
            alert('Debit and Credit Must be equal.');
            return true;
        } else if (formModel.TotalDebit==0) {
            alert('You have to fill at least 2 lines.');
            return true;
        } else if (model.IsError) {
            alert("Please fill all line's account.");
            return true;
        }
    }
    function save() {
        if (formModel.IsValid) {
            var model = service.Grid.GetData();
            if (checkError(model))
            {
                return;
            }
            windowModel.Wait();
            Global.CallServer('/AccountantArea/ManualJournal/OnCreate', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    cancel();
                    callarOptions.OnSuccess();
                } else {
                    Global.Error.Show(response, '/AccountantArea/ManualJournal/OnCreate');
                }
            }, function (response) {
                windowModel.Free();
                response.Id = -8;
                alert('Errors.');
            }, model, 'POST');
        } else {
            alert('Validation Errors.');
        }
        return false;
    };
    function cancel() {
        windowModel.Hide(function () {
        });
    };

    function calculateExcludeTax(model, field) {
        return model[field] * (model.TaxRate || 0) / 100;
    };
    function calculateIncludeTax(model, field) {
        model.TaxRate = model.TaxRate || 0;
        return model[field] * model.TaxRate / (100 + model.TaxRate);
    };
    function calculateEmptyTax(model) {
        return 0;
    };
    function setSummary() {
        var debit = 0, credit = 0, debitTax = 0, creditTax = 0, taxFunc = formModel.TaxType == 1 ? calculateIncludeTax : formModel.TaxType == 2 ? calculateExcludeTax : calculateEmptyTax;

        gridModel&&gridModel.dataSource.each(function () {
            this.Debit = this.Debit || 0;
            this.Credit = this.Credit || 0;
            this.DebitTax = taxFunc(this, 'Debit');
            this.CreditTax = taxFunc(this, 'Credit');

            debit += this.Debit;
            credit += this.Credit;

            debitTax += this.DebitTax;
            creditTax += this.CreditTax;
        });
        formModel.Debit = debit.toMoney();
        formModel.Credit = credit.toMoney();
        formModel.DebitTax = debitTax.toMoney();
        formModel.CreditTax = creditTax.toMoney();
        if (formModel.TaxType == 2) {
            formModel.TotalDebit = (debit + debitTax).toFloat();
            formModel.TotalCredit = (credit + creditTax).toFloat();
            formModel.Amount = formModel.TotalDebit.toMoney();
            formModel.TotalCreditAmount = formModel.TotalCredit.toMoney();
        } else {
            formModel.TotalDebit = debit.toFloat();
            formModel.TotalCredit = credit.toFloat();
            formModel.Amount = debit.toMoney();
            formModel.TotalCreditAmount = credit.toMoney();
        }
        if (formModel.TotalDebit != formModel.TotalCredit) {
            formModel.OutText = 'Total is out by';
            formModel.TotalOut = (formModel.TotalDebit - formModel.TotalCredit).toMoney();
            //console.log([formModel.TotalDebit, formModel.TotalCredit]);
        } else {
            formModel.OutText = '';
            formModel.TotalOut = '';
        }
    };
    function getDropdown() {
        Global.DropDown.Bind({
            elm: $(formInputs['TaxType']),
            dataSource: [
                { value: '0', text: 'No Tax' },
                { value: 1, text: 'Tax Included' },
                { value: 2, text: 'Tax Excluded' }
            ],
            change: function (data) {
                if (data && data.value > 0) {
                    gridModel&&gridModel.dataSource.each(function () {
                        this.DrpTaxType && this.DrpTaxType.Enable && this.DrpTaxType.Enable(true);
                    });
                } else {
                    gridModel && gridModel.dataSource.each(function () {
                        this.DrpTaxType && this.DrpTaxType.Enable && this.DrpTaxType.Enable(false);
                    });
                }
                setSummary();
            }
        });
    };
    function show() {
        windowModel.Show();
        //loadDetails();
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, { width: '95%' });
        formInputs = Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        Global.Click(windowModel.View.find('.btn_save'), save);
        getDropdown();
        service.Grid.Bind();
        show();
    };
    this.Show = function (opts) {
        callarOptions = opts;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/ManualJournal/AddManualJournal.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
    (function () {
        var selfService = {},input,id=1;
        function getInput(attr, placeHolder, tabIndex, func) {
            return $('<input data-type="float|null" data-binding="' + attr + '" name="' + attr + '" class="form-control" type="text" style="max-width: calc(100% - 6px); max-height: 20px; margin: 2px 0px; padding: 2px; text-align: right;" placeholder="' + placeHolder + '" tabindex="' + tabIndex + '" autocomplete="off" />').keyup(func || noop).blur(func || noop);
        };
        function onRowBound(elm) {
            this.Id = id++;
            var td = elm.find('td'), index = 0, tabIndex = 0;
            selfService.Description.Set($(td[index]), this, tabIndex++);
            selfService.Account.Set($(td[index + 1]), this, tabIndex++);
            selfService.TaxRate.Set($(td[index + 2]), this, tabIndex++);
            selfService.Debit.Set($(td[index + 3]), this, tabIndex++);
            selfService.Credit.Set($(td[index + 4]), this, tabIndex++);
            this.FormModel = {};
            Global.Form.Bind(this.FormModel, elm);
            for (var key in this.FormModel) { if (typeof (this[key]) != 'undefined') this.FormModel[key] = this[key]; }
        };
        function defaultData() {
            return [
                { Depreciation: '', Account: '', TaxRate: '', DebitStr: 0, CreditStr: 0 },
                { Depreciation: '', Account: '', TaxRate: '', DebitStr: 0, CreditStr: 0 },
                //{ Depreciation: '', Account: '', TaxRate: '', DebitStr: 0, CreditStr: 0 },
                //{ Depreciation: '', Account: '', TaxRate: '', DebitStr: 0, CreditStr: 0 },
                //{ Depreciation: '', Account: '', TaxRate: '', DebitStr: 0, CreditStr: 0 }
            ];
        };
        function onRemove(model){
            var elm = $(this).closest('tr'),newList=[];
            gridModel.dataSource.each(function () {
                this.Id != model.Id && newList.push(this);
            });
            gridModel.dataSource = newList;
            elm.remove();
        };
        function addNewLine() {
            gridModel.AddTottom({ Depreciation: '', Account: '', TaxRate: '', DebitStr: 0, CreditStr: 0 });
        };
        function setGrid() {
            Global.Grid.Bind({
                Name: 'OnAddManualJournal',
                elm: windowModel.View.find('#grid_container'),
                columns: [
                    { field: 'Depreciation', width: '30%' },
                    { field: 'Account', title: 'Account', autobind: false },
                    { field: 'TaxRate', title: 'TaxRate', autobind: false },
                    { field: 'DebitStr', title: 'Debit', autobind: false, width: '12%' },
                    { field: 'CreditStr', title: 'Credit', autobind: false, width: '12%' },
                    { title: 'Action', width: '8%', Text: '<span class="glyphicon glyphicon-remove"></span>', click: onRemove }
                ],
                dataSource: defaultData(),
                page: { 'PageNumber': 1, 'PageSize': 1000, showingInfo: ' {0}-{1} of {2} Account Lines ' },
                pagging:false,
                Printable: false,
                rowBound: onRowBound,
                selector:false,
                onComplete: function (model) {
                    gridModel = model;
                }
            });
        };
        this.GetData = function () {
            setSummary();
            var model = {
                Amount: m2f(formModel.Amount),
                TaxType: formModel.TaxType,
                Debit: m2f(formModel.Debit),
                Credit: m2f(formModel.Credit),
                DebitTax: m2f(formModel.DebitTax),
                CreditTax: m2f(formModel.CreditTax),
                Remarks: formModel.Remarks,
                Items: []
            };
            if (formModel.TaxType == 1) {
                model.Debit = model.Debit - model.DebitTax;
                model.Credit = model.Credit - model.CreditTax;
            }
            
            gridModel.dataSource.each(function () {
                if (this.Debit || this.Credit) {
                    if ((!this.AccountId) || (this.AccountId == '00000000-0000-0000-0000-000000000000')) {
                        model.IsError = true;
                        return;
                    }
                    model.Items.push({
                        AccountId: this.AccountId,
                        TaxRateId: this.TaxRateId,
                        TaxRate: this.TaxRate,
                        Debit: formModel.TaxType == 1 ? this.Debit - this.DebitTax : this.Debit,
                        Credit: formModel.TaxType == 1 ? this.Credit - this.CreditTax : this.Credit,
                        DebitTax: this.DebitTax,
                        CreditTax: this.CreditTax,
                        Description: this.Description
                    });
                }
            });
            return model;
        };
        this.Bind = function () {
            if (gridModel) {
                gridModel.dataSource = defaultData();
                gridModel.Reload();
            } else {
                Global.Click(windowModel.View.find('#btn_add_row'), addNewLine);
                setGrid();
            }
        };
        (function () {
            this.Set = function (td, model, tabIndex) {
                td.html('<textarea data-binding="Description" style="width: calc(100% - 6px); max-width: calc(100% - 6px); height: 17px; padding: 2px; text-align: right;" class="form-control" data-type="string"></textarea>');
            };
        }).call(selfService.Description = {});
        (function () {
            function onChange(model, data) {
                //console.log([model, data]);
                if (data) {
                    model.AccountId = data.Id;
                } else {
                    model.AccountId = '00000000-0000-0000-0000-000000000000';
                }
            };
            this.Set = function (td, model, tabIndex) {
                input = getInput('Account', 'Account', tabIndex);
                td.html(input);
                Global.AutoComplete.Bind({
                    elm: input,
                    url: '/AccountantArea/AppAccount/AutoComplete',
                    change: function (data) {
                        onChange(model, data);
                    }
                });
                //console.log([td, model, tabIndex, input]);
            };
        }).call(selfService.Account = {});
        (function () {
            function onChange(model, data) {
                if (data) {
                    model.TaxRate = model.TaxRateOrginal = data.Rate;
                    model.TaxRateId = data.Id;
                } else {
                    model.TaxRate = model.TaxRateOrginal = 0;
                    model.TaxRateId = '00000000-0000-0000-0000-000000000000';
                }
                setSummary();
            };
            this.Set = function (td, model, tabIndex) {
                input = getInput('TaxRateId', 'TaxRateId', tabIndex);
                td.html(input);
                model.DrpTaxType = {
                    elm: input,
                    url: '/AccountantArea/TaxRate/AutoComplete',
                    change: function (data) {
                        onChange(model, data);
                    }
                };
                Global.AutoComplete.Bind(model.DrpTaxType);
            };
        }).call(selfService.TaxRate = {});
        (function () {
            function onChange() {
                this.Debit = parseFloat(this.FormModel.Debit || '0') || 0;
                setSummary();
                //console.log([this]);
            };
            this.Set = function (td, model, tabIndex) {
                td.html(getInput('Debit', 'Debit', tabIndex, function () {
                    onChange.call(model);
                }));
            };
        }).call(selfService.Debit = {});
        (function () {
            function onChange() {
                this.Credit = parseFloat(this.FormModel.Credit || '0') || 0;
                setSummary();
            };
            this.Set = function (td, model, tabIndex) {
                td.html(getInput('Credit', 'Credit', tabIndex, function () {
                    onChange.call(model);
                }));
            };
        }).call(selfService.Credit = {});
    }).call(service.Grid = {});
};

