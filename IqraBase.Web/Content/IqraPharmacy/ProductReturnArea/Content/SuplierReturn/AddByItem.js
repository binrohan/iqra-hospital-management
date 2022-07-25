var Controller = new function () {
    var windowModel, formModel = { IsTotal :true}, inputs = {}, callerOptions, service = {}, gridModel;
    function save() {
        var model = service.Grid.GetData();
        if (model.model.ReturnAmount <= 0) {
            alert('Return amount can not be 0(zero).');
            console.log(inputs);
            $(inputs['RetunAmount']).focus();
            return;
        }
        if (model.list.length > 0) {
            Global.Add({
                model: model,
                close: close,
                onSaveSuccess: function () {
                    close();
                    callerOptions.onSaveSuccess();
                },
                url: '/Content/IqraPharmacy/ProductReturnArea/Content/SuplierReturn/Preview.js',
            });
        }
    };
    function onSelect() {
        if (formModel.SuplierId) {
            Global.Add({
                name: 'ProductList',
                SuplierId:formModel.SuplierId,
                url: '/Content/IqraPharmacy/ProductReturnArea/Content/SuplierReturn/ItemSelector.js',
                Data: gridModel.dataSource,
                onSaveSuccess: function (model) {
                    service.Grid.AddItems([model]);
                },
                IsValid: function (model) {
                    if (model.TotalStock <= 0) {
                        setTimeout(function () { alert('No Stock'); }, 0);
                    }
                    return model.TotalStock > 0;
                }
            });
        } else {
            alert('Please select suplier first.');
        }
    };
    function close() {
        windowModel && windowModel.Hide();
    };
    function onShow() {
        windowModel.Show();
        formModel.IsTotal = true;
        service.Grid.Reset();
    };
    this.Show = function (model) {
        callerOptions = model;
        if (windowModel) {
            onShow();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductReturnArea/Templates/SuplierReturnByItem.html', function (response) {
                windowModel = Global.Window.Bind(response, {width:'98%'});
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                Global.Click(windowModel.View.find('.btn_select'), onSelect);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                onShow();
                service.Suplier.Bind();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        this.Bind = function () {
            Global.AutoComplete.Bind({
                url: '/SuplierArea/Suplier/AutoComplete',
                elm: $(inputs['SuplierId']).empty(),
                change: function (data) {
                    service.Grid.Reset();//CounterId
                }
            });
        }
    }).call(service.Suplier = {});
    (function () {
        var dataModel = [], selfService = {};
        function up(elm, func, option) {
            elm.keyup(function () {
                func.call(this, option);
            }).focus(function () { $(this).select(); }).click(function (e) { e.stopPropagation(); return false; });
            return elm;
        };
        function getInput(attr, placeHolder, func, option) {
            return up($('<input data-binding="' + attr + '" name="' + attr + '" class="form-control" type="text" style="width: calc(100% - 24px); margin: 2px 0px;" placeholder="' + placeHolder + '" autocomplete="off">'), func, option);
        };
        function setMoney(model,td) {

            $(td[9]).html((model.TotalTP || 0).toMoney(4));
            $(td[10]).html((model.TotalVat || 0).toMoney(4));
            $(td[11]).html((model.TotalDiscount || 0).toMoney(4));
            $(td[12]).html((model.PayableAmount || 0).toMoney());
            console.log([model,td]);
        };
        function rowBound(elm) {
            var td = elm.find('td');
            selfService.UnitQuentity.Set($(td[8]), this);
            $(td[4]).html(this.UnitPurchasePrice.toFloat(4));
            $(td[5]).html(this.Vat.toFloat(4));
            $(td[6]).html(this.PurchaseDiscount.toFloat(4));
            setMoney(this, td);
        };
        function onChange(data) {
            var item = 0, qnt = 0, tp = 0, vat = 0, discount = 0,mrp=0, quantity;
            dataModel.each(function () {
                quantity=parseFloat(this.ReturnedQuantity||'0');
                if (quantity > 0) {
                    item++;
                    qnt += quantity;
                    tp += (this.TotalTP||0);
                    vat += (this.TotalVat || 0);
                    discount += (this.TotalDiscount || 0);
                    //namt += (this.PayableAmount || 0);
                }
            });
            formModel.ReturnItem = item;
            formModel.ReturnQuentity = qnt;
            formModel.TPPrice = tp.toFloat(4);
            formModel.Discount = discount.toFloat(4);
            formModel.Vat = vat.toFloat(4);
            //formModel.MRP = namt.toFloat(4);
            formModel.PayableTP = (tp + vat - discount).toFloat(4);
        };
        function getModel() {
            var returnAmount = m2f(formModel.RetunAmount || '0'),
                totalTP = m2f(formModel.PayableTP || 0);
            model = {
                SuplierId: formModel.SuplierId,
                PurchasedBy: '00000000-0000-0000-0000-000000000000',
                PurchaseInfoId: '00000000-0000-0000-0000-000000000000',
                VoucharNo: '',
                ItemPurchased: 0,
                ItemReturn: formModel.ReturnItem,
                TotalPurchasePrice: totalTP,
                PurchasedPrice: totalTP,
                ReturnPrice: returnAmount,
                ReturnDiscount: (totalTP - returnAmount).div(totalTP).mlt(100),
                Discount: 0,
                TotalReturnDiscount: totalTP - returnAmount,
                TotalDiscount: m2f(formModel.Discount || 0),
                PurchasePrice: m2f(formModel.TPPrice || 0),
                PurchaseVAT: m2f(formModel.Vat || 0),
                PurchaseDiscount: m2f(formModel.Discount || 0)
            };
            return model;
        };
        this.Bind = function () {
            Global.Grid.Bind({
                elm: windowModel.View.find('#grid'),
                columns: [
                    { field: 'Name', filter: true },
                    { field: 'Strength', filter: true },
                    { field: 'Category', filter: true },
                    { field: 'Suplier', filter: true },
                    { field: 'UnitPurchasePrice', title: 'Unit TP' },
                    { field: 'Vat', title: 'VAT', className: 'vat' },
                    { field: 'PurchaseDiscount', title: 'Discount', className: 'discount' },
                    { field: 'TotalStock', title: 'Stock' },
                    { field: 'ReturnedQuantity', title: 'Returned Qnt', className: 'returned_quantity', autobind: false },
                    { field: 'TotalTP', title: 'Total TP' },
                    { field: 'TotalVat', title: 'TVat' },
                    { field: 'TotalDiscount', title: 'TDiscount' },
                    { field: 'PayableAmount', title: 'Net Amount' }
                ],
                dataSource: dataModel = [],
                page: { 'PageNumber': 1, 'PageSize': 9999999, filter: [] },
                pagging: false,
                pagger:false,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: false
            });
        };
        this.AddItems = function (list) {
            list.each(function () {
                gridModel.Add(this);
            });
        };
        this.GetData = function () {
            var list = [], previewList = [], model = getModel(), quantity
            discount = model.ReturnDiscount.div(100);
            dataModel.each(function () {
                quantity = m2f(this.ReturnedQuantity || '0');
                if (quantity > 0) {
                    var price = quantity.mlt(this.UnitTradePrice),
                        unitReturnPrice = this.UnitTradePrice + this.UnitTradePrice.mlt(discount),
                    item = {
                        ItemId: this.Id,
                        ItemReceiveId: this.ItemReceiveId,
                        SalesUnitTypeId: this.SalesUnitTypeId,
                        SuplierReturnId: '00000000-0000-0000-0000-000000000000',
                        VoucharNo: '',
                        PurchaseQnt: 0,
                        ReturnQnt: quantity,
                        TotalPurchasePrice: price,
                        PurchasePrice: price,
                        ReturnAmount: unitReturnPrice.mlt(quantity),
                        UnitReturnPrice: unitReturnPrice,
                        ReturnDiscount: discount,
                        Discount: 0,
                        //SoldPrice-ReturnAmount
                        TotalReturnDiscount: price - unitReturnPrice.mlt(quantity),
                        TotalDiscount: 0,
                        UnitTradePrice: this.UnitTradePrice,
                        TotalTradePrice: this.UnitTradePrice.mlt(quantity),
                        UnitPurchasePrice: this.UnitPurchasePrice,
                        UnitPurchaseVAT: this.Vat.mlt(this.UnitPurchasePrice).div(100),//Vat Is PurchaseVat
                        UnitPurchaseDiscount: this.PurchaseDiscount.mlt(this.UnitPurchasePrice).div(100),
                    }
                    previewList.push({
                        Name: this.Name,
                        Strength: this.Strength,
                        Category: this.Category,
                        Suplier: this.Suplier,
                        ReturnAmount: item.ReturnAmount.toFloat(4),
                        ReturnQnt: item.ReturnQnt
                    });
                    list.push(item);
                    //model.PurchasePrice += item.UnitPurchasePrice.mlt(quantity);
                    //model.PurchaseVAT += item.UnitPurchaseVAT.mlt(quantity);
                    //model.PurchaseDiscount += item.UnitPurchaseDiscount.mlt(quantity);
                }
            });
            return { list: list, previewList: previewList, model: model, formModel: formModel };
        };
        this.Reset = function () {
            if (gridModel) {
                dataModel = gridModel.dataSource = [];
                gridModel.Reload();
                var obj = { SuplierId: true, Title:true };
                for (var key in formModel) {
                    if (!obj[key]) {
                        formModel[key] = 0;
                    }
                }
            }
        };
        (function () {
            function onReturnQntChanged(model) {
                var value = parseInt(this.value || '0');
                if (value > model.TotalStock) {
                    alert("You can't return more than stock quantity. ");
                    value = model.TotalStock;
                }
                model.ReturnedQuantity = value;
                model.TotalTP = value.mlt(model.UnitPurchasePrice);
                model.TotalVat = model.TotalTP.mlt(model.Vat).div(100);
                model.TotalDiscount = model.TotalTP.mlt(model.PurchaseDiscount).div(100);
                model.PayableAmount = model.TotalTP + model.TotalVat - model.TotalDiscount;
                setMoney(model, $(this).closest('tr').find('td'));
                onChange(model);
            }
            this.Set = function (td, model) {
                td.html(getInput('ReturnedQuantity', 'Returned Quantity', onReturnQntChanged, model));
                Global.Form.Bind(model, td);
            };
        }).call(selfService.UnitQuentity = {});
    }).call(service.Grid = {});
};