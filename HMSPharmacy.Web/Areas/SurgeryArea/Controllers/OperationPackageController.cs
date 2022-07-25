

using IqraHMS.OT.Data.Entities.OTServiceArea;
using IqraHMS.OT.Data.Entities.SurgeryArea;
using IqraHMS.OT.Data.Models.SurgeryArea;
using IqraHMS.OT.Service.SurgeryArea;
using IqraHMS.OT.Web.Controllers;
using IqraService.Search;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace IqraHMS.OT.Web.Areas.SurgeryArea.Controllers
{
    public class OperationPackageController : AppBaseController<OperationPackage, OperationPackageModel>
    {
        // GET: AccountArea/OperationPackage/AutoComplete
        OperationPackageService _service;
        public OperationPackageController()
        {
            service = _service = new OperationPackageService();
        }
        protected override void OnException(ExceptionContext filterContext)
        {
            base.OnException(filterContext);
        }
    }
}