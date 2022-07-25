var Controller = new function () {
    var callarOptions, service = {},
        filter = { "field": "ServiceId", title: 'Service', "value": "", Operation: 0 };

    this.Show = function (model) {
        callarOptions = model;
        filter.value = model.ServiceId;
        Global.Add({
            title: 'Service Details',
            selected: callarOptions.selected || 1,
            Tabs: [
                {
                    title: 'Basic Info',
                    Columns: AppComponent.Service.Columns(),
                    DetailsUrl: function () {
                        return '/ServiceArea/HospitalService/Details?Id=' + callarOptions.ServiceId;
                    }
                },
                {
                    title: 'History',
                    Grid: [{
                        Id: '61D23675-5726-4F69-BB61-EC352C04566D',
                        Header: 'History',
                        filter: [filter],
                        columns: AppComponent.PatientService.Columns(),
                        url: '/ServiceArea/PatientService/Get',
                        periodic: {
                            container: '.summary_container',
                        },
                        Printable: {

                        }
                    }],
                }
            ],
            name: 'OnPatientServiceDetails',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=PatientServiceDetails',
        });
    };
};