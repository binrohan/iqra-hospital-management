using IqraBaseService.Helper;
using IqraBase.Data;
using IqraService.Helper;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IqraBase.Web.SetUp
{
    public class ControllerService : IControllerService
    {
        private static int Id { get; set; } = 0;
        private static ResponseJson response { get; set; } = new ResponseJson() { Id = 0 };
        private AppDB db;
        public void InIt()
        {
            db = new AppDB();
        }
        public Type GetDependentType(Type type)
        {
            return type;
        }
        public Dictionary<int, List<ActionMethod>> GetServerActionMethod()
        {
            var list = new Dictionary<int, List<ActionMethod>>();
            foreach (var methood in db.ActionMethod.Select(a => new ActionMethod() { ControllerId = a.ControllerId, Id = a.Id, Name = a.Name }))
            {
                if (!list.ContainsKey(methood.ControllerId))
                {
                    list[methood.ControllerId] = new List<ActionMethod>();
                }
                list[methood.ControllerId].Add(methood);
            }
            return list;
        }
        public Dictionary<string, ControllerModel> GetServerController()
        {
            var list = new Dictionary<string, ControllerModel>();
            foreach (var methood in db.ActionController.Select(a => new ControllerModel() { Rout = a.Rout, Id = a.Id, Name = a.Name }))
            {
                list[methood.Name] = methood;
            }
            return list;
        }
        public virtual List<ControllerInfo> GetClientController()
        {
            var data = ControllerInfo.GetControllers(this.GetType().Assembly.GetTypes());
            data.AddRange(ControllerInfo.GetControllers((typeof(IqraBaseService.Controllers.BaseController)).Assembly.GetTypes()));
            data.AddRange(ControllerInfo.GetControllers((typeof(BaseProject.Controllers.AccountController)).Assembly.GetTypes()));
            data.AddRange(ControllerInfo.GetControllers((typeof(IqraHMS.Web.Areas.PatientArea.Controllers.PatientController)).Assembly.GetTypes()));
            data.AddRange(ControllerInfo.GetControllers((typeof(IqraHMS.OT.Web.Areas.AccountArea.Controllers.AccountReferenceController)).Assembly.GetTypes()));

            return data;
        }
        public ResponseJson SaveActionMethodToServer(ActionMethod method)
        {
            if (method.ControllerId != -1)
            {
                var model = new IqraBase.Data.Entities.AccessArea.ActionMethod()
                {
                    ControllerId = method.ControllerId,
                    Name = method.Name,
                };
                db.ActionMethod.Add(model);
            }

            return new ResponseJson();
        }
        public ResponseJson SaveControllerToServer(string Name, string RoutName)
        {
            if (!Name.Contains("AppBase") && !Name.Contains("DropDownBase"))
            {
                var model = new IqraBase.Data.Entities.AccessArea.ActionController()
                {
                    Rout = RoutName,
                    Name = Name,
                };
                db.ActionController.Add(model);
                db.SaveChanges();
                return new ResponseJson() { Id = model.Id };
            }
            return new ResponseJson() { Id = -1 };
        }
        public void Dispose()
        {
            if (db != null)
            {
                db.SaveChanges();
                db.Dispose();
            }
        }
    }
}