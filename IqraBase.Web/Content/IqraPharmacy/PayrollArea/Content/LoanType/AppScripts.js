
(function () {
    var that = this, gridModel, accessModel, statusStr = ['Pending', 'Approved', 'Rejected'];
    function onSubmit(formModel, data, model) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            model: model,
            name: 'LoanTypeDetails',
            url: '/Content/IqraPharmacy/PayrollArea/Content/LoanType/OnDetails.js',
        });
    };
    function onUserDetails(id) {
        Global.Add({
            UserId: id,
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
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
        this.Updator && elm.find('.updator').append('</br><small><small>' + this.UpdatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
        this.Creator && elm.find('.creator').append('</br><small><small>' + this.CreatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
    };
    function onDataBinding(data) {
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
                save: '/PayrollArea/LoanType/Create',
                saveChange: '/PayrollArea/LoanType/Edit'
            };
        } else {
            return false;
        }
    };
    Global.List.Bind({
        Name: 'LoanType',
        Grid: {
            elm: $('#grid'),
            columns: [
                    { field: 'Name', click: onDetails },
                    { field: 'Creator', Add: false, className: 'creator', click: onCreatorDetails },
                    { field: 'Updator', Add: false, className: 'updator', click: onUpdatorDetails }
            ],          
            url: '/PayrollArea/LoanType/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Installments ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: getAdd(),
        //Edit:false,
        Edit: accessModel.Edit == true,
        remove: accessModel.Delete == true ? { save: '/PayrollArea/LoanType/Delete' } : false,
    });
})();;
