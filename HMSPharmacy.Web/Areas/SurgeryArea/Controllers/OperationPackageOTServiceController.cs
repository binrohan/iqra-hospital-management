

using IqraHMS.OT.Data.Entities.OTServiceArea;
using IqraHMS.OT.Data.Entities.SurgeryArea;
using IqraHMS.OT.Data.Models.SurgeryArea;
using IqraHMS.OT.Service.SurgeryArea;
using IqraHMS.OT.Web.Controllers;
using IqraService.Search;
using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace IqraHMS.OT.Web.Areas.SurgeryArea.Controllers
{
    public class OperationPackageOTServiceController : AppBaseController<OperationPackageOTService, OperationPackageOTServiceModel>
    {
        // GET: AccountArea/OperationPackage/AutoComplete
        OperationPackageOTServiceService _service;
        public OperationPackageOTServiceController()
        {
            service = _service = new OperationPackageOTServiceService();
        }
        protected override void OnException(ExceptionContext filterContext)
        {
            base.OnException(filterContext);
        }

        public override ActionResult Delete(Guid id)
        {
            var result = _service.Remove(id, appUser.Id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}