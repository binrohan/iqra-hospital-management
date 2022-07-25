
(function () {
    var gridModel;
    function onOpen() {
        var model = $(this).closest('tr').data('model');
        Global.Add({
            url: '/Areas/Account/Scripts/SubMenu.js',
            model: model,
            OnChange: function () {
                gridModel.Reload();
            }
        });
    }

    Global.List.Bind({
        Name: 'Menu',
        Grid: {
            columns: [
                { field: 'Name', title: 'Name', filter: true,add:false },
                { field: 'DisplayName', title: 'DisplayName', filter: true },
                { field: 'Position', title: 'Position', add: true, filter: true, Operation: 'GreaterThan' }
            ],
            url: '/MenuList/GetBase'
            ,
            Actions: [
                { click: onOpen, html: '<span class="icon_container"><span class="glyphicon glyphicon-open"></span></span>' }
            ]
        }, onComplete: function (grid) {
            gridModel = grid;
        }, remove: false
    });
})();




