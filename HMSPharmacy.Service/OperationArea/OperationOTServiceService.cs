using IqraBase.Data.Models;
using IqraBase.Service;
using IqraBaseService.Helper;
using IqraHMS.OT.Data.Entities.OperationArea;
using IqraHMS.OT.Data.Models.OperationArea;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Service.OperationArea
{
    public class OperationOTServiceService : AppBaseService<OperationOTService>
    {
        private string Alias { get; set; }
        public OperationOTServiceService()
        {
            Alias = "prtnotsrvc.";
        }
        public override string GetName(string name)
        {
            switch (name.ToLower())
            {
                case "creator":
                    name = "ctr.Name";
                    break;
                default:
                    name = Alias + name;
                    break;
            }
            return base.GetName(name);
        }
        public async override Task<ResponseList<Pagger<Dictionary<string, object>>>> Get(Page page)
        {
            page.SortBy = page.SortBy ?? "CreatedAt DESC";
            using (var db = new DBService(this))
            {
                return await db.GetPages(page, OperationServiceQuery.Get);
            }
        }

        public ResponseJson Remove(object id, Guid userId)
        {
            var serviceFromDb = Entity.Find(id);

            if (serviceFromDb is null) return new ResponseJson()
            {
                IsError = true,
                Id = ErrorCodes.NotFound
            };

            var operationFromDb = GetEntity<Operation>().Find(serviceFromDb.OperationId);

            var prevPayable = operationFromDb.TotalPayment;

            var currPayable = prevPayable - serviceFromDb.Payable * serviceFromDb.Quantity;

            operationFromDb.TotalPayment = currPayable;

            var history = new OperationHistoryModel(serviceFromDb.OperationId);

            Insert<OperationHistory>(GetEntity<OperationHistory>(),
                                     history.RemoveServiceHistory(serviceFromDb, prevPayable, currPayable),
                                     userId);
            SetLog(serviceFromDb);
            serviceFromDb.IsDeleted = true;

            SaveChange();

            return new ResponseJson() { IsError = false };
        }

        public override ResponseJson OnCreate(AppBaseModel model, Guid userId, bool isValid)
        {
            OperationOTServiceModel serviceModel = (OperationOTServiceModel)model;

            var operationFromDb = GetEntity<Operation>().Find(serviceModel.OperationId);

            var prevPayable = operationFromDb.TotalPayment;

            var currPayable = prevPayable + serviceModel.Payable * serviceModel.Quantity;

            operationFromDb.TotalPayment = currPayable;

            var history = new OperationHistoryModel(serviceModel.OperationId);

            Insert<OperationHistory>(GetEntity<OperationHistory>(),
                                     history.AddServiceHistory(serviceModel, prevPayable, currPayable),
                                     userId);

            return base.OnCreate(model, userId, isValid);
        }

        public override ResponseJson Update(AppBaseModel model, Guid userId)
        {
            return base.Update(model, userId);
        }
    }
    public class OperationServiceQuery
    {
        public static string Get { get { return @"
       [prtnotsrvc].[Id]
      ,[prtnotsrvc].[Name]
      ,[prtnotsrvc].[OperationId]
      ,[prtnotsrvc].[RefOTServiceId]
      ,[prtnotsrvc].[CreatedAt]
      ,[prtnotsrvc].[CreatedBy]
      ,[prtnotsrvc].[IsDeleted]
      ,[prtnotsrvc].[Remarks]
      ,[prtnotsrvc].[ActivityId]
      ,[prtnotsrvc].[Payable]
      ,[prtnotsrvc].[Unit]
      ,[prtnotsrvc].[Quantity]
	  ,[ctr].[Name] [Creator]
      FROM [dbo].[OperationOTService] [prtnotsrvc]
      LEFT JOIN [dbo].[User] [ctr] on [prtnotsrvc].[CreatedBy]=[ctr].Id"; } }
    }
}
