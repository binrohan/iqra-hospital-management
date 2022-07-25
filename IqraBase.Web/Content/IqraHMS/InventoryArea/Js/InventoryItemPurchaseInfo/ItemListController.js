
var Controller = new function () {
    var service = {}, windowModel, dataSource = [], selected = {}, callerOptions, gridModel;
    function save() {
        var list = [];
        if (dataSource && dataSource.each) {
            dataSource.each(function () {
                this.Selected && list.push(this);
                this.Selected = false;
            });
        }
        callerOptions.onSaveSuccess(list);
        close();
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        if (windowModel) {
            windowModel.Show();
            gridModel && gridModel.Reload();
        } else {
            Global.LoadTemplate('/Content/IqraHMS/InventoryArea/Templates/ItemList.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                windowModel.Show();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        function onSelect(model) {
            if (model.Selected) {
                model.Selected = false;
                $(this).removeClass('i-state-selected');
            } else {
                model.Selected = true;
                $(this).addClass('i-state-selected');
            }
        }
        function rowBound(elm) {
            Global.Click(elm, onSelect,this);
        };
        function onDataBinding(response) {
            dataSource = response.Data.Data;
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#item_selector_grid'),
                columns: [
                    { field: 'Name', filter: true },
                    { field: 'CurrentStock', title: 'Stock', width: 80 },
                    { field: 'UsedDaysForPurchaseRequired', title: 'Days', width:70 },
                    { field: 'UsedQuentity', title: 'Used', width: 70 },
                    { field: 'InventoryUnit', title: 'Inventory Unit', width: 130 },
                    { field: 'UnitPrice', width: 100, title: 'UnitPrice', type:2 }
                ],
                dataBinding: onDataBinding,
                rowBound: rowBound,
                url: '/InventoryArea/HMSInventoryItem/GetRequired',
                page: { 'PageNumber': 1, 'PageSize': 10 },
                pagger: { showingInfo: ' {0}-{1} of {2} Items ' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                Printable: false
            });
        };
    }).call(service.Grid = {});
};