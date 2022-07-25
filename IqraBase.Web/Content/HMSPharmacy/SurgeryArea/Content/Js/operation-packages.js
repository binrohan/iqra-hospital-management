import { editBtn, folderBtn } from "../../../../Js/modules/buttons.js";
import { deletedRecord, nonDeletedRecord } from "../../../../Js/modules/filter.js";
import { tabBuilder } from "../../../../Js/modules/utils.js";

(function () {
    const controller = 'SurgeryArea/OperationPackage';
    const title = 'Operation Package'

    $(document).ready(() => {
        $('#add-record').click(create);
    });

    function create() {
        Global.Add({
            name: 'create-operation-package',
            url: '/Content/HMSPharmacy/SurgeryArea/Content/Js/create-operation-package.js',
        });
    };

    function edit(model) {
        popup({ data: model, label: `Edit ${title}`});
    };

    function details(operationPackage){
        Global.Add({
            operationPackageId: operationPackage.Id,
            name: 'operation-package',
            url: '/Content/HMSPharmacy/SurgeryArea/Content/Js/operation-package.js',
        });
    }

    function popup({data, label}) {
        Global.Add({
            name: label,
            model: data,
            title: label,
            columns: [
                { field: 'SurgeryName', title: 'Surgery Name', add: { sibling: 2 } },
                { field: 'SurgonName', title: 'Surgon Name', add: { sibling: 2 } },
                { field: 'Price', title: 'Price', add: { sibling: 3 } },
                { field: 'MinPrice', title: 'Minimum Price', add: { sibling: 3 } },
                { field: 'OriginalCost', title: 'Original Cost', add: { sibling: 3 } },
                { field: 'Remarks', title: 'Remarks', Width: '255px', add: { type: 'textarea', sibling: 1 } }
            ],
            dropdownList: [],
            additionalField: [],
            onSubmit: function (postModel, data, formModel) {
                postModel.Id = data.Id
                postModel.SurgeryId = data.SurgeryId;
                postModel.SurgonId = data.SurgonId;
            },
            onShow:(model, formInputs, dropDownList, IsNew, windowModel, formModel) => {
                

            },
            onViewCreated:(windowModel, formInputs, dropDownList, IsNew, formModel) => {
                $(formInputs['SurgeryName']).prop('disabled',true);
                $(formInputs['SurgonName']).prop('disabled',true);
                $(formInputs['OriginalCost']).prop('disabled',true);

            },
            onSaveSuccess: function () {
                tabs.gridModel?.Reload();
            },
            save: `/${controller}/Create`,
            saveChange: `/${controller}/Edit`,
        });
    };

    const editAction = {
        click: edit,
        html: editBtn()
    };

    const detailsAction = {
        click: details,
        html: folderBtn('Surgery Details')
    };

    const allServiceTabConfig = {
        title: 'Active_Surgery',
        actions: [detailsAction, editAction],
        filters: [nonDeletedRecord],
        columns: [ { field: 'SurgeryName', title: 'Surgery Name', add: { sibling: 3 } },
        { field: 'SurgonName', title: 'Surgon Name', add: { sibling: 3 } },
        { field: 'Price', title: 'Price', add: { sibling: 3 } },
        { field: 'MinPrice', title: 'Minimum Price', add: { sibling: 3 } },
        { field: 'OriginalCost', title: 'OriginalCost', add: { sibling: 3 } },
        { field: 'Creator', title: 'Creator', add: false },
        { field: 'CreatedAt', title: 'Creation Date', add: false, dateFormat: 'dd mmm yyyy', },
        { field: 'Updator', title: 'Updator', add: false },
        { field: 'UpdatedAt',  title: 'Last Updated', add: false, dateFormat: 'dd mmm yyyy', },
        { field: 'Remarks', title: 'Remarks', Width: '255px', add: { sibling: 1 } }],
        remove: { save: `/${controller}/Delete` }
    };

    const deletedServiceTabConfig = {
        title: 'Deleted_Surgery',
        filters: [deletedRecord],
        columns: [ { field: 'SurgeryName', title: 'Surgery Name', add: { sibling: 3 } },
        { field: 'SurgonName', title: 'Surgon Name', add: { sibling: 3 } },
        { field: 'Price', title: 'Price', add: { sibling: 3 } },
        { field: 'MinPrice', title: 'Minimum Price', add: { sibling: 3 } },
        { field: 'OriginalCost', title: 'OriginalCost', add: { sibling: 3 } },
        { field: 'Creator', title: 'Creator', add: false },
        { field: 'CreatedAt', title: 'Creation Date', add: false, dateFormat: 'dd mmm yyyy', },
        { field: 'Updator', title: 'Updator', add: false },
        { field: 'UpdatedAt',  title: 'Last Updated', add: false, dateFormat: 'dd mmm yyyy', },
        { field: 'Remarks', title: 'Remarks', Width: '255px', add: { sibling: 1 } }],
    };

    const tabs = {
        container: $('#page_container'),
        Base: { Url: `/${controller}/` },
        items: tabBuilder(allServiceTabConfig,
                          deletedServiceTabConfig),
        periodic: false
    };

    Global.Tabs(tabs);
    tabs.items[0].set(tabs.items[0]);
})();