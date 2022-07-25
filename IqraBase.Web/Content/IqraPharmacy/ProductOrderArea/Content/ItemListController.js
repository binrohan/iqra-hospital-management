
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
            gridModel.Reload();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/Pharmacy/Templates/ItemList.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                Global.Submit(windowModel.View.find('form'), save);
                windowModel.Show();
                service.Grid.Bind();
                //service.Loader.Load(callerOptions.SuplierId);
            }, noop);
        }
    };
    (function () {
        this.Load = function (suplierId) {
            Global.CallServer('/Order/GetItems?SuplierId=' + suplierId, function (response) {
                if (!response.IsError) {
                    dataSource[suplierId] = response.Data;
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
            console.log(response);
            response.Data.Data.each(function () {
                this.OrderedQuentity = this.SoldQuentity - this.TotalStock;
                this.UnitTPrice = (this.UnitTradePrice || 0) * this.UnitConversion;
                this.UnitMRPPrice = (this.UnitSalePrice || 0) * this.UnitConversion;
                this.UnitPrice = this.UnitPrice || 0;
                this.VAT = this.VAT || this.Vat || 0;
                this.Discount = this.PurchaseDiscount || this.Discount||0;
                this.TotalPrice = 0;
                this.VatTotal = 0;
                this.TotalDiscount = 0;
                this.Code = this.Code || '';
            });
            dataSource[callerOptions.SuplierId] = response.Data.Data;
        };
        function getColumns() {
            var cols = [{ field: 'Code', title: 'Barcode', filter: true, width: 120 },
                    { field: 'Name', title: 'Trade Name', filter: true },
                    { field: 'Category', title: 'Category', filter: true },
                    { field: 'Suplier', filter: true, width: 200 },
                    { field: 'Strength', title: 'Strength' },
                    { field: 'TotalStock', title: 'Stock', width: 60 },
                    { field: 'SoldDaysForParchaseRequired', title: 'Days', width: 60, autobind: false },
                    { field: 'SoldQuentity', title: 'Required', width: 70, autobind: false },
                    { field: 'OrderedQuentity', title: 'OrderedQnty', className: 'ordered_quentity', autobind: false, width: 100 },
                    //{ field: 'UnitTradePrice', width: 100, title: 'UnitPrice', className: 'unit_price', autobind: false },
                    //{ field: 'VAT', width: 100, className: 'vat', autobind: false },
                    //{ field: 'Discount', width: 100, className: 'discount', autobind: false },
                    //{ field: 'TotalPrice', title: 'TotalPrice', width: 70, autobind: false }
            ];

            if (callerOptions.ItemType === 0) {
                cols = cols.slice(1);
            }
            return cols;
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#item_selector_grid'),
                columns: getColumns(),
                //dataSource: dataSource[callerOptions.SuplierId] || [],
                dataBinding: onDataBinding,
                rowBound: rowBound,
                url: function () {
                    return '/Order/GetItems?SuplierId=' + callerOptions.SuplierId;
                },
                //pagging: false,
                page: { 'PageNumber': 1, 'PageSize': 10 },
                pagger: { showingInfo: ' {0}-{1} of {2} Items ' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                onrequest: function (data) {

                },
                Printable: false
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