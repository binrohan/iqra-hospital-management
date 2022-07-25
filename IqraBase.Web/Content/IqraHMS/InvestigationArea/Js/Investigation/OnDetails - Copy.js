var Controller = new function () {
    var callarOptions, filter = { "field": "InvestigationId", "value": "", Operation: 0 };
    
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
                url: '/Content/IqraHMS/InvestigationArea/Js/InvestigationItemRelation/AppScripts.js',
                OnLoaded: function (tab) {
                    tabModel = tab;
                    model.Reload();
                },
                onSubmit: function (formModel, data, model) {
                    if (data) {
                        formModel.Id = data.Id
                    }
                    formModel.InvestigationId = filter.value;
                },
                drp: [{
                    Id: 'InvestigationItemId',
                    position: 1,
                    url: function () {
                        return '/InvestigationArea/InvestigationItem/AutoCompleteBy?investigationId='+filter.value
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
            title: 'Investigation',
            model: model.model,
            OnChange: model.OnChange,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                        { field: 'Name', title: 'Test Name', filter: true, position: 4, Add: { sibling: 3 } },
                        { field: 'InvestigationCategory', title: 'Category', filter: true, Add: false, position: 1 },
                        { field: 'Room', title: 'Room', filter: true, Add: false, position: 3 },
                        { field: 'Cost', title: 'Cost', position: 9, Type: 2, Add: { sibling: 3, dataType: 'float' } },
                        { field: 'MaxDiscount', title: 'Max Discount', position: 9, Type: 2, required: false, selected: false, Add: { sibling: 3, dataType: 'float|null' } },
                        { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                        { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                        { field: 'Creator', add: false, filter: true },
                        { field: 'Remarks', title: 'Remarks', filter: true, required: false, Add: { type: 'textarea', sibling: 1 } }
                    ],
                    model: model.model,
                    DetailsUrl: function () {
                        return '/InvestigationArea/Investigation/Details?Id=' + callarOptions.model.Id;
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
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=InvestigationDetails',
        });
    };
};