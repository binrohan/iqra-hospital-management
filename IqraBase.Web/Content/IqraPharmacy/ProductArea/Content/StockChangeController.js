

var Controller = new function (none) {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions,
                filter = { "field": "ItemId", "value": "", Operation: 0 };

    function close() {
        windowModel && windowModel.Hide();
    };
    function reset() {
        windowModel.View.find('.tab-content .tab-pane').removeClass('in active');
        windowModel.View.find('ul.nav.nav-tabs li').removeClass('active');
    };
    function setTabEvent() {
        windowModel.View.find('ul.nav.nav-tabs li').click(function () {
            service[this.dataset.field].Bind();
        });
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        filter.value = model.model.Id;
        if (windowModel) {
            windowModel.Show();
            service.BasicInfo.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductArea/Templates/StockChange.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.BasicInfo.Bind();
                setTabEvent();
            }, noop);
        }
    };
    (function () {
        var isBind, formModel = {}, dataSource = {}, userId;
        function save() {
            var stock = parseFloat(formModel.ChangedStock);
            if (stock>-1) {
                windowModel.Wait();
                Global.CallServer('/ProductArea/Product/StockChange', function (response) {
                    windowModel.Free();
                    if (!response.IsError) {
                        callerOptions.model.TotalStock = stock;
                        //options.onSaveSuccess(formModel, formInputs);
                        close();
                    } else {
                        Global.Error.Show(response, {});
                    }
                }, function (response) {
                    windowModel.Free();
                    response.Id = -8;
                    alert('Network Errors.');
                }, { itemId: callerOptions.model.Id, stock: stock }, 'POST');
            } else {
                alert('Validation Errors.');
            }
            return false;
        }
        function bind() {
            if (!isBind) {
                isBind = true;
                var inputs = Global.Form.Bind(formModel, windowModel.View.find('#basic_info'));
                $(inputs['ChangedStock']).keyup(function () {
                    var stock = parseFloat(formModel.ChangedStock);
                    formModel.CSTMRPPrice = stock * callerOptions.model.UnitSalePrice;
                    formModel.CSTTPPrice = stock * callerOptions.model.UnitTradePrice
                });
                windowModel.View.find('.btn_save').click(save);
            }
            reset();
            windowModel.View.find('#basic_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        }
        function populate() {
            var model = Global.Copy({}, callerOptions.model, true);
            model.TotalMRPPrice = model.UnitSalePrice * model.TotalStock;
            model.TotalTPPrice = model.UnitTradePrice * model.TotalStock;
            for (var key in formModel) {
                typeof (model[key]) != typeof (none) && (formModel[key] = model[key]);
            }
        };
        function load() {
            Global.CallServer('/Employee/Details?Id=' + callerOptions.UserId, function (response) {
                if (!response.IsError) {
                    dataSource[callerOptions.UserId] = response.Data;
                    populate(response.Data);
                } else {
                    error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                error.Save(response, saveUrl);
            }, null, 'Get');
        };
        this.Bind = function () {
            bind();
            if (userId === callerOptions.model.Id) {
                return;
            }
            populate();
            userId = callerOptions.model.Id;
        };
    }).call(service.BasicInfo = {});
    (function () {
        var gridModel, formModel = {}, userId, txtType = ['Purchase', 'Sale', 'Return', 'Adjustment', 'Purchase Cancel'];

        function getTypeFileter() {
            return {
                DropDown: {
                    dataSource: [
                        { text: 'Select Type', value: '' },
                        { text: 'Purchase', value: '0' },
                        { text: 'Sale', value: '1' },
                        { text: 'Return', value: '2' },
                        { text: 'Adjustment', value: '3' },
                        { text: 'Purchase Cancel', value: '4' }
                    ]
                }
            };
        };
        function onSelect(model) {
            switch (model.TypeOrg) {
                case 0:
                    break;
            }
        }
        function rowBound(elm) {
            Global.Click(elm, onSelect, this);
        };
        function onDataBinding(response) {
            formModel.StockChanged = (response.Data.Total.StockChanged || 0).toMoney(4);
            response.Data.Total = response.Data.Total.Total;
            response.Data.Data.each(function () {
                this.TypeOrg = this.Type;
                this.ItemType = txtType[this.Type] || this.Type;
            });
        };
        function getOptions(filter) {
            //console.log(filter);
            var opts = {
                Name: 'LoginInfo',
                elm: windowModel.View.find('#stock_history_grid'),
                columns: [
                    { field: 'ItemType', title: 'ChangedType', filter: getTypeFileter() },
                    { field: 'StockChanged', title: 'Qnt Changed' },
                    { field: 'StockAfterChanged', title: 'Stock After Changed' },
                    { field: 'TotalTradePrice', title: 'Stock TP' },
                    { field: 'TotalSalePrice', title: 'Stock MRP' },
                    { field: 'CreatedAt', title: 'ChangedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                    //      ,[TotalTradePrice]
      //, [TotalSalePrice]
                ],
                url: '/ProductArea/Product/StockHistory',
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Items ', filter: filter },
                dataBinding: onDataBinding,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: {
                    container: windowModel.View.find('#stock_history .button_container'),
                },
            };
            return opts;
        };
        this.Bind = function () {
            if (!gridModel) {
                Global.Grid.Bind(getOptions(Global.Filters().Bind({
                    container: windowModel.View.find('#stock_history .filter_container'),
                    formModel: formModel,
                    filter: [filter],
                    Type: 'ThisMonth',
                    onchange: function (filter) {
                        if (gridModel) {
                            gridModel.page.filter = filter;
                            gridModel.Reload();
                        }
                    }
                })));
            } else {
                gridModel.Reload();
            }
            reset();
            windowModel.View.find('#stock_history').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[1]).addClass('active');
        }
    }).call(service.StockHistory = {});
};