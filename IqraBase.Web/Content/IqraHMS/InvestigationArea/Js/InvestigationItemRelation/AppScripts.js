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
                    { field: 'Name', filter: true, Add: false},//BatchNumber
                    //{ field: 'Refference', filter: true, required: false, position: 3, Add: { type: 'textarea', sibling: 1 } },
                    { field: 'Remarks', filter: true, required: false, position: 4, Add: { type: 'textarea', sibling: 1 } },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                    { field: 'Creator', add: false, filter: true, click: onCreatorDetails }
                ],
                url: '/InvestigationArea/InvestigationItem/GetByCategory',
                page: { 'PageNumber': 1, 'PageSize': 10, filter: [filter], showingInfo: ' {0}-{1} of {2} Investigations ' },
                //onDataBinding: onDataBinding,
                rowBound: rowBound,
                Printable: {
                    Container: function () {
                        return container.find('#button_container');
                    },
                    html: '<a class="btn btn-default btn-round btn_add_print pull-right" style="margin: 0px;"><span class="glyphicon glyphicon-print"></span> Print </a>'
                }
            },
            onComplete: function (model) {
                gridModel = model;
            },
            Add: {
                elm: container.find('#btn_add_new_item'),
                onSubmit: callarOptions.onSubmit || onSubmit,
                save: '/InvestigationArea/InvestigationItem/OnSetInvestigation',
                saveChange: '/InvestigationArea/InvestigationItem/Edit',
                dropdownList: callarOptions.drp || [{
                        Id: 'InvestigationId',
                        position: 2,
                        url: '/InvestigationArea/Investigation/AutoComplete',
                        Type: 'AutoComplete'
                    }]
            },
            remove: { save: '/InvestigationArea/InvestigationItem/OnRemoveInvestigation' },
            onSuccess: function () {
                if (gridModel) {
                    gridModel.Reload();
                }
            }
        });
        
        callarOptions.BaseModel.Reload = function () {
            console.log(['callarOptions', callarOptions.drp, callarOptions.onSubmit]);
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