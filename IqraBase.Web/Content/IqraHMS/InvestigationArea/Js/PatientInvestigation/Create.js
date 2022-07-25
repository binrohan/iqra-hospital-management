var Controller = new function () {
    var callarOptions, service = {};
    function getView() {
        return $(`<div><div id="summary_container" class="row">
                                        </div>
                                        <div id="filter_container" class="row">
                                        </div>
                                        <div style="margin-top:10px;">
                                            <div id="button_container" class="empty_style button_container row">
                                            </div>
                                            <div id="grid_container">
                                            </div>
                                        </div></div>`);
    };
    function getTab(title, caller) {
        return {
            title: title,
            Grid: [function (windowModel, container, position, model, func) {
                caller(container, model);
            }],
        }
    };
    this.Show = function (model) {
        callarOptions = model;
        Global.Add({
            title: 'Patient List',
            model: callarOptions.model,
            Tabs: [
                getTab('Patients', service.Patient.Bind)
            ],
            name: 'OnPatientList',
            url: '/Content/IqraService/Js/OnDetailsWithTab.js?v=OnPatientList',
        });
    };

    (function () {
        var tabModel = {}, view = getView(), gridModel;
        function onDetails(model) {
            Global.Add({
                PatientId: model.Id,
                name: 'PatientDetails',
                url: '/Content/IqraHMS/PatientArea/Js/Patient/PatientDetails.js',
            });
        };
        function onInvestigationCreate(model) {
            Global.Add({
                model: model,
                name: 'AddInvestigation',
                url: '/Content/IqraHMS/PatientArea/Js/Patient/AddInvestigationCreate.js',
                onSaveSuccess: function (reponse) {
                    callarOptions.onSaveSuccess && callarOptions.onSaveSuccess(reponse);
                    gridModel.Reload();
                }
            });
        };
        this.Bind = function (container, model) {
            container.append(view);
            model.Reload = function () {
                Global.List.Bind({
                    Name: 'Patient',
                    Grid: {
                        elm: view.find('#grid_container'),
                        columns: [
                            { field: 'Code', title: 'Code', filter: true, width: 135, Click: onDetails },
                            { field: 'Name', title: 'Name', filter: true, width: 150 },
                            { field: 'Gender', title: 'Gender', filter: true, width: 70 },
                            { field: 'BloodGroup', title: 'BG', filter: true, width: 45 },
                            { field: 'Mobile', title: 'Mobile', filter: true, width: 120 },
                            { field: 'AlternativeMobile', title: 'Alternative Mobile', filter: true, width: 120 },
                            { field: 'LastDateOfAdmission', title: 'Addmission Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'LastDateOfRealese', title: 'Release Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'LastDateOfAppointment', title: 'Appointment Date', dateFormat: 'dd/MM/yyyy hh:mm' },
                            { field: 'PatientType', title: 'Patient Type', width: 110 },

                        ],
                        Actions: [{
                            click: onInvestigationCreate,
                            html: '<a style="margin-right:8px;" class="icon_container" title="Add Investigation"><span class="glyphicon glyphicon-plus"></span></a>'
                        }],
                        url: '/PatientArea/Patient/Get',
                        page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Patients ' },
                        Action: { width: 95 },
                        Printable:false
                    },
                    onComplete: function (model) {
                        gridModel = model;
                    },
                    Add: false,
                    Edit: false,
                    remove: false
                });
                model.Reload = function () {
                    gridModel && gridModel.Reload();
                };
            };
        };
    }).call(service.Patient = {});
};