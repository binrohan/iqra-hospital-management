
(function () {
    var gridModel;
    function onOpen(model) {
        Global.Add({
            url: '/Content/IqraPharmacy/EmployeeArea/Content/Security/ActionMethod.js',
            model: model,
            OnChange: function () {
                gridModel.Reload();
            }
        });
    }

    Global.List.Bind({
        Name: 'Security',
        elm: $('#grid'),
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', title: 'Name', filter: true },
                { field: 'Roles', title: 'Roles', add: true }
            ],
            url: '/Security/ControllerInfo',
            page: { "SortBy": "", "IsDescending": false, "PageNumber": 1, "PageSize": 10 },
            Actions: [
                { click: onOpen, html: '<span class="icon_container"><span class="glyphicon glyphicon-open"></span>Action Method</span>' }
            ]
        }, onComplete: function (grid) {
            gridModel = grid;
        }, edit: false, remove: false
    });
})();
