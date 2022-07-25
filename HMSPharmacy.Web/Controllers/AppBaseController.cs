using IqraBaseService.Controllers;
using IqraBaseService.DAL;
using IqraService.DB;
using IqraBaseService.Helper;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using IqraBase.Data.Entities;
using IqraBase.Data.Models;
using IqraBase.Service;
using IqraBase.App.LogInArea;
using IqraBase.Data;
using IqraBase.Data.Entities.CommonArea;

namespace IqraHMS.OT.Web.Controllers
{
    public class AppBaseController<TEntity, TModel> : BaseController where TEntity : AppBaseEntity where TModel : AppBaseModel
    {

        public string ViewPath { get; set; }
        public IService<TEntity> service;
        #region Overridable Methods
        public AppBaseController() : base()
        {
            ViewPath = "~/Content/HMSPharmacy/" + this.GetType().Namespace.Replace("IqraHMS.OT.Web.Areas.", "").Replace(".Controllers", "") + "/Views/" + this.GetType().Name.Replace("Controller", "");
            
            //service.LogService = LogService;
        }
        public LogInResult appUser
        {
            get
            {
                return (LogInResult)CurrentUser;
            }
        }
        public virtual ResponseList<Pagger<TEntity>> GetListData(Page page)
        {
            return ISearchable.GetPageResponse<TEntity>(page, service.GetEntity());
        }
        public async Task<object> GetData<T1>(T1 param, Func<T1, Task<object>> calBack)
        {

                return await calBack(param);
           
        }
        protected virtual TEntity GetDetails(Guid id)
        {
            return service.GetById(id);
        }
        protected async void Async(Action action) {
            await Task.Run(() => {
                action.Invoke();
            });
        }
        public static ResponseJson SetValidationError(ResponseJson response, System.Web.Mvc.ModelStateDictionary ModelState)
        {
            response.IsError = true;
            response.Msg = "Validation Errors.";
            response.Id = ErrorCodes.Validation;
            List<object> errlist = new List<object>();
            foreach (var item in ModelState)
            {

                if (ModelState[item.Key].Errors.Count > 0)
                {
                    foreach (var error in ModelState[item.Key].Errors)
                    {
                        errlist.Add(new { Field = item.Key, Message = error.ErrorMessage });
                    }
                }
            }
            response.Data = errlist;
            return response;
        }
        #endregion

        #region Common Actions
        public virtual string GetViewPath(string path)
        {
            return "~/Content/IqraHMS/" + this.GetType().Namespace.Replace("IqraHMS.Web.Areas.", "").Replace(".Controllers", "") + "/Views/" + this.GetType().Name.Replace("Controller", "") + path;
        }
        public virtual ActionResult Index()
        {
            if (ViewPath == null)
            {
                return View(GetViewPath("/Index.cshtml"));
            }
            else
            {
                return View(ViewPath+ "/Index.cshtml");
            }
        }
        public virtual async Task<JsonResult> Get(Page page)
        {
            return Json(await GetData(page, async p => { return await service.Get(p); }), JsonRequestBehavior.AllowGet);
        }
        // GET: Branch/Details/5
        public virtual async Task<JsonResult> Details(Guid id)
        {
            JsonResult result = null;
            await Task.Run(() =>
            {
                result = ResponseJsonData(GetDetails(id));
            });
            return result;
        }
        public virtual ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public virtual ActionResult Create(TModel model)
        {
            if (ModelState.IsValid)
            {
                return Json(service.OnCreate(model, appUser.Id, ModelState.IsValid), JsonRequestBehavior.AllowGet);
            }
            var response = new ResponseJson();
            SetValidationError(response, ModelState);
            return Json(response, JsonRequestBehavior.AllowGet);
        }
        public virtual ActionResult Edit(Guid id)
        {
            var record = GetDetails(id);

            return View(record);
        }
        public virtual ResponseJson OnEdit(TModel model)
        {
            return service.CallBack(ModelState.IsValid, response =>
            {
                service.Update(model, appUser.Id);
            });
        }
        [HttpPost]
        public virtual ActionResult Edit(TModel model)
        {
            return Json(OnEdit(model), JsonRequestBehavior.AllowGet);
        }
        public virtual ResponseJson OnDelete(Guid id)
        {
            ResponseJson response = new IqraService.Search.ResponseJson();
                //service.Delete(id);
                var entity = service.GetById(id);
                if (entity == null)
                {
                    response.IsError = true;
                    response.Id = ErrorCodes.NotFound;
                }
                else
                {
                    service.SetLog(entity);
                    entity.IsDeleted = true;
                    service.SaveChange();
                }
           
            return response;
        }
        [HttpPost]
        public virtual ActionResult Delete(Guid id)
        {
            return Json(OnDelete(id), JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Grid Actions

        public virtual async Task<JsonResult> GetWithSummary(Page page)
        {
            return Json(await service.GetWithSummary(page), JsonRequestBehavior.AllowGet);
        }
        public virtual async Task<JsonResult> GetDaily(Page page)
        {
            return Json(await service.Daily(page, true), JsonRequestBehavior.AllowGet);
        }
        public virtual async Task<JsonResult> GetMonthly(Page page)
        {
            return Json(await service.Daily(page, false), JsonRequestBehavior.AllowGet);
        }
        public virtual async Task<JsonResult> SuplierWise(Page page)
        {
            return Json(await service.SuplierWise(page), JsonRequestBehavior.AllowGet);
        }
        #endregion

        protected override void OnException(ExceptionContext filterContext)
        {
            using (var db = new AppDB())
            {
                var entity = db.SQLErrors.Add(new SQLErrors()
                {
                    CreatedAt = DateTime.Now,
                    ErrorLine = 0,
                    ErrorMessage = filterContext.Exception.Message,
                    ErrorProcedure = filterContext.HttpContext.Request.Url.AbsoluteUri,
                    Id = Guid.NewGuid(),
                    Remarks = filterContext.Exception.StackTrace,
                    ErrorNumber = 100
                });
                db.SaveChanges();
            }

            base.OnException(filterContext);
        }
        protected override void Dispose(bool disposing)
        {
            if(disposing)
            service.Dispose();
            base.Dispose(disposing);
        }
    }
}