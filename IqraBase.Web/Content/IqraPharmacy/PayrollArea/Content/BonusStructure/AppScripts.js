
(function () {
    var that = this, gridModel, accessModel, periodType = ['Yearly', 'Monthly', 'One time only'],
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
            name: 'BonusStructureDetails',
            url: '/Content/IqraPharmacy/PayrollArea/Content/Js/BonusStructure/OnDetails.js',
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
            this.PeriodTypeStr = periodType[this.PeriodType] || '';
            this.AmountTypeStr = amountType[this.AmountType] || '';
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
                save: '/PayrollArea/BonusStructure/Create',
                saveChange: '/PayrollArea/BonusStructure/Edit',
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
                    { field: 'Name', click: onDetails, position: 1 },
                    { field: 'PeriodTypeStr', title: 'Period Type', position: 2, actionField: 'PeriodType', filter: getPeriodTypeFilter(), add: false },
                    { field: 'BonusCount', position: 3, add: { datatype: 'float' } },
                    { field: 'AmountTypeStr', title: 'Amount Type', actionField: 'AmountType', position: 4, filter: getAmountTypeFilter(), add: false },
                    { field: 'Amount', position: 5, add: { datatype: 'float' } },
                    { field: 'Creator', Add: false, className: 'creator', click: onCreatorDetails, position: 7 },
                    { field: 'Updator', Add: false, className: 'updator', click: onUpdatorDetails, position: 7 }
        ];
    };
    Global.List.Bind({
        Name: 'BonusStructure',
        Grid: {
            elm: $('#grid'),
            columns: getColumns(),
            url: '/PayrollArea/BonusStructure/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Bonus Structures ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: getAdd(),
        //Edit:false,
        Edit: accessModel.Edit == true,
        remove: accessModel.Delete == true ? { save: '/PayrollArea/BonusStructure/Delete' } : false,
    });
})();;
