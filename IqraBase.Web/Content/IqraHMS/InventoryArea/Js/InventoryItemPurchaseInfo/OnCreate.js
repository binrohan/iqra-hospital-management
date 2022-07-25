
var Controller = new function () {
    var service = {}, windowModel, formModel = {}, callerOptions, gridModel, formInputs = {}, dataCache = {};
    function m2f(money) {
        return parseFloat(((money || '0') + '').replace(',', '').replace(' ', '') || '0') || 0;
    };
    function getData() {
        var items = service.Grid.GetData(),tDis=m2f(formModel.Discount) + m2f(formModel.Reduce);
        var model = {
            TotalPrice: formModel.TotalPrice,
            Discount: formModel.Discount,
            Reduce: formModel.Reduce,
            TotalDiscount: tDis,
            PayableAmount: m2f(formModel.PayableAmount),
            PaidAmount: formModel.PaidAmount,
            DueAmount: formModel.DueAmount
        };
        return {
            model: model,
            list: items.List,
            IsValid: formModel.IsValid && items.IsValid,
            msg: items.msg
        };
    };
    function save() {
        var model = getData();
        if (model.IsValid) {
            Global.Add({
                name: 'InventoryItemPurchaseInfoPreview',
                url: '/Content/IqraHMS/InventoryArea/Js/InventoryItemPurchaseInfo/Preview.js',
                model:model,
                onSaveSuccess: function () {
                    callerOptions.onSaveSuccess();
                    close();
                }
            });
        } else if (model.msg) {
            alert(model.msg);
        } else {
            alert('Validation Errors');
        }
    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function onSelectItem() {
        var opts = {
            name: 'InventoryItemSelector',
            url: '/Content/IqraHMS/InventoryArea/Js/InventoryItemPurchaseInfo/ItemListController.js',
            onSaveSuccess: function (list) {
                var newList = [];
                list.each(function () {
                    newList.push(Global.Copy({}, this, true));
                });
                service.Grid.AddItems(newList);
            }
        };
        Global.Add(opts);
    };
    function clearItems() {
        service.Grid.Clear();
    };
    function show() {
        windowModel.Show();
        clearItems();
    };
    this.Show = function (model) {
        callerOptions = model;
        dataCache = {};
        if (windowModel) {
            show()
        } else {
            Global.LoadTemplate('/Content/IqraHMS/InventoryArea/Templates/AddPurchase.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '99%' });
                formInputs = Global.Form.Bind(formModel, windowModel.View);
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.View.find('.btn_add_item').click(onSelectItem);
                windowModel.View.find('.btn_clear_item').click(clearItems);
                Global.Click(windowModel.View.find('.btn_save'), save);
                show();
                service.Grid.Bind();
                service.Events.Bind();
            }, noop);
        }
    };
    (function () {
        var dataSource = [], tPrice = 0,  tDiscount = 0,payableAmount=0;
        function up(elm, func, option) {
            elm.keyup(function () {
                func.call(this, option);
            }).focus(function () { $(this).select(); });
            return elm;
        }
        function summaryChanged() {
            tPrice = 0, tDiscount = 0;
            for (var i = 0; i < dataSource.length; i++) {
                tPrice += dataSource[i].TotalPrice;
                tDiscount += dataSource[i].Discount;
            }

            payableAmount = tPrice - parseFloat(formModel.Reduce || '0') - tDiscount;
            formModel.PayableAmount = payableAmount.toMoney(4);
            formModel.TotalPrice = tPrice.toFloat(4);
            formModel.Discount = tDiscount.toFloat();
            formModel.PaidAmount = payableAmount.toFloat(4);
            formModel.DueAmount = 0;
        };
        function OnQuantityChanged(model) {
            model.Quantity = parseFloat(model.FormModel.Quantity || '0');
            model.TotalPrice = model.Quantity.mlt(model.UnitPrice).toFloat(4);
            if (model.DiscountP > 0) {
                model.FormModel.Discount = model.Discount = model.TotalPrice.mlt(model.DiscountP).div(100);
            }
            model.PayablePrice = model.TotalPrice - model.Discount;
            summaryChanged();
        };
        function onUnitPriceChanged(model) {
            model.UnitPrice = parseFloat(model.FormModel.UnitPrice || '0');
            model.TotalPrice = model.Quantity.mlt(model.UnitPrice).toFloat(4);
            if (model.DiscountP > 0) {
                model.FormModel.Discount = model.Discount = model.TotalPrice.mlt(model.DiscountP).div(100);
            }
            model.PayablePrice = model.TotalPrice - model.Discount;
            summaryChanged();
        };
        function onDiscountPChanged(model) {
            model.DiscountP = parseFloat(model.FormModel.DiscountP || '0');
            if (model.DiscountP > 0) {
                model.FormModel.Discount = model.Discount = model.TotalPrice.mlt(model.DiscountP).div(100);
            } else {
                model.FormModel.Discount = model.Discount = 0;
            }
            model.PayablePrice = model.TotalPrice - model.Discount;
            summaryChanged();
        };
        function onDiscountTChanged(model) {
            model.Discount = parseFloat(model.FormModel.Discount || '0');
            if (model.TotalPrice > 0) {
                model.FormModel.DiscountP = model.DiscountP = model.Discount.div(model.TotalPrice).mlt(100);
            } else {
                model.FormModel.DiscountP = model.DiscountP = 0;
            }
            model.PayablePrice = model.TotalPrice - model.Discount;
            summaryChanged();
        };
        function setIndex() {
            gridModel.Body.view.find('tr').each(function (i) {
                var model = $(this).data('model');
                model.Index = i + 1;
            });
        }
        function onRemove(model) {
            var list = [], i = 1;
            dataSource.each(function () {
                if (model.Id != this.Id) {
                    list.push(this);
                }
            });
            dataSource = list;
            formModel.TotalItems = dataSource.length;
            $(this).closest('tr').remove();
            setIndex();
            summaryChanged();
        };
        function rowBound(elm) {
            var td = elm.find('td'), index = 1;
            $(td[index + 5]).html(up($('<input required="" data-binding="Quantity" class="form-control" type="text" style="width: calc(100% - 12px);" autocomplete="off">'), OnQuantityChanged, this));
            $(td[index + 6]).html(up($('<input required="" data-binding="UnitPrice" class="form-control" type="text" style="width: calc(100% - 12px);" autocomplete="off">'), onUnitPriceChanged, this));
            $(td[index + 8]).html(up($('<input data-binding="DiscountP" class="form-control" type="text" style="width: calc(100% - 12px);" autocomplete="off">'), onDiscountPChanged, this));
            $(td[index + 9]).html(up($('<input data-binding="Discount" class="form-control" type="text" style="width: calc(100% - 12px);" autocomplete="off">'), onDiscountTChanged, this));
            var pModel = this.FormModel;
            this.FormModel = {};
            Global.Form.Bind(this.FormModel, elm);
            for (var key in this.FormModel) { if (typeof (this[key]) != 'undefined') this.FormModel[key] = this[key]; }
            if (pModel) {
                for (var key in pModel) { this.FormModel[key] = pModel[key]; }
            }
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#item_grid'),
                columns: [
                    { field: 'Index', title: 'Sr', sorting: false, width: 30 },
                    { field: 'Name', filter: true },
                    { field: 'CurrentStock', title: 'Stock', width: 60 },
                    { field: 'UsedDaysForPurchaseRequired', title: 'Days', width: 60 },
                    { field: 'UsedQuentity', title: 'Used', width: 60, sorting: false, },
                    { field: 'InventoryUnit', title: 'Inventory Unit', width: 130 },
                    { field: 'Quantity', title: 'Quentity', sorting: false, className: 'purchase_quentity', autobind: false, width: 90 },
                    { field: 'UnitPrice', width: 100, title: 'UnitPrice', className: 'unit_price', autobind: false },
                    { field: 'TotalPrice', title: 'TotalPrice', width: 70, sorting: false },
                    { field: 'DiscountP', title: 'Discount(P)', width: 90, className: 'discount_p', sorting: false, autobind: false },
                    { field: 'Discount', title: 'Discount(T)', width: 90, className: 'discount_t', sorting: false, autobind: false },
                    { field: 'PayablePrice', title: 'Payable Price', width: 150, sorting: false },
                    { field: 'delete', title: 'Action', width: 70, click: onRemove }
                ],
                dataSource: [],
                rowBound: rowBound,
                page: { 'PageNumber': 1, 'PageSize': 10 },
                pagger: { showingInfo: ' {0}-{1} of {2} Items ' },
                oncomplete: function (model) {
                    gridModel = model;
                },
                Printable: false
            });
        }
        this.Clear = function () {
            if (gridModel) {
                tPrice = 0;
                tDiscount = 0;
                dataSource = [];
                formModel.TotalItems = 0;
                gridModel.Body.view.empty();
                summaryChanged();
            }
        };
        this.AddItems = function (list) {
            var dataObj = {};
            dataSource.each(function () {
                dataObj[this.Id] = true;
            });
            var dup = [];
            list.each(function () {
                if (dataObj[this.Id]) {
                    dup.push(this);
                    return;
                }
                this.Quantity = 0;
                this.TotalPrice = 0;
                this.DiscountP = 0;
                this.Discount = 0;
                this.PayablePrice = 0;
                this.delete = 'Delete';
                gridModel.Add(this);
                dataSource.push(this);
            });
            setIndex();
            summaryChanged();
            formModel.TotalItems = dataSource.length;
            if (dup.length) {
                alert(dup.length + ' Items was duplicated.But we did not add the duplicate elements.')
            }
        };
        this.GetData = function () {
            var list = [], isValid = true, msg = '';
            dataSource.each(function () {
                list.push({
                    HMSInventoryItemId: this.Id,
                    Name: this.Name,
                    CurrentStock: this.CurrentStock,
                    InventoryUnitId: this.InventoryUnitId,
                    InventoryUnit: this.InventoryUnit,
                    Quantity: this.Quantity,
                    UnitPrice: this.UnitPrice,
                    TotalPrice: this.TotalPrice,
                    Discount: this.Discount,
                    PayablePrice: this.PayablePrice,
                    Position: this.Index
                });
                if (this.OrderedQuentity <= 0) {
                    isValid = false;
                    msg = 'Ordered Quentity must be greater than 0.'
                }
            });
            if (list.length < 1) {
                isValid = false;
                msg = 'Please select at least one item and the proceed'
            }
            return { List: list, IsValid: isValid, msg: msg };
        };
        this.Changed = summaryChanged;
    }).call(service.Grid = {});
    (function () {
        function onReduceChanged() {
            var totalPrice = m2f(formModel.TotalPrice),
                discount = m2f(formModel.Discount),
                reduce = m2f(formModel.Reduce),
                payable = totalPrice - discount - reduce;

            formModel.PayableAmount=payable.toMoney(4);
            formModel.PaidAmount=payable;
            formModel.DueAmount = 0;
        };
        function onPaidAmountChanged() {
            var payableAmount = m2f(formModel.PayableAmount),
                paidAmount = m2f(formModel.PaidAmount);

            formModel.DueAmount = payableAmount - paidAmount;
        };
        function onDueAmountChanged() {
            var payableAmount = m2f(formModel.PayableAmount),
                dueAmount = m2f(formModel.DueAmount);

            formModel.PaidAmount = payableAmount - dueAmount;
        };

        this.Bind = function () {
            $(formInputs['Reduce']).keyup(onReduceChanged).focus(function () { $(this).select(); });
            $(formInputs['PaidAmount']).keyup(onPaidAmountChanged).focus(function () { $(this).select(); });
            $(formInputs['DueAmount']).keyup(onDueAmountChanged).focus(function () { $(this).select(); });
        };
    }).call(service.Events = {});
};