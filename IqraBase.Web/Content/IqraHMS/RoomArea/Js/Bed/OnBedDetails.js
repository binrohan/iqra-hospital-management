var Controller = new function () {
    var callarOptions, filter = { "field": "BedId", "value": "", Operation: 0 };

    function onRoomDetails(model) {
        Global.Add({
            RoomId: model.RoomId,
            name: 'RoomDetails',
            url: '/Content/IqraHMS/RoomArea/Js/Room/RoomDetails.js',
        });
    };
    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.BedId;
        Global.Add({
            title: 'Bed Details',
            selected: 1,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: [
                        { field: 'Name', title: 'Name' },
                        { field: 'Room', title: 'Room Number', Click: onRoomDetails },
                        { field: 'BedNumber', title: 'Bed No' },
                        { field: 'PerDayCharge', title: 'Day Charge' },
                        { field: 'IsAvailable', title: 'Available', },
                        { field: 'LastPatient', title: 'LastPatient' },
                        { field: 'IsDeleted', title: 'Deleted' },
                        { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd mmm-yyyy hh:mm' },
                        { field: 'UpdatedAt', title: 'UpdatedAt', dateFormat: 'dd mmm-yyyy hh:mm' },
                        { field: 'Remarks', title: 'Remarks'},
                    ],
                    DetailsUrl: function () {
                        return '/RoomArea/Bed/Details?Id=' + model.BedId;
                    }
                },
                {
                    title: 'Admissions',
                    Grid: [{
                        Header: 'Admissions',
                        filter: [filter],
                        Url: '/AdmissionArea/Admission/Get',
                        ondatabinding: function (response) {

                        },
                        Summary: {
                            Container: function (container) {
                                return container.find('.filter_container');
                            },
                            Items: [
                                { field: 'AdmissionCharge', title: 'Fees', type: 2 },
                                { field: 'Advance', type: 2 }
                            ]
                        },
                        Columns: AppComponent.Admission.Columns()
                    }],
                }
            ],
            name: 'OnBedDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=BedDetails',
        });
    };
};
