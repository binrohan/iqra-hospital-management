using IqraBase.Data.Models;
using IqraBase.Service;
using IqraBaseService.Helper;
using IqraHMS.OT.Data.Entities.OTServiceArea;
using IqraHMS.OT.Data.Entities.SurgeryArea;
using IqraHMS.OT.Data.Models.SurgeryArea;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Service.SurgeryArea
{
    public class OperationPackageOTServiceService : AppBaseService<OperationPackageOTService>
    {
        private string Alias { get; set; } = "prtnpckgotsrvc.";
        public override string GetName(string name)
        {
            name = name ?? "[CreatedAt]";
            switch (name.ToLower())
            {
                case "creator":
                    name = "ctr.Name";
                    break;
                case "updator":
                    name = "pdtr.Name";
                    break;
                default:
                    name = Alias + name;
                    break;
            }
            return base.GetName(name);
        }
        public override async Task<ResponseList<Pagger<Dictionary<string, object>>>> Get(Page page)
        {
            using (DBService db = new DBService(this))
            {
                page.SortBy = page.SortBy ?? "[CreatedAt] desc";
                return await db.GetPages(page, OperationPackageOTServiceQuery.Get());
            }
        }

        public override ResponseJson OnCreate(AppBaseModel model, Guid userId, bool isValid)
        {
            var operationPackageOTServiceModel = (OperationPackageOTServiceModel)model;

            var serviceFromDb = GetEntity<OTService>().Find(operationPackageOTServiceModel.ServiceId);

            var operationPackageFromDb = GetEntity<OperationPackage>().Find(operationPackageOTServiceModel.OperationPackageId);

            operationPackageFromDb.OriginalCost += (serviceFromDb.Price * operationPackageOTServiceModel.Quantity);

            return base.OnCreate(operationPackageOTServiceModel, userId, isValid);
        }

        public override ResponseJson Update(AppBaseModel model, Guid userId)
        {
            var operationPackageOTServiceModel = (OperationPackageOTServiceModel)model;

            var serviceFromDb = GetEntity<OTService>().Find(operationPackageOTServiceModel.ServiceId);

            var operationPackageOTServiceFromDb = GetEntity<OperationPackageOTService>().Find(operationPackageOTServiceModel.Id);

            var operationPackageFromDb = GetEntity<OperationPackage>().Find(operationPackageOTServiceModel.OperationPackageId);

            operationPackageFromDb.OriginalCost -= operationPackageOTServiceFromDb.Quantity * serviceFromDb.Price;

            operationPackageFromDb.OriginalCost += operationPackageOTServiceModel.Quantity * serviceFromDb.Price;

            return base.Update(model, userId);
        }

        public ResponseJson Remove(object id, Guid userId)
        {
            var operationPackageOTserviceFromDb = Entity.Find(id);

            if (operationPackageOTserviceFromDb is null) return new ResponseJson()
            {
                IsError = true,
                Id = ErrorCodes.NotFound
            };

            var serviceFromDb = GetEntity<OTService>().Find(operationPackageOTserviceFromDb.ServiceId);

            var operationPackageFromDb = GetEntity<OperationPackage>().Find(operationPackageOTserviceFromDb.OperationPackageId);

            operationPackageFromDb.OriginalCost -= operationPackageOTserviceFromDb.Quantity * serviceFromDb.Price;

            operationPackageOTserviceFromDb.IsDeleted = true;

            SaveChange();

            return new ResponseJson() { IsError = false };
        }
    }

    public class OperationPackageOTServiceQuery
    {
        public static string Get()
        {
            return @"
             [prtnpckgotsrvc].[Id]
            ,[prtnpckgotsrvc].[CreatedAt]
            ,[prtnpckgotsrvc].[CreatedBy]
            ,[prtnpckgotsrvc].[UpdatedAt]
            ,[prtnpckgotsrvc].[UpdatedBy]
            ,[prtnpckgotsrvc].[Remarks]
            ,[prtnpckgotsrvc].[Quantity]
            ,[prtnpckgotsrvc].[OperationPackageId]
            ,[prtnpckgotsrvc].[ServiceId]
            ,[otsrvc].[Name] [ServiceName]
            ,[otsrvc].[Remarks] [ServiceRemarks]
            ,[otsrvc].[Price]
            ,[otsrvc].[Unit]
            ,[ctr].Name [Creator]
            ,[pdtr].Name [Updator]
            FROM [dbo].[OperationPackageOTService] [prtnpckgotsrvc]
            LEFT JOIN [dbo].[OTService] [otsrvc] ON [prtnpckgotsrvc].ServiceId = [otsrvc].Id
            LEFT JOIN [dbo].[User] [ctr] ON [prtnpckgotsrvc].CreatedBy = [ctr].Id
            LEFT JOIN [dbo].[User] [pdtr] ON [prtnpckgotsrvc].CreatedBy = [pdtr].Id";
        }
    }
}
