var Controller = new function () {
    var callarOptions, filter = { "field": "ItemId", "value": "", Operation: 0 };

    function getView() {
        return $(`<div><div id="summary_container" class="row">
                                        </div>
                                        <div id="filter_container" class="row">
                                        </div>
                                        <div style="margin-top:10px;">
                                            <div id="button_container" class="empty_style button_container row">
                                                <a href="#" class="btn btn-white btn-success btn-round pull-right" id="btn_add_new_item" style="margin-left: 1%"><span class="glyphicon glyphicon-plus"></span>New</a>
                                            </div>
                                            <div id="grid_container">
                                            </div>
                                        </div></div>`);
    };
    function setGrid(container, model, name, creator) {
        var tabModel = {}, view = getView();
        container.append(view);
        model.Reload = function () {
            Global.Add({
                container: view,
                BaseModel: model,
                filter: filter,
                name: 'Item-Tab',
                url: '/Content/IqraHMS/InvestigationArea/Js/InvestigationItemRelation/Investigation.js',
                OnLoaded: function (tab) {
                    tabModel = tab;
                    model.Reload();
                },
                onSubmit: function (formModel, data, model) {
                    if (data) {
                        formModel.Id = data.Id
                    }
                    formModel.InvestigationItemId = filter.value;
                    formModel.Remarks = formModel.RlnRemarks;
                },
                drp: [{
                    Id: 'InvestigationId',
                    position: 1,
                    url: function () {
                        return '/InvestigationArea/Investigation/AutoCompleteByItem?itemId=' + filter.value
                    },
                    Type: 'AutoComplete',
                }]
            });
        };
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.model.Id;
        Global.Add({
            title: 'InvestigationItem',
            model: model.model,
            OnChange: model.OnChange,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                        { field: 'Name', position: 1 },//BatchNumber
                        { field: 'Refference', position: 3 },
                        { field: 'Remarks', position: 4 },
                        { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy' },
                        { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy' },
                        { field: 'Creator'},
                    ],
                    model: model.model,
                    DetailsUrl: function () {
                        return '/InvestigationArea/InvestigationItem/Details?Id=' + callarOptions.model.Id;
                    }
                },
                {
                    title: 'Items',
                    Grid: [function (windowModel, container, position, model, func) {
                        setGrid(container, model);
                    }],
                }
            ],
            name: 'OnInvestigationDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=InvestigationItemDetails',
        });
    };
};