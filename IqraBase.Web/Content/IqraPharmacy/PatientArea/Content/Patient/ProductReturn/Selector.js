
var Controller = new function () {
    var service = {}, windowModel, dataSource = [], selected = {}, callerOptions,
        gridModel, added = {}, filter = { "field": "CustomerId", "value": "", Operation: 0 };
    function save() {
        var list = [];
        dataSource.each(function () {
            this.Selected && !added[this.Id] && list.push(this);
            this.Selected = false;
        });
        callerOptions.onSaveSuccess(list);
        gridModel.views.tBody.find('.i-state-selected').removeClass('i-state-selected');
        close();
    };
    function close() {
        //dataSource = [];
        windowModel && windowModel.Hide();
    };
    function show(options) {
        var model;
        added = {};
        windowModel.Show();
        (options.Data || []).each(function () {
            added[this.Id] = this;
        });
        gridModel && gridModel.Reload();
    };
    this.Show = function (model) {
        selected = {};
        filter.value = model.PatientId;
        callerOptions = model;
        if (windowModel) {
            show(callerOptions);
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductArea/Templates/Selector.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                show(callerOptions);
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        function onSelect(model) {
            if (!added[model.Id] && (!callerOptions.IsValid || callerOptions.IsValid(model))) {
                if (model.Selected) {
                    model.Selected = false;
                    $(this).removeClass('i-state-selected');
                } else {
                    model.Selected = true;
                    $(this).addClass('i-state-selected');
                }
            }
        };
        function rowBound(elm) {
            if (added[this.Id]) {
                elm.addClass('already_added');
            } else {
                Global.Click(elm, onSelect, this);
                var model = this;
                elm.dblclick(function () {
                    if (!added[model.Id] && (!callerOptions.IsValid || callerOptions.IsValid(model))) {
                        callerOptions.onSaveSuccess([model]);
                        added[model.Id] = model;
                        elm.addClass('already_added');
                    }
                });
            }
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.ReturnedQuantity = 0;
            });
            dataSource = response.Data.Data;
        };
        function onDetails(model) {
            Global.Add({
                ItemId: model.Id,
                name: 'ProductDetails',
                url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
            });
        };
        function onSuplierDetails(model) {
            Global.Add({
                SuplierId: model.SuplierId,
                name: 'SuplierDetails',
                url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
            });
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#item_selector_grid'),
                columns: [
                    { field: 'Code', filter: true },
                    { field: 'Name', filter: true, Click: onDetails },
                    { field: 'Strength', filter: true },
                    { field: 'Category', filter: true },
                    { field: 'Suplier', filter: true, Click: onSuplierDetails },
                    { field: 'UnitPurchasePrice', title: 'Unit TP',type:2 },
                    { field: 'Vat', title: 'VAT', type: 2 },
                    { field: 'PurchaseDiscount', title: 'Purchase Discount', type: 2 },
                    { field: 'UnitSalePrice', title: 'Unit MRP', type: 2 },
                    { field: 'TotalStock', title: 'Stock', type: 2 }
                ],
                url: '/PatientArea/PharmacyPatient/Items',
                dataBinding: onDataBinding,
                rowBound: rowBound,
                page: { 'PageNumber': 1, 'PageSize': 10, filter: [filter] },
                pagger: { showingInfo: '{0}-{1} of {2} Items' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                Printable: false
            });
        };
    }).call(service.Grid = {});
};