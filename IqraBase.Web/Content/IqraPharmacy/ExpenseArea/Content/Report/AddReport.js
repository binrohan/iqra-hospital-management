var Controller = new function () {
    var that = this, windowModel, dataModel = {}, formModel = {}, callarOptions = {}, service = {}, formInputs = {},
        date = new Date(CurrentTime), from = date.format('yyyy-MM-dd 00:00'), currentDate = CurrentDate;
    date.setDate(date.getDate() + 1);
    var to = date.format('yyyy-MM-dd 00:00');
    //from = '2018-09-25 00:00';
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
    function onDateChange(date) {
        if (date) {
            date = new Date(date);
            from = date.format('yyyy-MM-dd 00:00');
            date.setDate(date.getDate() + 1);
            to = date.format('yyyy-MM-dd 00:00');
            service.Loader.LoadExpense();
        }
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
        service.Loader.LoadExpense();
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, {width:'98%'});
        formInputs = Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        Global.Click(windowModel.View.find('.btn_save'), save);
        $(formInputs['Date']).val(CurrentTime.format('dd/MM/yyyy'));
        Global.DatePicker.Bind($(formInputs['Date']), { format: 'dd/MM/yyyy', onChange: onDateChange });
        show();
    };
    this.Show = function (opts) {
        callarOptions = opts;
        formModel.Date = '';
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ExpenseArea/Templates/AddReport.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
    (function () {
        function setPayment(list) {
            list.each(function () {
                this.BillAt = this.BillAt?this.BillAt.getDate().format('yyyy-MM-dd'):'';
                if (this.BillAt == currentDate) {
                    dataModel.Today.Payment[this.CounterId] = dataModel.Today.Payment[this.CounterId] || { "BillAt": this.BillAt, "PaidAmount": 0, "CounterId": this.CounterId, "Counter": this.Counter };
                    dataModel.Today.Payment[this.CounterId].PaidAmount += this.PaidAmount;
                } else {
                    dataModel.Due.Payment[this.CounterId] = dataModel.Due.Payment[this.CounterId] || { "BillAt": this.BillAt, "PaidAmount": 0, "CounterId": this.CounterId, "Counter": this.Counter };
                    dataModel.Due.Payment[this.CounterId].PaidAmount += this.PaidAmount;
                }
            });
        };
        function setBill(list) {
            list.each(function () {
                dataModel.Today.Bill[this.CounterId] = this;
                if (dataModel.Today.Payment[this.CounterId]) {
                    dataModel.Today.Bill[this.CounterId].TradePrice -= dataModel.Today.Payment[this.CounterId].PaidAmount;
                }
            });
        };
        function setExpense(list) {
            setPayment(list[0]);
            setBill(list[1]);

        };
        this.LoadExpense = function () {
            Global.CallServer('/ExpenseArea/Expense/GetReportData?from=' + from + '&to=' + to, function (response) {
                if (!response.IsError) {
                    dataModel = {
                        Today: {
                            Payment: {},
                            Bill: {}
                        },
                        Due: { Payment: {} },
                        Purchase: [],
                        DuePurchase: [],
                        Other: [],
                        PurchaseDue: [],
                        OtherDue: []
                    };
                    console.log(dataModel);
                    currentDate = from.substring(0, 10);
                    setExpense(response.Data);
                    service.View.Create();
                } else {
                    error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                error.Save(response, saveUrl);
            }, null, 'Get');
        };
    }).call(service.Loader = {});
    (function () {
        var container;
        function getList(model, name) {
            var list = [], amount = 0;
            for (var key in model) {
                if (model[key][name] !== 0) {
                    list.push(model[key]);
                    amount += model[key][name];
                }
            }
            console.log([model, name, list, amount]);
            return { List: list, Amount: amount };
        };
        function createTodaysBill(model, name, field) {
            field = field || 'PaidAmount';
            var model = getList(model, field), today = CurrentTime.format('yyyy-MM-dd');
            if (model.List.length == 0) {
                model.List.push({ Counter: '', PaidAmount: 0, TradePrice: 0 });
            }
            
            model.List.each(function (i) {
                if (i === 0) {
                    var rowSpan = 'rowspan = "' + model.List.length + '"'
                    container.append('<tr>' +
                '<td class="lead" ' + rowSpan + '>' + (currentDate === today ? "Today's " + name : name + " at " + currentDate) + '</td>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + this.Counter + '</td>' +
                '<td class="text-right">' + this[field].toMoney() + '</td>' +
                '<td class="text-right lead" ' + rowSpan + '>' + model.Amount.toMoney() + '</td>' +
            '</tr>');
                } else {
                    container.append('<tr>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + this.Counter + '</td>' +
                '<td class="text-right">' + this[field].toMoney() + '</td>' +
            '</tr>');
                }
            });
        };
        function createDueBill() {
            var model = getList(dataModel.Due.Payment, 'PaidAmount');
            if (model.List.length == 0) {
                model.List.push({ Counter: '', PaidAmount: '' });
            }
            model.List.each(function (i) {
                if (i === 0) {
                    var rowSpan = 'rowspan = "' + model.List.length + '"'
                    container.append('<tr>' +
                '<td ' + rowSpan + '>' + (currentDate === CurrentDate ? "Today's Due Payment Bill" : "Due Payment Bill at " + currentDate) + '</td>' +
                '<td>' + this.Counter + '</td>' +
                '<td>' + this.PaidAmount + '</td>' +
                '<td ' + rowSpan + '>' + model.Amount + '</td>' +
            '</tr>');
                } else {
                    container.append('<tr>' +
                '<td>' + this.Counter + '</td>' +
                '<td>' + this.PaidAmount + '</td>' +
            '</tr>');
                }
            });
        };
        this.Create = function () {
            container = container||windowModel.View.find('#purchase_report');
            container.empty();
            createTodaysBill(dataModel.Today.Payment, 'Purchase Bill');
            createTodaysBill(dataModel.Due.Payment, 'Due Payment Bill');
            createTodaysBill(dataModel.Today.Bill, 'Purchase Due', 'TradePrice');
        }
    }).call(service.View = {});
};