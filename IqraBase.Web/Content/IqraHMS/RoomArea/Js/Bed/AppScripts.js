(function () {
    function onSubmit(formModel, data) {
        if (data) {
            formModel.Id = data.Id;
        } else {
            formModel.IsAvailable = true;
        }
        
    };
    function onRoomDetails(model) {
        Global.Add({
            RoomId: model.RoomId,
            name: 'RoomDetails',
            url: '/Content/IqraHMS/RoomArea/Js/Room/RoomDetails.js',
        });
    };
    
    //function getAvailabilityFileter() {
    //    return {
    //        DropDown: {
    //            dataSource: [
    //                { text: 'Select Availability', value: '' },
    //                { text: 'Available', value: '0' },
    //                { text: 'Not Available', value: '1' }
    //            ]
    //        }
    //    };
    //};
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
        Name: 'Bed',
        Grid: {
            elm: $('#grid'),
            columns: [
                { field: 'Name', title: 'Name', filter: true},
                { field: 'Room', title: 'Room Number', filter: true, Add: false, Click: onRoomDetails },
                { field: 'BedNumber', title: 'Bed No', filter: true},
                { field: 'PerDayCharge', title: 'Day Charge' },
                //{ field: 'IsAvailable', title: 'Available', Add: false, Operation: 0, filter: getAvailabilityFileter() },
                { field: 'IsAvailable', title: 'Available', Add: false, Operation: 0 },
                { field: 'LastPatient', title: 'LastPatient', Add: false },
                { field: 'IsDeleted', title: 'Deleted', Add: false, selected: false },
                { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy', Add: false, selected: false },
                { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy', Add: false },
                { field: 'Remarks', title: 'Remarks',required:false, filter: true, add: { type: 'textarea', sibling: 1 } },
            ],
            url: '/RoomArea/Bed/Get',
            page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Beds ' },
            onDataBinding: onDataBinding,
            rowBound: rowBound
        },
        onComplete: function (model) {
            gridModel = model;
        },
        Add: {
            onSubmit: onSubmit,
            save: '/RoomArea/Bed/Create',
            saveChange: '/RoomArea/Bed/Edit',
            dropdownList: [{
                Id: 'RoomId',
                position: 2,
                url: '/RoomArea/Room/AutoComplete',
                Type: 'AutoComplete'
            }],
            additionalField: []
        },
        remove: { save: '/RoomArea/Bed/Delete' }
    });
})();


