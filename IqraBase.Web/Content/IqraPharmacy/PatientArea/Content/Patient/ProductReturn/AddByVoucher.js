
var Controller = new function () {
    var windowModel, formModel = { IsTotal: true }, inputs = {}, callerOptions, service = {}, gridModel, purchaseModel;
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
        Global.Add({
            name: 'PurchaseList',
            url: '/Content/IqraPharmacy/ProductPurchaseArea/Content/Selector.js',
            onSaveSuccess: function (model) {
                purchaseModel = model;
                formModel.SuplierId = model.SuplierId;
                service.Loader.Load(model.Id);
                populate(model);
            }
        });
    };
    function populate(model) {
        formModel.PurchaseAt = model.CreatedAt;
        formModel.PurchaseItem = model.ItemCount.toMoney(4);
        formModel.PurchaseVat = model.VAT.toMoney(4);
        formModel.PurchaseDiscount = model.Discount.toMoney(4);
        formModel.PurchasePayableTP = model.TradePrice.toMoney(4);
    };
    function onDiscountPChange() {
        formModel.IsTotal = false;
        var price = parseFloat(formModel.SoldPrice || '0');
        formModel.TotalReturnDiscount = parseFloat(formModel.ReturnDiscount || '0').mlt(price).div(100);
        formModel.RetunAmount = price - parseFloat(formModel.TotalReturnDiscount || '0');
    };
    function onDiscountTChange() {
        formModel.IsTotal = true;
        var price = parseFloat(formModel.SoldPrice || '0');
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
            Global.LoadTemplate('/Content/IqraPharmacy/ProductReturnArea/Templates/SuplierReturnByVoucher.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '98%' });
                windowModel.View.find('.btn_cancel').click(close);
                Global.Click(windowModel.View.find('.btn_save'), save);
                Global.Click(windowModel.View.find('.btn_select'), onSelect);
                inputs = Global.Form.Bind(formModel, windowModel.View);
                $(inputs['IsShowAll']).change(service.Grid.SetAll);
                $(inputs['ReturnDiscount']).change(onDiscountPChange).keyup(onDiscountPChange);
                $(inputs['TotalReturnDiscount']).change(onDiscountTChange).keyup(onDiscountTChange);
                onShow();
                service.Grid.Bind();
            }, noop);
        }
    };
    (function () {
        function getColumnData(response) {
            var data, item = {},
                columns = response.Data.Columns[0],
                orginal = response.Data.Data[0];

            response.Data = [];
            orginal.each(function () {
                data = this;
                response.Data.push(item);
                columns.each(function (i) {
                    item[this] = data[i];
                });
                item = {};
            });
            return response;
        }
        this.Load = function (purchaseInfoId) {
            gridModel.Busy();
            Global.CallServer('/ProductReturnArea/SuplierReturn/PurchaseList?purchaseInfoId=' + purchaseInfoId, function (response) {
                gridModel.Free();
                gridModel.dataSource = [];
                response.Data = response.Data[0].orderBy('Position');
                purchaseModel.TotalItems = response.Data;
                //console.log(['response.Data', response.Data]);
                service.Grid.AddItems(response.Data);
            }, function (response) {
            }, null, 'GET', null, false);
        }
    }).call(service.Loader = {});
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
        function setMoney(model, td) {
            var dic = {TotalTP: true, TotalVat: true, TotalDiscount: true, PayableAmount: true };
            gridModel.columns.each(function (i) {
                if (dic[this.field]) {
                    $(td[i]).html((model[this.field] || 0).toMoney(4));
                }
            });
        };
        function rowBound(elm) {
            selfService.UnitQuentity.Set(elm.find('.returned_quantity'), this);
            if (this.TotalStock < this.UnitQuentity) {
                elm.addClass('doubt');
            }
        };
        function onChange(data) {
            var item = 0, qnt = 0, tp = 0, vat = 0, discount = 0, mrp = 0, quantity;
            dataModel.each(function () {
                quantity = parseFloat(this.ReturnedQuantity || '0');
                if (quantity > 0) {
                    item++;
                    qnt += quantity;
                    tp += (this.TotalTP || 0);
                    vat += (this.TotalVat || 0);
                    discount += (this.TotalDiscount || 0);
                    //namt += (this.PayableAmount || 0);
                }
            });
            formModel.ReturnItem = item;
            formModel.ReturnQuentity = qnt.toMoney();
            formModel.TPPrice = tp.toMoney();
            formModel.Discount = discount.toMoney();
            formModel.Vat = vat.toMoney();
            //formModel.MRP = namt.toFloat(4);
            formModel.PayableTP = formModel.RetunAmount = (tp + vat - discount).toFloat(4);
        };
        function getModel() {
            var returnAmount = m2f(formModel.RetunAmount||0),
                totalTP = m2f(formModel.PayableTP || 0);
            model = {
                SuplierId: formModel.SuplierId,
                PurchasedBy: purchaseModel.CreatedBy,
                PurchaseInfoId: purchaseModel.Id,
                VoucharNo: '',
                ItemPurchased: purchaseModel.ItemCount,
                ItemReturn: m2f(formModel.ReturnItem||0),
                TotalPurchasePrice: m2f(formModel.PurchasePayableTP),
                PurchasedPrice: totalTP,
                ReturnPrice: returnAmount,
                ReturnDiscount: (totalTP - returnAmount).div(totalTP).mlt(100),
                Discount: purchaseModel.Discount,
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
                    { field: 'GenericName',title:'GenericName', filter: true, selected: false },
                    { field: 'Strength', filter: true,selected:false },
                    { field: 'Category', filter: true, selected: false },
                    { field: 'Suplier', filter: true, selected: false },
                    { field: 'UnitPurchasePrice', title: 'Unit TP', type: 2 },
                    { field: 'UnitTradePrice', title: 'Unit TP(Payable)', type: 2, selected: false },
                    { field: 'Vat', title: 'VAT(%)', className: 'vat', type: 2 },
                    { field: 'UnitVAT', title: 'Unit VAT', type: 2, selected: false },
                    { field: 'PurchaseDiscount', title: 'Discount(%)', type: 2 },
                    { field: 'UnitDiscount', title: 'Unit Discount', type: 2, selected: false },
                    { field: 'MarginDiscount', title: 'Margin Discount', type: 2, selected: false },
                    { field: 'UnitQuentity', title: 'Purchased Qnt', type: 2 },
                    { field: 'TotalStock', title: 'Stock', type: 2 },
                    { field: 'ReturnedQuantity', title: 'Returned Qnt', className: 'returned_quantity', autobind: false },
                    { field: 'TotalTP', title: 'Total TP', type: 2 },
                    { field: 'TotalVat', title: 'TVat' },
                    { field: 'TotalDiscount', title: 'TDiscount' },
                    { field: 'PayableAmount', title: 'Net Amount' },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm yyyy', selected: false }
      //              ,itmprs.[ItemId]
	  //,itm.[Name]
	  //,itm.[GenericName]
	  //,itm.[Name] [Description]
	  //,itm.[Strength]
	  //,itm.SuplierId
	  //,itm.Name [Suplier]
	  //,itm.[TotalStock]
      //,itmprs.[PurchaseInfoId]
      //,itmprs.[SalesUnitTypeId]
      //,itmprs.[PurchaseUnitTypeId]
      //,itmprs.[UnitConversion]
      //,itmprs.[UnitQuentity]
      //,itmprs.[UnitQuentitySold]
      //,itmprs.[UnitTradePrice]
      //,itmprs.[TotalTradePrice]
      //,itmprs.[VAT]
      //,itmprs.[TotalVAT]
      //,itmprs.[Discount]
      //,itmprs.[TotalDiscount]
      //,itmprs.[Position]
      //,itmprs.[MGFDate]
      //,itmprs.[EXPDate]
      //,itmprs.[BatchName]
      //,itmprs.[ActivateAt]
      //,prsinf.[CreatedAt]
      //,prsinf.[CreatedBy]
      //,itmprs.[Type]
      //,itmprs.[MarginDiscount]
	  //,ctgr.Name [Category]
	  //,untp.Name [Unit]
	  //,itmprs.[UnitPurchasePrice]
	  //,itmprs.[UnitVAT]
	  //,itmprs.[UnitDiscount]
                ],
                dataSource: dataModel = [],
                page: { 'PageNumber': 1, 'PageSize': 9999999, filter: [] },
                pagging: false,
                pagger: false,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: false
            });
        };
        this.AddItems = function (list) {
            var qnt = 0,tp=0;
            list.each(function () {
                this.Vat = this.VAT;
                this.PurchaseDiscount = this.Discount;
                qnt += this.UnitQuentity;
                tp += this.TotalTP = this.UnitPurchasePrice * this.UnitQuentity;
                this.TotalVat = this.TotalVAT;
                this.TotalDiscount = this.TotalDiscount;
                this.PayableAmount = this.TotalTradePrice;
                this.ReturnedQuantity = Math.min( this.TotalStock,this.UnitQuentity);
                //this.PayableAmount = this.TotalTP + this.TotalVat - this.TotalDiscount;
                gridModel.Add(this);
            });
            formModel.PurchaseQuentity = qnt.toMoney(4);
            formModel.PurchaseTP = tp.toMoney(4);

            dataModel = list;
            onChange();
        };
        this.GetData = function () {
            var list = [], previewList = [], model = getModel(),tp=0,
                quantity, totalDiscount, discount, untRediscount = model.ReturnDiscount.div(100);///discount*100;
            dataModel.each(function () {
                quantity = m2f(this.ReturnedQuantity || '0');
                if (quantity > 0) {
                    tp=this.UnitTradePrice.mlt(quantity);
                    discount=0;
                    if(untRediscount>0){
                        discount = tp-tp.div(untRediscount);
                    }
                    var item = {
                        ItemId: this.ItemId,
                        ItemReceiveId: this.Id,
                        SalesUnitTypeId: this.SalesUnitTypeId,
                        SuplierReturnId: '00000000-0000-0000-0000-000000000000',
                        VoucharNo: '',
                        PurchaseQnt: this.UnitQuentity,
                        ReturnQnt: quantity,
                        TotalPurchasePrice: this.TotalTP,
                        PurchasePrice: this.UnitPurchasePrice.mlt(quantity),
                        ReturnAmount: tp - discount,
                        UnitReturnPrice: (tp - discount).div(quantity),
                        ReturnDiscount: model.ReturnDiscount,
                        Discount: this.Discount,
                        TotalReturnDiscount: discount,
                        TotalDiscount: this.TotalDiscount,
                        UnitTradePrice: this.UnitTradePrice,
                        TotalTradePrice: tp,
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
                var obj = { SuplierId: true, Title: true };
                for (var key in formModel) {
                    if (!obj[key]) {
                        formModel[key] = 0;
                    }
                }
            }
        };
        (function () {
            function onReturnQntChanged(model,isNotChange) {
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
                !isNotChange && onChange(model);
            }
            this.Set = function (td, model) {
                var qnt = model.ReturnedQuantity, input = getInput('ReturnedQuantity', 'Returned Quantity', onReturnQntChanged, model);
                td.html(input);
                Global.Form.Bind(model, td);
                model.ReturnedQuantity = qnt;
                onReturnQntChanged.call(input[0],model, true);
            };
        }).call(selfService.UnitQuentity = {});
    }).call(service.Grid = {});
};