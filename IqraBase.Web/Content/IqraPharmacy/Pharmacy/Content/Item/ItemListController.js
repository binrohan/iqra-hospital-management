
var Controller = new function () {
    var service = {}, windowModel, dataSource = [], selected = {}, callerOptions, gridModel,
        filter = { field: 'ItemSuplierId', value: '', Operation: 0 };
    function save() {
        var list = [];
        dataSource.each(function () {
            this.Selected && list.push(this);
            this.Selected = false;
        });
        callerOptions.onSaveSuccess(list);
        close();
    }
    function close() {
        dataSource = [];
        windowModel && windowModel.Hide();
    };
    this.Show = function (model) {
        selected = {};
        dataSource = [];
        callerOptions = model;
        filter.value = model.SuplierId;
        if (windowModel) {
            windowModel.Show();
            gridModel && gridModel.Reload();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/Pharmacy/Templates/ItemList.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                Global.Submit(windowModel.View.find('form'), save);
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
            //var selector = $();
            //elm.find().html(selector);
            elm.click(function () {

            });
            Global.Click(elm, onSelect,this);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.TradeName = this.Name;
                this.OrderedQuentity = 0;
            });
            dataSource = response.Data.Data;
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#item_selector_grid'),
                columns: [{ field: 'Name', title: 'Trade Name',filter:true },
                    { field: 'Strength', title: 'Strength', filter: true },
                    { field: 'Category', filter: true },
                    { field: 'UnitTradePrice', title: 'Unit TP' },
                    { field: 'UnitSalePrice', title: 'Unit MRP' },
                    { field: 'Vat' },
                    { field: 'Discount' }
                ],
                url: '/ProductArea/Product/GetBySuplier',
                dataBinding: onDataBinding,
                rowBound: rowBound,
                pagging: false,
                page: { 'PageNumber': 1, 'PageSize': 10, filter: [filter] },
                pagger: { showingInfo: ' {0}-{1} of {2} Items ' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                onrequest: function (data) {

                },
                Printable: false
            });
        }
    }).call(service.Grid = {});
};