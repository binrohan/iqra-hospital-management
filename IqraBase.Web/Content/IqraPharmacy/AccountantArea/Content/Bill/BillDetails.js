var Controller = new function () {
    var callarOptions, filter = { "field": "BillId", "value": "", Operation: 0 };
    function onCreate(func) {
        Global.Add({
            model: callarOptions.model,
            BillId:callarOptions.BillId,
            OnSuccess: function (response) {
                func && func();
                console.log([callarOptions, callarOptions.OnChange]);
                callarOptions.OnChange && callarOptions.OnChange(response);
            },
            name: 'OnAddBillPayment',
            url: '/Content/IqraPharmacy/AccountantArea/Content/BillPayment/AddBillPayment.js',
        });
    };
    function setGrid(container, model, name, creator) {
        var tabModel = {}, view = $(`<div><div id="summary_container" class="row">
                                        </div>
                                        <div id="filter_container" class="row">
                                        </div>
                                        <div style="margin-top:10px;">
                                            <div id="button_container" class="empty_style button_container row">
                                                <a href="#" class="btn btn-white btn-success btn-round pull-right" id="btn_add_new" style="margin-left: 1%"><span class="glyphicon glyphicon-plus"></span>New</a>
                                            </div>
                                            <div id="grid_container">
                                            </div>
                                        </div></div>`);
        container.append(view);
        model.Reload = function () {
            Global.Add({
                container: view,
                BaseModel: model,
                filter: [filter],
                name: name + 'Tab',
                url: '/Content/IqraPharmacy/AccountantArea/Content/' + name + '/AppScript.js',
                OnLoaded: function (tab) {
                    tabModel = tab;
                    model.Reload();
                }
            });
        };
        Global.Click(view.find('.button_container a'), creator, function () {
            tabModel && tabModel.gridModel && tabModel.gridModel.Reload();
        });
    };
    function getTab(title, name, creator) {
        return {
            title: title,
            Grid: [function (windowModel, container, position, model, func) {
                setGrid(container, model, name, creator);
            }],
        }
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = callarOptions.BillId;
        Global.Add({
            title: 'Bill Details',
            model: model.model,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                { field: 'From', filter: true },
                { field: 'Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'DueDate', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'Total', type: 2 },
                { field: 'PaidAmount', tilte: 'Paid', type: 2 },
                { field: 'DueAmount', tilte: 'Due', type: 2 },
                { field: 'TotalTax', tilte: 'Tax', type: 2 },
                { field: 'Creator', required: false, filter: true, className: 'creator' },
                    ],
                    model: model.model,
                    Id: callarOptions.BillId,
                    DetailsUrl: function () {
                        return '/AccountantArea/Bill/Details?Id=' + callarOptions.BillId;
                    }
                },
                getTab('Payments', 'BillPayment', onCreate)
            ],
            name: 'OnBillDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=BillDetails',
        });
    };
};