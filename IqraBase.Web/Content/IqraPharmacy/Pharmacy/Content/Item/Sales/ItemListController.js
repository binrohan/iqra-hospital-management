
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions, gridModel;
    function save() {
        var list = [];
        if (dataSource[callerOptions.SuplierId]) {
            dataSource[callerOptions.SuplierId].each(function () {
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
            dataSource[callerOptions.SuplierId] ? service.Grid.Reload(dataSource[callerOptions.SuplierId]) : service.Loader.Load(callerOptions.SuplierId);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/Pharmacy/Templates/ItemList.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                Global.Submit(windowModel.View.find('form'), save);
                windowModel.Show();
                service.Grid.Bind();
                service.Loader.Load(callerOptions.SuplierId);
            }, noop);
        }
    };
    (function () {
        this.Load = function (suplierId) {
            Global.CallServer('/PharmacyItem/Get?SuplierId=' + suplierId, function (response) {
                if (!response.IsError) {
                    dataSource[suplierId] = response.Data.Data;
                    service.Grid.Reload(dataSource[suplierId]);
                } else {
                    error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                error.Save(response, saveUrl);
            }, null, 'Get');
        }
    }).call(service.Loader = {});
    (function () {
        function onSelect(model) {
            if (model.Selected) {
                model.Selected = false;
                $(this).removeClass('i-state-selected');
            } else {
                model.Selected = true;
                $(this).addClass('i-state-selected');
            }
            console.log(model);
        }
        function rowBound(elm) {
            //var selector = $();
            //elm.find().html(selector);
            elm.click(function () {

            });
            Global.Click(elm, onSelect,this);
        };
        function onDataBinding(response) {

        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#item_selector_grid'),
                columns: [{ field: 'Name', title: 'Trade Name' },
                    { field: 'Strength', title: 'Strength' },
                    { field: 'PackSize', title: 'Pack Size' },
                    { field: 'PackQuentity', title: 'Pack Quentity' },
                    { field: 'UnitQuentity', title: 'Unit Quentity' },
                    { field: 'UnitPrice', title: 'UnitPrice' },
                    { field: 'TotalPrice', title: 'TotalPrice' },
                    { field: 'UnitSalePrice', title: 'Unit Sale Price' },
                    { field: 'Vat' },
                    { field: 'Discount' },
                    //{ field: 'Action', className: 'action' }
                ],
                dataSource: dataSource[callerOptions.SuplierId] || [],
                dataBinding: onDataBinding,
                rowBound: rowBound,
                pagging: false,
                page: { 'PageNumber': 1, 'PageSize': 10 },
                pagger: { showingInfo: ' {0}-{1} of {2} Items ' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                onrequest: function (data) {

                }
            });
        }
        this.Reload=function(list){
            if (gridModel) {
                gridModel.dataSource = list;
                gridModel.Reload();
            }
        }
    }).call(service.Grid = {});
};