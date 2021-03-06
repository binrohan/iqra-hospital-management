var Controller = {};
(function () {
    var that = this, gridModel, service = {}, accessModel, callarOptions = {},
        model = {}, formModel = {}, filter;
    function onSubmit(formModel, data, model) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onCreatorDetails(model) {
        Global.Add({
            UserId: model.CreatedBy,
            name: 'UserDetails',
            url: '/Areas/EmployeeArea/Content/User/UserDetails.js',
        });
    }
    function onDetails(model) {
        Global.Add({
            model: model,
            name: 'InvestigationItemDetails',
            url: '/Content/IqraHMS/InvestigationArea/Js/InvestigationItem/OnDetails.js',
        });
    }
    function onInvestigationDetails(model) {
        Global.Add({
            InvestigationId: model.InvestigationId,
            name: 'InvestigationDetails',
            url: '/Content/IqraHMS/InvestigationArea/Js/Investigation/OnDetails.js',
        });
    }
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
        //this.Updator && elm.find('.updator').append('</br><small><small>' + this.UpdatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
        //this.Creator && elm.find('.creator').append('</br><small><small>' + this.CreatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
    };
    function setGrid(container) {
        Global.List.Bind({
            Name: 'InvestigationItem',
            Grid: {
                elm: container.find('#grid_container'),
                columns: [
                    { field: 'Name', filter: true, click: onDetails, position: 1, add: { sibling: 3 } },//BatchNumber
                    { field: 'Investigation', filter: true, click: onInvestigationDetails, add: false },//BatchNumber
                    { field: 'Refference', filter: true, required: false, position: 3, Add: { type: 'textarea', sibling: 1 } },
                    { field: 'Remarks', filter: true, required: false, position: 4, Add: { type: 'textarea', sibling: 1 } },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                    { field: 'Creator', add: false, filter: true, click: onCreatorDetails }
                ],
                url: '/InvestigationArea/InvestigationItem/Get',
                page: { 'PageNumber': 1, 'PageSize': 10, filter: [filter], showingInfo: ' {0}-{1} of {2} Items ' },
                //onDataBinding: onDataBinding,
                rowBound: rowBound
            },
            onComplete: function (model) {
                gridModel = model;
            },
            Add: {
                elm: container.find('#btn_add_new_item'),
                onSubmit: onSubmit,
                save: '/InvestigationArea/InvestigationItem/Create',
                saveChange: '/InvestigationArea/InvestigationItem/Edit',
                dropdownList: [
                {
                    Id: 'InvestigationId',
                    position: 2,
                    url: '/InvestigationArea/Investigation/AutoComplete',
                    Type: 'AutoComplete',
                }
            ]
            },
            remove: { save: '/InvestigationArea/InvestigationItem/Delete' },
            onSuccess: function () {
                if (gridModel) {
                    gridModel.Reload();
                }
            }
        });
        callarOptions.BaseModel.Reload = function () {
            gridModel && gridModel.Reload();
        };
    };
    Controller.Show = function (opt) {
        callarOptions = opt;
        console.log(['callarOptions', opt]);
        opt.BaseModel = opt.BaseModel || {};
        var container = opt.container || $('#page_container');
        filter = filter||opt.filter || [];
        setGrid(container);
        opt.OnLoaded && !service.Loaded && opt.OnLoaded(model);
        service.Loaded = true;
    };
})();