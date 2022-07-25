var Controller = new function () {
    var that = this, windowModel, formModel = {}, callarOptions = {}, service = {}, formInputs, amount;
    function getModel() {
        var model = service.Grid.GetData();
        return model;
    };
    function save() {
        var model = getModel();
        //console.log([model]);
        //return;
        if (model.length>0) {
            windowModel.Wait();
            Global.CallServer('/AccountantArea/Depreciation/Addnew', function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    cancel();
                    callarOptions.OnSuccess();
                } else {
                    Global.Error.Show(response, '/AccountantArea/Depreciation/Addnew');
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
    function show() {
        windowModel.Show();
        service.Grid.Bind();
    };
    function createWindow(template) {
        windowModel = Global.Window.Bind(template, { width: '98%' });
        formInputs = Global.Form.Bind(formModel, windowModel.View);
        windowModel.View.find('.btn_cancel').click(cancel);
        Global.Click(windowModel.View.find('.btn_save'), save);
        service.Event.Bind();
        show();
    };
    this.Show = function (opts) {
        callarOptions = opts;
        formModel.Date = '';
        if (windowModel) {
            show();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/AccountantArea/Templates/Depreciation/Add.html', function (response) {
                createWindow(response);
            }, function (response) {
            });
        }
    };
    (function () {
        this.Bind = function () {
            Global.DatePicker.Bind($(formInputs['To']), {
                format: 'dd/MM/yyyy', onChange: function (date) {
                    formModel.depreciateTo = date;
                    console.log([date]);
                    service.Grid.Refresh();
                }
            });
        };
    }).call(service.Event = {});
    (function () {
        var gridModel;
        function addDepreciation(model)
        {
            model.BookValue = 0;
            var startAt=model.DepreciationStartAt.getDate();
            var from = new Date(Math.max(startAt, formModel.LastDepreciationAt)), to = formModel.depreciateTo;
            from.setMonth(from.getMonth() + 1);
            if (model.DepreciationMethod != 0 && from <= to)
            {
                var dpr, amount = 0;
                var rate = model.DepreciationRateType == 0 ? model.Rate : (100).div(model.DepreciationLife||1);
                
                while (from <= to && (model.DepreciationCostLimit - model.DepreciationCost - model.BookValue) > 1)
                {
                    amount = (model.Amount - (model.DepreciationMethod == 2 ? model.DepreciationCost : 0) - model.DepreciationSalvageValue) .mlt( rate).div(1200);
                    model.BookValue += amount;
                    //model.DepreciationCost += amount;
                    from.setMonth(from.getMonth() + 1);
                }
            }
            model.BookAmount = model.BookValue.toMoney();
        }
        function dateRange(model,list) {
            model = model || { LastDepreciationAt: (list.length ? list.orderBy('DepreciationStartAt')[0].DepreciationStartAt : "/Date(" + new Date().getTime() + ")/") };
            var date = formModel.LastDepreciationAt = model.LastDepreciationAt = model.LastDepreciationAt.getDate();
            model.LastDepreciationAt.Date().setDate(1);
            formModel.From = date.format('dd/MM/yyyy');
            formModel.depreciateTo =new Date(date);
            formModel.depreciateTo.setMonth(formModel.depreciateTo.getMonth()+1);
            formModel.To = formModel.depreciateTo.format('dd/MM/yyyy');
        };
        function setData(list) {
            dateRange(list[1][0], list[0]);
            list[0].each(function () {
                addDepreciation(this);
            });
            gridModel.dataSource = list[0];
            gridModel.Reload();
        };
        function load() {
            Global.CallServer('/AccountantArea/Depreciation/GetDepreciableAsset', function (response) {
                if (!response.IsError) {
                    setData(response.Data);
                } else {
                    alert('Errors');
                }
            }, function (response) {
                response.Id = -8;
                alert('Errors');
            }, null, 'Get');
        };
        function setGrid() {
            console.log([windowModel.View.find('#depreciate_grid_container'), windowModel.View]);
            Global.Grid.Bind({
                Name: 'Depreciation',
                elm: windowModel.View.find('#depreciate_grid_container'),
                columns: [
                    { field: 'AssetType', title: 'Asset Type' },
                    { field: 'AssetAccount', title: 'Asset Account' },
                    { field: 'AccumulatedDepreciationAccount', title: 'Accumulated Depreciation Account' },
                    { field: 'DepreciationExpenseAccount', title: 'Depreciation Expense Account' },
                    { field: 'BookAmount', title: 'Book Amount' }
                ],
                dataSource: [],
                page: { 'PageNumber': 1, 'PageSize': 1000, showingInfo: ' {0}-{1} of {2} Assets '},
                Printable: false,
                onComplete: function (model) {
                    gridModel = model;
                    load();
                }
            });
        };
        this.Bind = function () {
            if (gridModel) {
                load();
            } else {
                setGrid();
            }
        };
        this.Refresh = function () {
            gridModel.dataSource.each(function () {
                addDepreciation(this);
            });
        };
        this.GetData = function () {
            var list = [];
            gridModel.dataSource.each(function () {
                console.log([this, this.BookAmount, this.BookAmount > 0]);
                if (this.BookValue > 0) {
                    list.push({
                        FixedAssetId: this.Id,
                        AssetAccountId: this.AssetAccountId,
                        AccumulatedDepreciationAccountId: this.AccumulatedDepreciationAccountId,
                        DepreciationExpenseAccountId: this.DepreciationExpenseAccountId,
                        From: formModel.LastDepreciationAt.format('yyyy/MM/dd') + ' 00:00',
                        To: formModel.depreciateTo.format('yyyy/MM/dd') + ' 00:00',
                        Amount: this.BookValue
                    });
                }
            });
            return list;
        };
    }).call(service.Grid = {});
};

