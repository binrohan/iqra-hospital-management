
(function () {

    function onSubmit(model, data, formModel) {
        if (data) {
            model.Id = data.Id
        }
        //model.Date = formModel.Date;
        //model.InterAt = formModel.InterAt;
        //model.OutAt = formModel.OutAt;
    };
    function onUserDetails(userId) {
        Global.Add({
            UserId: userId,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    }
    function onUpdatorDetails(model) {
        onUserDetails(model.UpdatedBy);
    }
    function onDetails(model) {
        Global.Add({
            model: model,
            name: 'DailyAttendanceDetails',
            url: '/Content/IqraPharmacy/AttendanceArea/Content/DailyAttendance/DailyAttendanceDetails.js',
        });
    };
    function onApprove(model) {
        Global.Add({
            model: model,
            onSaveSuccess: function () {
                gridModel.Reload();
            },
            name: 'OnApproveOverTime',
            url: '/Content/IqraPharmacy/AttendanceArea/Content/OverTime/OnOverTimeApprove.js'
        });
    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
        this.Approver && elm.find('.approver').append('</br><small><small>' + this.ApprovedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            //this.Date = this.StartAt;
        });
    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'OverTime',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Employee',title:'Name', filter: true, Add: false },
                { field: 'StartAt', Position: 3, dateFormat: 'dd/MM/yyyy HH:mm' },
                { field: 'EndAt', Position: 4, dateFormat: 'dd/MM/yyyy HH:mm' },
                { field: 'Duration', Position: 3, Add: false },
                { field: 'ApprovedDuration', Position: 4, Add: false },
                { field: 'Amount', Position: 4, Add: false },
                { field: 'Approver',className:'approver', filter: true, Add: false, Click: onCreatorDetails }
            ],
            url: '/AttendanceArea/OverTime/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Attendances ' },
            onDataBinding: onDataBinding,
            rowBound:rowBound,
            Actions: [{
                click: onApprove,
                html: '<span class="hide_on_mobile icon_container" style="margin-right: 5px;"><span class="glyphicon glyphicon-open"></span></span>'
            }]
        }, onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/AttendanceArea/OverTime/OnCreate',
            saveChange: '/AttendanceArea/OverTime/Edit',
            dropdownList: [
                {
                    Id: 'EmployeeId',
                    url: '/EmployeeArea/Employee/AutoComplete',
                    Type: 'AutoComplete',
                    Position: 1,
                    Add: {sibling:1}
                }
            ]
        },
        Edit:false,
        remove: { save: '/AttendanceArea/OverTime/Delete' }
    });
    Global.DatePicker.ServerFormat = 'dd/MM/yyyy HH:mm';
})();
