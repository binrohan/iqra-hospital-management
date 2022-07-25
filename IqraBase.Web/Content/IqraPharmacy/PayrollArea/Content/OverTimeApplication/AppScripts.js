
(function () {
    /// 0 For Applied by user.
    /// 1 For Approved by admin.
    /// 2 For Rejected by admin.
    var that = this, gridModel, accessModel, statusStr = ['Pending', 'Approved', 'Rejected'];
    function onSubmit(formModel, data,model) {
        if (data) {
            formModel.Id = data.Id
        }
        formModel.FromDate = model.FromDate;
        formModel.ToDate = model.ToDate;
        formModel.StartAt =model.FromDate+' '+ model.StartAt;
        formModel.EndAt = model.ToDate + ' ' + model.EndAt;
        console.log([formModel, data, model]);
    };
    function onUserDetails(id) {
        Global.Add({
            UserId: id,
            name: 'UserDetails',
            url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
        });
    };
    function onEmployeeDetails(model) {
        onUserDetails(model.EmployeeId);
    }
    function onCreatorDetails(model) {
        onUserDetails(model.CreatedBy);
    }
    function onApproverDetails(model) {
        onUserDetails(model.ApprovedBy);
    }
    function onSetStatus(model,msg) {
        var opts = {
            name: 'OnApprove',
            data: model,
            onsavesuccess: function () {
                gridModel.Reload();
            },
            Msg: msg,
            save: '/PayrollArea/OverTimeApplication/onApprove'
        };
        Global.Controller.Call({
            url: IqraConfig.Url.Js.WarningController,
            functionName: 'Show',
            options: opts
        });
    };
    function onApprove(model) {
        onSetStatus({ Id: model.Id,Status:1 },'Do you want to approve this entry?');
    };
    function onReject(model) {
        onSetStatus({ Id: model.Id,Status:2 },'Do you want to reject this entry?');
    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
        this.Approver && elm.find('.approver').append('</br><small><small>' + this.ApprovedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
        this.Creator && elm.find('.creator').append('</br><small><small>' + this.CreatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
        this.Status == 1 && elm.find('.on_approve').remove();
        this.Status == 2 && elm.find('.on_reject').remove();
    };
    function onDataBinding(data) {
        data.Data.Data.each(function () {
            this.StatusStr = statusStr[this.Status] || 'Not Defined';
        });
    };
    function setData() {
        accessModel = {};
        if (accessList.IsError) {
            
        } else {
            accessList.Data.each(function () {
                this.each(function () {
                    accessModel[this + ''] = true;
                });
            });
        }
        if (!accessModel.Create) {
            $('#btn_add_new').remove();
        }
        return accessModel;
    };
    function getAdd() {
        accessModel = accessModel || setData();
        if (accessModel.Edit || accessModel.Create) {
            return {
                onSubmit: onSubmit,
                save: '/PayrollArea/OverTimeApplication/Create',
                saveChange: '/PayrollArea/OverTimeApplication/Edit',
                dropdownList: [
                             {
                                 Id: 'EmployeeId',
                                 position: 1,
                                 url: '/EmployeeArea/Employee/AutoComplete',
                                 Type: 'AutoComplete'
                             },
                ],
                additionalField: [
                    { field: 'Application', add: { type: 'textarea', sibling: 1 }, position: 7 }
                ],
                details: function (data) {
                    console.log(data);
                    return '/PayrollArea/OverTimeApplication/Details?Id=' + data.Id
                }
            };
        } else {
            return false;
        }
    };
    Global.List.Bind({
        Name: 'OverTimeApplication',
        Grid: {
            elm: $('#grid'),
            columns: [
                    { field: 'Employee', Add: false, click: onEmployeeDetails },
                    { field: 'FromDate', title: 'From', dateFormat: 'dd/MM/yyyy', position: 3 },
                    { field: 'ToDate', title: 'To', dateFormat: 'dd/MM/yyyy', required: false , position: 4},
                    { field: 'StartAt', dateFormat: 'HH:mm', position: 5 },
                    { field: 'EndAt', dateFormat: 'HH:mm', position: 6 },
                    { field: 'MonthlyMax', Add: { dataType: 'int' },position: 2, },
                    { field: 'StatusStr', title: 'Status', Add: false },
                    { field: 'Type', Add: false },
                    { field: 'Approver', Add: false, className: 'approver', click: onApproverDetails },
                    { field: 'Creator', Add: false, className: 'creator', click: onCreatorDetails }
            ],          
            url: '/PayrollArea/OverTimeApplication/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Applications ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound,
            Actions: function () {
                if ((accessModel||setData()).onApprove) {
                    return [{
                        click: onReject,
                        html: '<span class="icon_container on_reject" style="margin-right: 10px;"><span class="glyphicon glyphicon-remove"></span></span>'
                    },{
                        click: onApprove,
                        html: '<span class="icon_container on_approve" style="margin-right: 10px;"><span class="glyphicon glyphicon-ok"></span></span>'
                    }]
                }
            }()
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: getAdd(),
        Edit:false,
        //Edit:accessModel.Edit==true,
        remove: false
    });
})();;
