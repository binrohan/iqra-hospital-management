using IqraService.Search;
using IqraBase.Web.Controllers;
using IqraBase.Web.SetUp;
using IqraBase.Data.Entities.MenuArea;
using IqraBase.Data.Models.MenuArea;
using IqraBase.Service;
using IqraBase.Service.MenuArea;
using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace IqraBase.Web.Areas.MenuArea.Controllers
{
    public class MenuAccessController : AppBaseController<MenuAccess, MenuAccessModel>
    {
        // GET: MenuArea/MenuAccess/GetByCategory
        MenuAccessService _service;
        public MenuAccessController()
        {
            service = _service = new MenuAccessService();
        }

        public async Task<JsonResult> GetMenu(Page page)
        {
            var user = appUser ?? new App.LogInArea.LogInResult();
            return Json(await _service.GetMenu(user.Id, user.DesignationId), JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> GetByCategory(Page page, Guid CategoryId)
        {
            return Json(await _service.GetByCategory(page, CategoryId), JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> SetCategoryAccess(Guid roleId, Guid categoryId, int rollType)
        {
            ResponseJson response = new ResponseJson();
            await Task.Run(() => {
                response = _service.SetCategoryAccess(appUser.Id, roleId, categoryId, rollType);
            });
            //IqraBase.Web.SetUp.AccessService.SetAccess();
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> SetAcces(Guid roleId, Guid menuId, int rollType = 1)
        {
            ResponseJson response = await _service.SetAccess(appUser.Id, roleId, menuId, rollType);
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> RemoveAccess(Guid roleId, Guid menuId, int accessType)
        {
            ResponseJson response = await _service.RemoveAccess(roleId, menuId, accessType);
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> RemoveCategoryAccess(Guid roleId, int accessType, Guid categoryId)
        {
            ResponseJson response = new ResponseJson();
            await Task.Run(() => {
                response = _service.RemoveCategoryAccess(roleId, accessType, categoryId);
            });
            //IqraBase.Web.SetUp.AccessService.SetAccess();
            return Json(response, JsonRequestBehavior.AllowGet);
        }
    }
}