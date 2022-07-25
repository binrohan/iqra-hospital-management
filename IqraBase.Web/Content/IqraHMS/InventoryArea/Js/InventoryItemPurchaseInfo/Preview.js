
var Controller = new function () {
    var service = {}, windowModel, formModel = {}, gridModel, callerOptions;
    function m2f(money) {
        return parseFloat(((money || '0') + '').replace(',', '').replace(' ', '') || '0') || 0;
    };
    function save() {
        windowModel.Wait('Please Wait while saving data......');
        Global.Uploader.upload({
            data: { info: callerOptions.model.model, items: callerOptions.model.list },
            url: '/InventoryArea/InventoryItemPurchaseInfo/AddNew',
            onProgress: function (data) {
                //console.log(data);
            },
            onComplete: function (response) {
                windowModel.Free();
                if (!response.IsError) {
                    close(callerOptions.onSaveSuccess);
                } else if (response.Id === -4) {
                    alert('This voucher is already returned.')
                }
                else
                    Global.Error.Show(response);
            },
            onError: function () {
                windowModel.Free();
                response.Id = -8;
                Global.Error.Show(response, { user: '' })
            }
        });
    }
    function close(func) {
        windowModel && windowModel.Hide(func);
    };

    function populateSummary() {
        for (var key in callerOptions.model.model) {
            formModel[key] = m2f(callerOptions.model.model[key]).toMoney(4);
        }
    };
    this.Show = function (model) {
        callerOptions = model;
        console.log(model);
        if (windowModel) {
            windowModel.Show();
            service.Grid.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/InventoryArea/Templates/Preview.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '95%' }); 
                inputs = Global.Form.Bind(formModel, windowModel.View);
                Global.Click(windowModel.View.find('.btn_cancel'), close, noop);
                windowModel.View.find('.btn_save').click(save);
                windowModel.Show();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('.preview_grid'),
                columns: [
                    { field: 'Position', title: 'Sr' },
                    { field: 'Name', filter: true },
                    { field: 'CurrentStock', title: 'Stock' },
                    { field: 'InventoryUnit', title: 'Inventory Unit' },
                    { field: 'Quantity', title: 'Quentity' },
                    { field: 'UnitPrice', title: 'UnitPrice',type:2 },
                    { field: 'TotalPrice', title: 'TotalPrice', type: 2 },
                    { field: 'Discount', title: 'Discount(T)', type: 2 },
                    { field: 'PayablePrice', title: 'Payable Price', type: 2 }
                ],
                dataSource: callerOptions.model.list,
                page: { 'PageNumber': 1, 'PageSize': 1000, showingInfo: ' {0}-{1} of {2} Items ' },
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#print_container');
                    }
                }
            };
            return opts;
        };
        this.Bind = function () {
            if (gridModel) {
                gridModel.dataSource = callerOptions.model.list;
                gridModel.Reload();
            } else {
                Global.Grid.Bind(getOptions());
            }
            populateSummary();
        };
    }).call(service.Grid = {});
};