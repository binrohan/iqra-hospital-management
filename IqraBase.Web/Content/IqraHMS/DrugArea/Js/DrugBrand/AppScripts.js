
(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id
        }
    };
    function rowBound(elm) {
        if (this.IsDeleted) {
            elm.css({ color: 'red' }).find('.glyphicon-trash').css({ opacity: 0.3, cursor: 'default' });
            elm.find('a').css({ color: 'red' });
        }
    };
    function onDataBinding(data) {

    };
    var that = this, gridModel;
    Global.List.Bind({
        Name: 'DrugBrand',
        Grid: {
            elm: $('#grid'),
            columns: [
                        { field: 'Name', title: 'Name', filter: true },
                        { field: 'DrugType', title: 'Drug Type', filter: true, position: 1, add: false },
                        { field: 'Comapny', title: 'Company', filter: true, position: 2, add: false },
                        { field: 'GenericName', title: 'Generic', filter: true, position: 3, add: false },
                        { field: 'Strength', title: 'Strength', filter: true },
                        { field: 'Price', title: 'Price', filter: true },
                        { field: 'PackSize', title: 'PackSize', filter: true },
                        { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy',Add:false },
                        { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                        { field: 'Remarks', title: 'Remarks', filter: true,required:false},
            ],
            url: '/DrugArea/DrugBrand/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} DrugBrands ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        }, onComplete: function (model) {
            gridModel = model;
        }, Add: {
            onSubmit: onSubmit,
            save: '/DrugArea/DrugBrand/Create',
            saveChange: '/DrugArea/DrugBrand/Edit',
            dropdownList: [
                            {
                                Id: 'DrugTypeId',
                                position: 1,
                                url: '/DrugArea/DrugType/AutoComplete',
                                onChange: function (data) {
                                    console.log(data);
                                },
                                Type: 'AutoComplete',
                            },
                            {
                                Id: 'CompanyId',
                                position: 2,
                                url: '/DrugArea/DrugCompany/AutoComplete',
                                onChange: function (data) {
                                    console.log(data);
                                },
                                Type: 'AutoComplete',
                            },
                            {
                                Id: 'GenericId',
                                position: 3,
                                url: '/DrugArea/DrugGeneric/AutoComplete',
                                onChange: function (data) {
                                    console.log(data);
                                },
                                Type: 'AutoComplete',
                            },
            ],
        },
        remove: { save: '/DrugArea/DrugBrand/Delete' }
    });

})();;
                