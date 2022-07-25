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
        console.log(['model', model]);
        if (model.list.length > 0) {
            Global.Add({
                model: model,
                close: close,
                onSaveSuccess: function () {
                    close();
                    callerOptions.onSaveSuccess();
                },
                url: '/Content/IqraPharmacy/PatientArea/Content/Patient/ProductReturn/ReturnByItemPreview.js',
            });
        }
    };
    function onSelect() {
        Global.Add({
            PatientId: callerOptions.PatientId,
            name: 'ProductList',
            url: '/Content/IqraPharmacy/PatientArea/Content/Patient/ProductReturn/Selector.js',
            Data: gridModel && gridModel.dataSource||[],
            onSaveSuccess: function (list) {
                service.Grid.AddItems(list);
            }
        });
    };
    function onDiscountPChange() {
        formModel.IsTotal = false;
        var price = parseFloat(formModel.PayableTP || '0')||0;
        formModel.TotalReturnDiscount = parseFloat(formModel.ReturnDiscount || '0').mlt(price).div(100);
        formModel.RetunAmount = price - parseFloat(formModel.TotalReturnDiscount || '0');
    };
    function onDiscountTChange() {
        formModel.IsTotal = true;
        var price = parseFloat(formModel.PayableTP || '0')||0;
        formModel.ReturnDiscount = price > 0 ? parseFloat(formModel.TotalReturnDiscount || '0').div(price).mlt(100) : 0;
        formModel.RetunAmount = price - parseFloat(formModel.TotalReturnDiscount || '0');
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
            Global.LoadTemplate('/Content/IqraPharmacy/ProductReturnArea/Templates/AddReturnByItem.html', function (response) {
                windowModel = Global.Window.Bind(response, {width:'98%'});
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                Global.Click(windowModel.View.find('.btn_select'), onSelect);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                $(inputs['ReturnDiscount']).change(onDiscountPChange).keyup(onDiscountPChange);
                $(inputs['TotalReturnDiscount']).change(onDiscountTChange).keyup(onDiscountTChange);
                onShow();
                service.Grid.Bind();
            }, noop);
        }
    };
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
        function rowBound(elm) {
            selfService.UnitQuentity.Set(elm.find('.returned_quantity'), this);
            //elm.find('.vat').html(this.Vat.toFloat(4));
            //elm.find('.discount').html(this.PurchaseDiscount.toFloat(4));
        };
        function onChange(data) {
            var item = 0, qnt = 0, tp = 0, vat = 0, discount = 0, totalPayableTP=0, mrp = 0, quantity;
            dataModel.each(function () {
                quantity=parseFloat(this.ReturnedQuantity||'0');
                if (quantity > 0) {
                    item++;
                    qnt += quantity;
                    tp += (this.TotalTP||0);
                    vat += (this.TotalVat || 0);
                    totalPayableTP += (this.TotalPayableTP || 0);
                    discount += (this.TotalDiscount || 0);
                    mrp += (this.TotalMRP || 0);
                }
            });
            formModel.ReturnItem = item;
            formModel.ReturnQuentity = qnt;
            formModel.TPPrice = tp.toFloat(4);
            formModel.Discount = discount.toFloat(4);
            formModel.Vat = vat.toFloat(4);
            formModel.MRP = mrp.toFloat(4);
            formModel.PayableTP = (totalPayableTP).toFloat(4);
        };
        function getModel() {
                model = {
                    PatientId: callerOptions.PatientId,
                    TransectionType: 'Pharmacy-Return',
                    RelatedId: '00000000-0000-0000-0000-000000000000',
                    BillAmount: 0,
                    PaidAmount: formModel.RetunAmount,
                    Discount: 0,
                    Balance: 0,
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
                    { field: 'UnitPurchasePrice', title: 'Unit TP',type:2 },
                    { field: 'PurchaseVat', title: 'VAT', className: 'vat', type: 2 },
                    { field: 'PurchaseDiscount', title: 'Discount', className: 'discount', type: 2 },
                    { field: 'UnitTradePrice', title: 'Unit Payable TP', type: 2 },
                    { field: 'UnitSalePrice', title: 'Unit MRP', type: 2 },
                    { field: 'ReturnedQuantity', title: 'Returned Qnt', className: 'returned_quantity', autobind: false },
                    { field: 'TotalPayableTP', title: 'Total Payable TP' },
                    { field: 'TotalMRP', title: 'Total MRP' }
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
            var list = [], previewList = [], model = getModel(), quantity, tp = parseFloat(formModel.PayableTP || '0') || 0,
                totalDiscount = tp - parseFloat(formModel.RetunAmount || '0') || 0,
                discount = totalDiscount.div(tp);

            dataModel.each(function () {
                quantity = parseFloat(this.ReturnedQuantity || '0');
                if (quantity > 0) {
                    var unitReturnPrice = this.UnitTradePrice - this.UnitTradePrice.mlt(discount),
                    item = {
                        ItemId: this.Id,
                        SalesUnitTypeId: this.SalesUnitTypeId,
                        UnitQuentity: quantity,
                        UnitSalePrice: this.UnitSalePrice,
                        TotalSalePrice: quantity.mlt(this.UnitSalePrice),
                        UnitTradePrice: this.UnitTradePrice,
                        TotalTradePrice: this.UnitTradePrice.mlt(quantity),
                        ReturnAmount: unitReturnPrice.mlt(quantity),
                        UnitPurchasePrice: this.UnitPurchasePrice,
                        UnitPurchaseVAT: this.PurchaseVat.mlt(this.UnitPurchasePrice).div(100),
                        UnitPurchaseDiscount: this.PurchaseDiscount.mlt(this.UnitPurchasePrice).div(100),
                    };
                    item.Discount = item.TotalTradePrice - item.ReturnAmount;

                    previewList.push({
                        Name: this.Name,
                        Strength: this.Strength,
                        Category: this.Category,
                        Suplier: this.Suplier,
                        ReturnAmount: item.ReturnAmount.toFloat(4),
                        ReturnQnt: item.UnitQuentity
                    });
                    list.push(item);
                }
            });
            return { list: list, previewList: previewList, model: model, formModel: formModel };
        };
        this.Reset = function () {
            if (gridModel) {
                dataModel = gridModel.dataSource = [];
                gridModel.Reload();
            }
        };
        this.SetAll = function () {
            var item = 0, qnt = 0, price = 0, returnedAmount=0;
            dataModel.Data.each(function () {
                if (formModel.IsShowAll) {
                    item++;
                    this.ReturnedQuantity = this.UnitQuentity;
                    qnt += this.UnitQuentity;
                    returnedAmount = this.UnitQuentity.mlt(this.UnitTradePrice);
                    price += returnedAmount;
                    this.ReturnedAmount = returnedAmount.toFloat(4);
                } else {
                    this.ReturnedQuantity = 0;
                    this.ReturnedAmount = 0;
                }
            });
            formModel.ReturnItem = item;
            formModel.ReturnQuentity = qnt;
            formModel.PayableTP = price.toFloat(4);
            if (formModel.IsTotal) {
                formModel.ReturnDiscount =price>0? parseFloat(formModel.TotalReturnDiscount || '0').div(price).mlt(100):0;
            } else {
                formModel.TotalReturnDiscount = parseFloat(formModel.ReturnDiscount || '0').mlt(price).div(100).toFloat(4);
            }
            formModel.RetunAmount = (price - parseFloat(formModel.TotalReturnDiscount || '0')).toFloat(4);
            var discount = parseFloat(formModel.ReturnDiscount || '0') || 0;
            // Recalculate Return amount with discount.
            discount > 0 && dataModel.Data.each(function () {
                if (formModel.IsShowAll) {
                    this.ReturnedAmount = this.ReturnedAmount - this.ReturnedAmount.mlt(discount);
                }
            });

        };
        (function () {
            function onReturnQntChanged(model) {
                var value = parseInt(this.value || '0');
                model.ReturnedQuantity = value;
                model.TotalPayableTP = value.mlt(model.UnitTradePrice).toFloat(4);
                model.TotalTP = value.mlt(model.UnitPurchasePrice).toFloat(4);
                model.TotalVat = model.TotalTP.mlt(model.PurchaseVat).div(100).toFloat(4);
                model.TotalDiscount = model.TotalTP.mlt(model.PurchaseDiscount).div(100).toFloat(4);
                model.TotalMRP = value.mlt(model.UnitSalePrice).toFloat(4);
                onChange(model);
            }
            this.Set = function (td, model) {
                td.html(getInput('ReturnedQuantity', 'Returned Quantity', onReturnQntChanged, model));
                Global.Form.Bind(model, td);
            };
        }).call(selfService.UnitQuentity = {});
    }).call(service.Grid = {});
};