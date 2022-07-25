
(function () {
    var that = this, gridModel;
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
        formModel.Title = formModel.TitleText;
    };
    function onCreatorDetails(model) {
        Global.Add({
            UserId: model.CreatedBy,
            name: 'UserDetails',
            url: '/Content/IqraHMS/PatientArea/Js/User/UserDetails.js',
        });
    };
    function onInvestigationDetails(model) {
        Global.Add({
            InvestigationId: model.InvestigationId,
            name: 'InvestigationDetails',
            url: '/Content/IqraHMS/InvestigationArea/Js/Investigation/OnDetails.js',
        });
    };
    function onDetails(model) {
        Global.Add({
            model: model,
            name: 'InvestigationDetails',
            url: '/Content/IqraHMS/InvestigationArea/Js/InvestigationReportCategory/OnDetails.js',
        });
    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            this.TitleText = this.Title;
        });
    };
    Global.List.Bind({
        Name: 'InvestigationReportCategory',
        Grid: {
            elm: $('#grid'),
            columns: [
                    { field: 'TitleText', Title: 'Title', filter: true, position: 1, Add: { sibling: 3 }, click: onDetails, required: false, },
                    { field: 'Position', position: 2, Add: { sibling: 3, datatype: 'int' } },
                    { field: 'Investigation', filter: true, Add: false, click: onInvestigationDetails },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                    { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                    { field: 'Creator', add: false, filter: true, click: onCreatorDetails },
                    { field: 'Remarks', title: 'Remarks', filter: true, required: false, Add: { type: 'textarea', sibling: 1 } }
            ],
            url: '/InvestigationArea/InvestigationReportCategory/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Items ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/InvestigationArea/InvestigationReportCategory/Create',
            saveChange: '/InvestigationArea/InvestigationReportCategory/Edit',
            //dropdownList: [
            //    {
            //        Id: 'InvestigationId',
            //        position: 1,
            //        url: '/InvestigationArea/Investigation/AutoComplete',
            //        Type: 'AutoComplete',
            //        add: { sibling: 3, datatype: 'int' }
            //    }
            //]
        },
        remove: { save: '/InvestigationArea/InvestigationReportCategory/Delete' }
    });
})();;
                