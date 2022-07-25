using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.Specialized;
using IqraBaseService.DAL;
using IqraService.Search;
using System.Web.Routing;
using IqraBase.Service;
using static IqraBase.Service.AccessArea.AccessService;
using IqraBase.App.LogInArea;

namespace IqraBase.Web.SetUp
{
    public class AccessService : IAccessService
    {
        private static ILogInResult emptyUser = new LogInResult() { Id = Guid.Empty };
        private static Dictionary<string, ResponseJson> Accesses = new Dictionary<string, ResponseJson>();
        public AccessService()
        {
            if (emptyUser == null)
                emptyUser = new LogInResult();
            if (Accesses == null)
                Accesses = new Dictionary<string, ResponseJson>();
        }
        public ResponseJson HasAccess(ILogInResult User, string controller, string action, NameValueCollection QueryString, RequestContext requestContext)
        {
            LogInResult user = (LogInResult)(User ?? emptyUser);
            var key = user.Id + controller + action;

            if (!Accesses.ContainsKey(key))
            {
                if ((controller == "ItemSales" && action == "AddNew") ||
                    (controller == "ProductReturn" && action == "AddNew"))
                {
                    return Accesses[key] = new ResponseJson();
                }
                using (var db = new IqraBase.Service.AccessArea.AccessService())
                {
                    Accesses[key] = new ResponseJson();
                    //Accesses[key] = db.HasAccess(user.Id,user.DesignationId, controller, action, QueryString);
                }
            }
            return Accesses[key];
        }
        public static ResponseJson HasMethodAccess(Guid Id, Guid designationId, string controller, string action)
        {
            var critiria = "acs.[AccessType]=4";
            if (Id != Guid.Empty)
            {
                critiria = "acs.[AccessType]=4 or acs.[AccessType]=3 or (acs.[AccessType]=1 and acs.RelativeId='" + Id + @"')  or  
                            (acs.[AccessType]=0 and acs.RelativeId='" + designationId + "')";
            }
            var response = new ResponseJson();
            var query = @"SELECT top 1 Count(acs.[Id]) [Count]
  FROM [dbo].[Access] acs 
  inner join [dbo].[ActionMethod] acmd on acs.[ActionMethodId]=acmd.Id
  inner join [dbo].[ActionController] aclr on acmd.ControllerId=aclr.Id
  left join [dbo].[Access] nacs on nacs.[AccessType]=2 and acs.[ActionMethodId]=acmd.Id and nacs.RelativeId='" + Id + @"'
  where  aclr.Name='" + controller + "' and acmd.Name='" + action + @"' and nacs.[RelativeId] is null and (" + critiria + ")";

            using (var db = new DBService())
            {
                var data = db.FirstOrDefaultSync<AccessCount>(query);
                response.IsError = data.Data == null || data.Data.Count == 0;
            }
            response.Id = Id == Guid.Empty ? -1 : -10;

            return response;
        }
        public bool HasAccess(ILogInResult User, string controller, string action)
        {
            return HasAccess(User, controller, action, null, null).IsError;
        }
        public static void SetAccess(ResponseJson access, string key)
        {
            Accesses[key] = access;
        }
        public static void SetAccess()
        {
            Accesses = new Dictionary<string, ResponseJson>();
        }
    }
}