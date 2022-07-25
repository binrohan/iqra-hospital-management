var Controller = new function () {
    var callarOptions, filter = { "field": "ReferenceId", "value": "", Operation: 0 };
    function setGrid(container, model, name) {
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
    };
    function getTab(title, name) {
        return {
            title: title,
            Grid: [function (windowModel, container, position, model, func) {
                setGrid(container, model, name);
            }],
        }
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = callarOptions.AssetId;
        Global.Add({
            title: 'Fixed Asset Details',
            model: model.model,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                { field: 'Name', filter: true },
                { field: 'Number', filter: true },
                { field: 'PurchaseAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'Amount' },
                { field: 'Rate' },
                { field: 'DepreciationLife' },
                { field: 'DepreciationEndtAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                { field: 'Creator', required: false, filter: true, className: 'creator' },
                    ],
                    model: model.model,
                    Id: callarOptions.AssetId,
                    DetailsUrl: function () {
                        return '/AccountantArea/FixedAsset/Details?Id=' + callarOptions.AssetId;
                    }
                },
                getTab('Bills', 'Bill')
            ],
            name: 'OnFixedAssetDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=FixedAssetDetails',
        });
    };
};