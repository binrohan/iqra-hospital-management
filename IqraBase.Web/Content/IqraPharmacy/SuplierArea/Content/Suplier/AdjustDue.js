
(function () {
    function onDetails(model) {
        Global.Add({
            SuplierId: model.Id,
            name: 'SuplierDetails',
            url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
        });
    };
    function onAddOrderCategory(model) {
        Global.Add({
            model: model,
            name: 'AdjustSuplierPayment',
            url: '/Content/IqraPharmacy/SuplierArea/Content/SuplierPaymentAdjust/AdjustSuplierPayment.js',
            onSaveSuccess: function () {
                gridModel.Reload();
            }
        });
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            this.Due = this.TradePrice - this.PaidAmount;
        });
        response.Data.Total = response.Data.Total.Total
    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'Suplier',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Suplier', filter: true, Click: onDetails },
                { field: 'TradePrice',title:'Bill',type:2 },
                { field: 'PaidAmount', title: 'Paid', type: 2 },
                { field: 'Due', title: 'Due', type: 2,sorting:false },
            ],
            Actions: [{
                click: onAddOrderCategory,
                html: '<a style="margin-right:8px;" class="icon_container" title="Add Order Category"><span class="glyphicon glyphicon-open"></span></a>'
            }],
            url: '/SuplierArea/Suplier/AdjustDueData',
            page: { 'PageNumber': 1, 'PageSize': 50, showingInfo: ' {0}-{1} of {2} Categories ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,

        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: false,
        Edit:false,
        remove: false
    });
})();
