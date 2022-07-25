using IqraService.Helper;
using IqraService.Search;
using IqraBase.Web.Controllers;
using IqraBase.Data.Entities.AccessArea;
using IqraBase.Data.Models.AccessArea;
using IqraBase.Service;
using IqraBase.Service.AccessArea;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using IqraBaseService.Helper;

namespace IqraBase.Web.Areas.AccessArea.Controllers
{
    public class AppAccessController : AppBaseController<Access, AccessModel>
    {
        AccessService _service;
        public AppAccessController()
        {
            service = _service = _service = new AccessService();
        }
        // GET: /AccessArea/AppAccess/ActionControllerAutoComplete
        public async Task<JsonResult> ControllerInfo(Page page)
        {
            return Json(await _service.GetControllerInfo(page), JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> GetMethodInfo(Page page,int ControllerId)
        {
            return Json(await _service.GetMethodInfo(page, ControllerId), JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> SetAcces(Guid roleId, int actionMethodId, int rollType=1)
        {
            var response = await _service.SetMethodAccess(appUser.Id, roleId, actionMethodId, rollType);
            if (!response.IsError)
            {
                IqraBase.Web.SetUp.AccessService.SetAccess();
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> RemoveAccess(Guid roleId, int actionMethodId, int rollType = 1)
        {
            ResponseJson response = new ResponseJson();
            Access access = service.Get(a => a.ActionMethodId == actionMethodId && a.AccessType== rollType && (a.AccessType==3|| a.AccessType == 4 || a.RelativeId == roleId)).FirstOrDefault();
            if (access != null)
            {
                _service.Entity.Remove(access);
                _service.SaveChange();
                var names = await _service.ControllerName(access.ActionMethodId);
                if (!names.IsError)
                {
                    //IqraBase.Web.SetUp.AccessService.SetAccess(new IqraService.Search.ResponseJson() {IsError=true,Id=-10 }, appUser.Id + names.Data["Controller"].ToString() + names.Data["ActionMethod"]);
                    IqraBase.Web.SetUp.AccessService.SetAccess();
                }
            }
            else
            {
                response.IsError = true;
                response.Id = ErrorCodes.NotFound;
            }
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public async Task<JsonResult> SetControllerAcces(Guid roleId, int controllerId,int rollType)
        {
            ResponseJson response = new ResponseJson();
            await Task.Run(() => {
                response = _service.SetControllerAccess(appUser.Id, roleId, controllerId, rollType);
            });
            IqraBase.Web.SetUp.AccessService.SetAccess();
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="roleId"></param>
        /// <param name="controllerId"></param>
        /// <param name="rollType"> 0 For user, 1 for All user, 2 for Group user</param>
        /// <returns></returns>
        public async Task<JsonResult> RemoveControllerAccess(Guid roleId, int controllerId, int rollType)
        {
            ResponseJson response = new ResponseJson();
            await Task.Run(() => {
                response = _service.RemoveControllerAccess(roleId, controllerId, rollType);
            });
            IqraBase.Web.SetUp.AccessService.SetAccess();
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public virtual async Task<JsonResult> ActionMethodAutoComplete(Page page)
        {
            page.SortBy = "Name";
            using (var db = new DBService())
            {
                return Json(await db.List(db.GetQuery(page, db.GetBaseQuery(page, " [Id] ,[Name] FROM [dbo].[ActionMethod]"))), JsonRequestBehavior.AllowGet);
            }
        }
        public virtual async Task<JsonResult> ActionControllerAutoComplete(Page page)
        {
            page.SortBy = "Name";
            using (var db = new DBService())
            {
                return Json(await db.List(db.GetQuery(page, db.GetBaseQuery(page, " [Id] ,[Name] FROM [dbo].[ActionController]"))), JsonRequestBehavior.AllowGet);
            }
        }
    }
}