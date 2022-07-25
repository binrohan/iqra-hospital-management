
(function () {
    var that = this, gridModel, accessModel, status = ['Not Paid', 'Paid'],
        amountType = ['Fixed Amount', '% of GRoss Salary'];
    function onSubmit(formModel, data, model) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function onDetails(model) {
        Global.Add({
            model: model,
            columns: getColumns(),
            adeditionalFields:getAdditionalField(),
            name: 'EmployeeBonusDetailsDetails',
            url: '/Content/IqraPharmacy/PayrollArea/Content/Js/EmployeeBonusDetails/OnDetails.js',
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
    function getPeriodTypeFilter() {
        return {
            DropDown: {
                dataSource: [
                    { text: 'Select Type', value: '' },
                    { text: 'Yearly', value: '0' },
                    { text: 'Monthly', value: '1' },
                    { text: 'One time only', value: '2' }
                ]
            }
        };
    };
    function getAmountTypeFilter() {
        return {
            DropDown: {
                dataSource: [
                    { text: 'Select Type', value: '' },
                    { text: 'Fixed Amount', value: '0' },
                    { text: '% of GRoss Salary', value: '1' }
                ]
            }
        };
    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
        this.Updator && elm.find('.updator').append('</br><small><small>' + this.UpdatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
        this.Creator && elm.find('.creator').append('</br><small><small>' + this.CreatedAt.getDate().format('dd/MM/yyyy hh:mm') + '</small></small>');
    };
    function onDataBinding(response) {
        response.Data.Data.each(function () {
            this.BonusAt = this.Year + ', ' + this.Month;
            this.StatusStr = status[this.Status] || '';
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
    function getAdditionalField() {
        return [
                    { field: 'Remarks', position: 5, add: { type: 'textarea', sibling: 1 } }
        ]
    };
    function getAdd() {
        accessModel = accessModel || setData();
        if (accessModel.Edit || accessModel.Create) {
            return {
                onSubmit: onSubmit,
                save: '/PayrollArea/EmployeeBonusDetails/Create',
                saveChange: '/PayrollArea/EmployeeBonusDetails/Edit',
                additionalField: getAdditionalField(),
                dropdownList: [
             {
                 Id: 'PeriodType',
                 position: 2,
                 dataSource: getPeriodTypeFilter().DropDown.dataSource,
             }, {
                 Id: 'AmountType',
                 position: 4,
                 dataSource: getAmountTypeFilter().DropDown.dataSource,
             }
                ],
            };
        } else {
            return false;
        }
    };
    function getColumns() {
        return [
                    { field: 'Employee' },
                    { field: 'BonusStructure', title: 'Bonus' },
                    { field: 'BonusAt', title: 'Bonus At', actionField: 'CreatedAt' },
                    { field: 'Amount', type: 2 },
                    { field: 'StatusStr',title:'Status',actionField:'Status' },
                    { field: 'Creator', Add: false, className: 'creator', click: onCreatorDetails, position: 7 },
                    { field: 'Updator', Add: false, className: 'updator', click: onUpdatorDetails, position: 7 }
        ];
    };
    Global.List.Bind({
        Name: 'EmployeeBonusDetails',
        Grid: {
            elm: $('#grid'),
            columns: getColumns(),
            url: '/PayrollArea/EmployeeBonusDetails/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Bonus Structures ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: getAdd(),
        Edit: accessModel.Edit == true,
        remove: accessModel.Delete == true ? { save: '/PayrollArea/EmployeeBonusDetails/Delete' } : false,
    });
})();;
