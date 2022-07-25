
(function () {
    var service = {};
    (function () {
        this.Get = function (fomrMdl) {
            return getDaily('Daily', 'DailyDue', 'DailyDueDetails', none, fomrMdl);
        }
    }).call(service.Daily = {});
    (function () {
        this.Get = function (fomrMdl) {
            return getDaily('Monthly', 'MonthlyDue', 'DailyDueDetails', none, fomrMdl);
        }
    }).call(service.Monthly = {});
    (function () {
        this.Get = function (fomrMdl,func) {
            return getDaily('Suplier-Wise', 'SuplierWiseDue', 'DailyDueDetails', getSuplierColumns('Suplier', onSuplierDetails), fomrMdl, [{
                click: function (model) { onPaymentAdd(model,func) },
                html: '<a style="margin-right:8px;" title="Change Barcode"><i class="glyphicon glyphicon-plus" aria-hidden="true"></i></a>'
            }]);
        }
    }).call(service.SuplierWise = {});
    (function () {
        this.Get = function (fomrMdl) {
            return getDaily('Counter-Wise', 'CounterWiseDue', 'DailyDueDetails', getSuplierColumns('Counter', onCounterDetails), fomrMdl);
        }
    }).call(service.CounterWise = {});
    (function () {
        function onDetails(model) {
            Global.Add({
                PurchaseId: model.PurchaseId,
                name: 'PurchaseDetails',
                url: '/Content/IqraPharmacy/ProductPurchaseArea/Content/PurchaseDetails.js',
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
        function onApproverDetails(model) {
            onUserDetails(model.ApprovedBy);
        };
        function onApprove(model) {
            Global.Controller.Call({
                url: IqraConfig.Url.Js.WarningController,
                functionName: 'Show',
                options: {
                    name: 'Approve Payment',
                    msg: 'Are you sure you want to Approve this Payment?',
                    save: '/ExpenseArea/SuplierPayment/Approve',
                    data: { Id: model.Id },
                    onsavesuccess: function () {
                        model.gridModel.Reload();
                    }, onerror: function (response) {

                    },
                }
            });
        };
        function getItemColumns() {
            return [
                        { field: 'Suplier', filter: true, Click: onSuplierDetails },
                        { field: 'VoucherNo', filter: true, Click: onDetails },
                        { field: 'BillStr', actionfield: 'Bill', title: 'Bill' },
                        { field: 'PaidAmountStr', actionfield: 'PaidAmount', title: 'Paid' },
                        { field: 'DueAmountStr', actionfield: 'DueAmount', title: 'Due' },
                        { field: 'CreatedAt', title: 'BillAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                        { field: 'Creator', click: onCreatorDetails, filter: true }
            ];
        };
        this.Get = function (fomrMdl, func) {
            return getDaily('Voucher-Wise', 'PurchaseDue', none, getItemColumns(), fomrMdl, [{
                click: function (model) { onPaymentAdd(model, func) },
                html: '<a style="margin-right:8px;" title="Change Barcode"><i class="glyphicon glyphicon-plus" aria-hidden="true"></i></a>'
            }]);
        }
    }).call(service.VoucherWise = {});
    (function () {
        var htmlView, models = {};
        function getModel() {
            var selfService = {}, windowModel, callerOptions, formModel = {}, model = {},
                from = { field: 'CreatedAt', value: "", Operation: 2 },
                to = { field: 'CreatedAt', value: "", Operation: 3 }, filter = [];
            function close() {
                windowModel && windowModel.Hide();
            };
            function getFilter() {
                if (callerOptions.name == 'DailyDetails') {
                    var date = Global.DateTime.GetObject(callerOptions.model.CreatedAt, 'yyyy/MM/dd');
                    from.value = date.format("'yyyy-MM-dd 00:00'");
                    date.setDate(date.getDate() + 1);
                    to.value = date.format("'yyyy-MM-dd 00:00'");
                    filter = [from, to];
                } else if (callerOptions.name == 'MonthlyDetails') {
                    var date = Global.DateTime.GetObject(callerOptions.model.CreatedAt + '/01', 'yyyy/MM/dd');
                    from.value = date.format("'yyyy-MM-dd 00:00'");
                    date.setMonth(date.getMonth() + 1);
                    to.value = date.format("'yyyy-MM-dd 00:00'");
                    callerOptions.filter.each(function () {
                        if (this.field == 'CreatedAt') {
                            if (this.Operation == 2) {
                                from.value = from.value < this.value ? this.value : from.value;
                            } else if (this.Operation == 3) {
                                to.value = to.value > this.value ? this.value : to.value;
                            }
                        }
                    });
                    filter = [from, to];
                } else if (callerOptions.name == 'Suplier-WiseDetails') {
                    filter = [];
                    callerOptions.filter.each(function () {
                        if (this.field == 'CreatedAt') {
                            filter.push(this);
                        }
                    });
                    filter.push({ field: 'SuplierId', value: callerOptions.model.SuplierId, Operation: 0 });
                } else if (callerOptions.name == 'Counter-WiseDetails') {
                    filter = [];
                    callerOptions.filter.each(function () {
                        if (this.field == 'CreatedAt') {
                            filter.push(this);
                        }
                    });
                    filter.push({ field: 'CounterId', value: callerOptions.model.CounterId, Operation: 0 });
                } else if (callerOptions.name == 'Voucher-WiseDetails') {
                    filter = [];
                    filter.push({ field: 'CounterId', value: callerOptions.model.CounterId, Operation: 0 });
                }
                return filter;
            };
            function show() {
                windowModel.Show();
                selfService.Grid.Bind();
            };
            function createWindow(template) {
                windowModel = Global.Window.Bind(template, { width: '95%' });
                setTemplate(windowModel.View.find('#summary_container'));
                Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                selfService.Grid.Set();
                return true;
            };
            this.Show = function (model) {
                callerOptions = model;
                console.log(['callerOptions',model]);
                if (windowModel) {
                    show();
                } else {
                    htmlView && createWindow(htmlView) || Global.LoadTemplate('/Content/IqraPharmacy/ProductArea/Templates/DailyDueDetails.html', function (response) {
                        htmlView = response;
                        createWindow(response);
                    }, noop);
                }
            };
            (function () {
                var gridModel, date, itemList = {
                    DailyDetails: [2, 3, 4],
                    MonthlyDetails: [0, 2, 3, 4],
                    'Suplier-WiseDetails': [0, 1, 3, 4],
                    'Counter-WiseDetails': [0, 1, 2, 4],
                    'Voucher-WiseDetails': [0, 1, 2, 3]
                };
                function onReload(response) {
                    model.gridModel.Reload();
                };
                function getItems() {
                    var items = [], filter = getFilter();
                    itemList[callerOptions.name].each(function (i) {
                        items.push(allItems[this](formModel, onReload));
                    });
                    items.each(function () {
                        this.bound = noop;
                        this.filter = filter;
                    });
                    return items;
                };
                this.Set = function () {
                    model = selfService.Model = {
                        container: windowModel.View.find('#daily_due_details'),
                        Base: service.Model.Base,
                        items: getItems()
                    };
                    Global.Tabs(model);
                    model.items[2].set(model.items[2]);
                    console.log(['model', model]);
                };
                this.Bind = function () {
                    var filter = getFilter();
                    selfService.Model.items.each(function () {
                        this.filter = filter;
                        if (this.grid) {
                            this.grid.page.filter = filter;
                        } 
                    });
                    if (model.gridModel) {
                        //model.gridModel.page.filter = getFilter();
                        model.gridModel.Reload();
                    }
                }
            }).call(selfService.Grid = {});
        };
        this.Set = function (model) {
            models[model.name]=models[model.name]||new getModel();
            models[model.name].Show(model);
        }
    }).call(service.Details = {});
    function onPaymentAdd(model,func) {
        model.TradePrice = model.Bill;
        Global.Add({
            model: model,
            filter: service.Model.gridModel.page.filter,
            url: '/Content/IqraPharmacy/ExpenseArea/Content/SuplierPayment/AddSuplierPayment.js',
            onSaveSuccess: function (response) {
                service.Model.gridModel.Reload();
                func && func(response);
            }
        });
    };
    function onSuplierDetails(model) {
        model.SuplierId = model.SuplierId || model.Id;
        Global.Add({
            SuplierId: model.SuplierId,
            name: 'SuplierDetails',
            url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
        });
    };
    function onCounterDetails(model) {
        model.CounterId = model.CounterId || model.Id;
        Global.Add({
            model: model,
            name: 'CounterDetails',
            url: '/Content/IqraPharmacy/ProductArea/Content/Counter/CounterDetails.js',
        });
    };
    function getDailyColumns() {
        return [{ field: 'CreatedAt', title: 'Date' },
                { field: 'BillStr', actionfield: 'Bill', title: 'Bill Amount' },
                { field: 'PaidAmountStr', actionfield: 'PaidAmount', title: 'Paid Amount' },
                { field: 'DueAmountStr', actionfield: 'DueAmount', title: 'Due Amount' }
        ]
    };
    function getSuplierColumns(name, func) {
        return [{ field: name, filter: true, click: func },
                { field: 'BillStr', actionfield: 'Bill', title: 'Bill Amount' },
                { field: 'PaidAmountStr', actionfield: 'PaidAmount', title: 'Paid Amount' },
                { field: 'DueAmountStr', actionfield: 'DueAmount', title: 'Due Amount' }
        ]
    };
    function onDataBinding(response, fomrMdl) {
        fomrMdl.Bill = (response.Data.Total.Bill || 0).toMoney(4);
        fomrMdl.PaidAmount = (response.Data.Total.PaidAmount || 0).toMoney(4);
        fomrMdl.DueAmount = (response.Data.Total.DueAmount || 0).toMoney(4);
        response.Data.Total = response.Data.Total.Total;
        response.Data.Data.each(function () {
            if (!this.Approver) {
                this.ApprovedAt = '';
            }
            this.PaidAmount = this.PaidAmount.toFloat();
            this.Bill = this.Bill.toFloat();
            this.DueAmount = this.DueAmount.toFloat();
            this.PaidAmountStr = this.PaidAmount.toMoney();
            this.BillStr = this.Bill.toMoney();
            this.DueAmountStr = this.DueAmount.toMoney();
        });
    };
    function getDaily(name, dataUrl, details, columns, fomrMdl, actions) {
        columns = columns || getDailyColumns();
        fomrMdl = fomrMdl || formModel;
        return {
            Name: name,
            Url: dataUrl,
            filter: filters.slice(),
            columns: columns,
            actions: actions,
            binding: function (response) {
                onDataBinding(response, fomrMdl);
            },
            bound: function (elm) {
                if (details) {
                    Global.Click(elm, function (model) {
                        service.Details.Set({
                            model: model,
                            Elm: elm,
                            filter: service.Model.gridModel.page.filter.slice(),
                            name: name + 'Details',
                            url: '/Content/IqraPharmacy/SuplierArea/Content/Due/' + details + '.js',
                            onRefresh: function () {
                                service.Model.gridModel.Reload();
                            }
                        });
                    }, this);
                }
            }
        }
    };
    function setTemplate(container) {
        container = container || $('#filter_container');
        container.append('        <div class="col-md-2 col-sm-4 col-xs-6">' +
            '<div><label>Bill</label></div>' +
            '<div><span data-binding="Bill" class="form-control auto_bind" /></div>' +
        '</div>' +
        '<div class="col-md-2 col-sm-4 col-xs-6">' +
            '<div><label>Paid</label></div>' +
            '<div><span data-binding="PaidAmount" class="form-control auto_bind" /></div>' +
        '</div>' +
        '<div class="col-md-2 col-sm-4 col-xs-6">' +
            '<div><label>Due</label></div>' +
            '<div><span data-binding="DueAmount" class="form-control auto_bind" /></div>' +
        '</div>');
    };
    var model = {}, formModel = {},
        filters = Global.Filters().Bind({
        container: $('#filter_container'),
        formModel: formModel,
        onchange: function (filter) {
            if (model.gridModel) {
                service.Model.gridModel.page.filter = filter;
                model.gridModel.Reload();
            }
        }
    }),
        allItems = [
                        service.Daily.Get,
                        service.Monthly.Get,
                        service.SuplierWise.Get,
                        service.CounterWise.Get,
                        service.VoucherWise.Get,
                    ];
    model = service.Model = {
        container: $('#page_container'),
        Base: {
            Url: '/SuplierArea/Suplier/',
        },
        items: [
            allItems[0](),
            allItems[1](),
            allItems[2](),
            allItems[3](),
            allItems[4]()
        ]
    };
    setTemplate();
    Global.Form.Bind(formModel, $('#filter_container'));
    Global.Tabs(model);
    model.items[3].set(model.items[3]);
    console.log(model);
})();
