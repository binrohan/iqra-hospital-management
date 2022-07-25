
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onUserDetails(userId) {
        Global.Add({
            UserId: userId,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onEmployeeDetails(model) {
        onUserDetails(model.EmployeeId);
    };
    function onRejectorDetails(model) {
        onUserDetails(model.RejectedBy);
    };
    function onDetails(model) {
        Global.Add({
            model: model,
            name: 'LateEntryDetails',
            url: '/Content/IqraPharmacy/AttendanceArea/Content/LateEntry/LateEntryDetails.js',
        });
    };
    function onApprove(model) {
        var opts = {
            name: 'Approve',
            data: { Id: model.Id },
            onsavesuccess: function () {
                gridModel.Reload();
            },
            Msg: 'Do you want to approve this entry?',
            save: '/AttendanceArea/LateEntry/Approve'
        };
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: opts
        });
    };
    function onDataBinding(data) {

    };
    function onRowBound(elm) {
        if (this.Status==2) {
            elm.find('.approve').remove();
        } else {
            elm.find('.glyphicon-trash').parent().remove();
        }
    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'LateEntry',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Employee', filter: true, Add: false, Click: onEmployeeDetails },
                { field: 'EntryTime', dateFormat: 'dd/MM/yyyy hh:mm', Position: 1 },
                { field: 'EnterAt', dateFormat: 'dd/MM/yyyy hh:mm', Position: 2 },
                { field: 'Rejector', filter: true, Add: false, Click: onRejectorDetails },
            ],
            url: '/AttendanceArea/LateEntry/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Attendances ' },
            onDataBinding: onDataBinding,
            rowbound: onRowBound,
            Actions: [{
                click: onApprove,
                html: '<span class="icon_container approve" style="margin-right: 5px;"><span class="glyphicon glyphicon-ok"></span></span>'
            }]
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/AttendanceArea/LateEntry/Create',
            saveChange: '/AttendanceArea/LateEntry/Edit',
            dropdownList: [
                {
                    Id: 'EmployeeId',
                    url: '/EmployeeArea/Employee/AutoComplete',
                    Type: 'AutoComplete',
                    Position: 5
                }
            ]
        },
        Edit:false,
        remove: {
            Msg:'Do you want to reject this entry?',
            save: '/AttendanceArea/LateEntry/Reject'
        }
    });
})();
