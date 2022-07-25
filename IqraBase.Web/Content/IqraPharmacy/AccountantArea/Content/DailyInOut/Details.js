var Controller = new function () {
    var that = this, windowModel, dataModel = { CashIn: [], CashOut: [] }, formModel = {}, callarOptions = {}, service = {}, formInputs;
    function getModel() {
        dataModel.Remarks = formModel.Remarks;
        return formModel;
    };
    function save() {
        if (formModel.IsValid) {
            windowModel.Wait();
            var model = getModel();
            Global.CallServer('/AccountantArea/DailyInOut/OnCreate', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    cancel();
                    callarOptions.OnSuccess();
                } else {
                    Global.Error.Show(response, '/ItemSalesArea/DailySale/Create');
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
    function populate(list) {
        windowModel.Free();

        var model = list[1][0];
        dataModel = {};
        dataModel.BeforeBalance = list[1][0].AfterBalance || 0;
        formModel.BeforeBalance = dataModel.BeforeBalance.toFloat()
        dataModel.In = model.Debit || 0;
        dataModel.Out = model.Credit || 0;
        dataModel.AfterBalance = dataModel.In - dataModel.Out + dataModel.BeforeBalance;
        formModel.AfterBalance = dataModel.AfterBalance.toFloat();
        formModel.In = dataModel.In.toFloat();
        formModel.Out = dataModel.Out.toFloat();
        formModel.Date = Global.DateTime.GetObject(list[2][0].FilterDate, 'yyyy-MM-dd HH:mm').format('dd/MM/yyyy');

    };
    function show() {
        windowModel.Show();
        service.Loader.Load();
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, { width: '98%' });
        formInputs = Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        windowModel.View.find('.btn_save').remove();
        $(formInputs['Date']).closest('.row').remove();
        $(formInputs['Remarks']).closest('section').remove();
        show();
    };
    this.Show = function (opts) {
        callarOptions = opts;
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/AddInOut.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
    (function () {
        var headers = [
            'Not Define', 'PurchaseInfo', 'Suplier Payment', 'Daily Inventory', 'Sale Return', 'Inventory Adjustment',
            'Advance Salary', 'Employee Salary', 'Employee Loan', 'Expense', 'Opening Balance',
            'Manual Journal', 'Bank Transfer', 'Purchase Cancel', 'Suplier Return'
        ];
        function set(list) {
            list.each(function () {
                this.Head = headers[this.SourceType] || '';
                if (this.Debit > 0) {
                    dataModel.CashIn.push(this);
                    dataModel.CashInTotal += this.Debit;
                }
                if (this.Credit > 0) {
                    dataModel.CashOut.push(this);
                    dataModel.CashOutTotal += this.Credit;
                }
            });
        }
        this.Load = function () {
            var to = '?Date=' + Global.DateTime.GetObject(callarOptions.model.Date, 'dd/MM/yyyy').format('yyyy-MM-dd HH:mm');
            windowModel.Wait();
            Global.CallServer('/AccountantArea/DailyInOut/GetLastEntry' + to, function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    dataModel = { CashIn: [], CashOut: [], CashInTotal: 0, CashOutTotal: 0 };
                    console.log(dataModel);
                    formModel.Date = Global.DateTime.GetObject(response.Data[2][0].FilterDate, 'yyyy-MM-dd HH:mm').format('dd/MM/yyyy');
                    set(response.Data[1]);
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
        var container;
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
        function setData(list) {
            var model = list[1][0];
            formModel.BeforeBalance = (list[0][0] ? list[0][0].AfterBalance : 0).toFloat();
            formModel.In = dataModel.CashInTotal.toFloat();
            formModel.Out = dataModel.CashOutTotal.toFloat();
            formModel.AfterBalance = formModel.In - formModel.Out + formModel.BeforeBalance;
        };
        this.Create = function (list) {
            container = container || windowModel.View.find('#cash_report');
            container.empty();
            setData(list);
            opening();
            createCash(dataModel.CashIn, dataModel.CashInTotal, 'Debit');
            createCash(dataModel.CashOut, dataModel.CashOutTotal, 'Credit');
            closing();
        }
    }).call(service.View = {});

};

