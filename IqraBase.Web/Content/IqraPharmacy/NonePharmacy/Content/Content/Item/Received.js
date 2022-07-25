
(function () {
    var that = this, gridModel, statuses = ['Initiated', 'Received', '', '', '', '', '', '', '', '', '', 'Canceled',];
    var opts = {
        name: 'Received',
        url: '/Content/IqraPharmacy/NonePharmacy/Content/Content/Item/AddReceived.js',
        onSaveSuccess: function () {
            gridModel.Reload();
        }
    };
    var filters = typeof window.ItemType == 'undefined' ? [] : [{ field: 'prs.Type', value: ItemType, Operation: 0 }];
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onAdd() {
        opts.model = undefined;
        Global.Add(opts);
    };
    function onEdit(model) {
        opts.model = model;
        Global.Add(opts);
    };
    function onDataBinding(data) {

    };
    function rowBound(elm) {
        var link = '="/Pharmacy/PharmacyItemReceive/Picture?Id=' + this.Id + '" '
        $(elm.find('td')[0]).html('<a href' + link + ' target="_blank"><img src' + link + 'style="max-width: 100px; max-height: 100px;"></a>');
        this.Status == 11 && elm.css({ color: 'red' }).find('a').css({ color: 'red' });
        if (this.Status == 11) {
            elm.find('.fa-trash').closest('a').css({ opacity: 0.4, cursor: 'default' });
        }
        //this.Status = statuses[this.Status] || this.Status;
    };
    function onDetails(model) {
        Global.Add({
            PurchaseId: model.Id,
            name: 'PurchaseDetails',
            url: '/Content/IqraPharmacy/ProductPurchaseArea/Content/PurchaseDetails.js',
        });
    };
    function onSuplierDetails(model) {
        Global.Add({
            SuplierId: model.SuplierId,
            name: 'SuplierDetails',
            url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
        });
    };
    function onRemove(model) {
        if (model.Status == 11) {
            return;
        }
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: {
                name: 'OrderRemoved',
                save: '/ProductPurchaseArea/Purchase/Cancel?Id=' + model.Id,
                data: { Id: model.Id },
                onsavesuccess: function () {
                    gridModel.Reload();
                }, onerror: function (response) {
                    console.log(response);
                    switch (response.Id) {
                        case -3:
                            alert('No Purchase Found.');
                            break;
                        case -4:
                            alert('This is alredy canceled.');
                            break;
                        case -5:
                            alert('Some data is sold from this purchase.');
                            break;
                        case -6:
                            alert(response.Msg);
                            break;
                        case -8:
                            alert('Network Error');
                            break;
                    }
                },
            }
        });
    };
    Global.List.Bind({
        Name: 'PharmacyItem',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Image', title: 'Image', filter: false, sorting: false },
                { field: 'VoucherNo', title: 'Voucher', filter: true, Click: onDetails },
                { field: 'Suplier', filter: true, Click: onSuplierDetails },
                { field: 'Creator', filter: true },
                { field: 'Discount' },
                { field: 'VAT' },
                { field: 'TradePrice', title: 'Trade Price' },
                { field: 'MarginDiscount', title: 'Margin Discount' },
                { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
            ],
            Actions: [{
                click: onRemove,
                html: '<a style="margin-right:8px;"><i class="fa fa-trash" aria-hidden="true"></i></a>'
            }],
            url: '/PharmacyItemReceive/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, filter: filters, showingInfo: ' {0}-{1} of {2} Received Info ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: false, Edit: false,
        remove: false
    });
    Global.Click($('#btn_add_new'), onAdd);
})();
