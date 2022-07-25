
(function () {
    var gridModel;
    function onOpen() {
        var model = $(this).closest('tr').data('model');
        Global.Add({
            url: '/Areas/Account/Scripts/ActionMethod.js',
            model: model,
            OnChange: function () {
                gridModel.Reload();
            }
        });
    }

    Global.List.Bind({
        Name: 'Role',
        Grid: {
            columns: [
                { field: 'Name', title: 'Name', filter: true },
                { field: 'Roles', title: 'Roles', add: true }
            ],
            url: '/Roles/Get',
            page: { "SortBy": "", "IsDescending": false, "PageNumber": 1, "PageSize": 10 },
            Actions: [
                { click: onOpen, html: '<span class="icon_container"><span class="glyphicon glyphicon-open"></span></span>' }
            ]
        }, onComplete: function (grid) {
            gridModel = grid;
        }, edit: false, remove: false
    });
})();
