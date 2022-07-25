using IqraHMS.OT.Data.Entities.AccountArea;
using IqraBase.Service;
using IqraService.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IqraHMS.OT.Data.Entities.OperationArea;
using IqraHMS.OT.Data.Models.OperationArea;
using IqraBase.Data.Models;
using static App.SetUp.DefinedString;

namespace IqraHMS.OT.Service.OperationArea
{

    public class OperationService : DropDownBaseService<Operation>
    {
        private string Alias { get; set; } = "prtn.";
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
                return await db.GetPages(page, OperationQuery.Get());
            }
        }
        public override ResponseJson Update(AppBaseModel model, Guid userId)
        {
            return base.Update(model, userId);
        }
        public override ResponseJson OnCreate(AppBaseModel model, Guid userId, bool isValid)
        {
            var appModel = (OperationModel)model;

            appModel.Status = OPERATION_STATUS.INITIALTED;

            try
            {
                return base.OnCreate(appModel, userId, isValid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
            
        }

        public async Task<ResponseJson> ChangeStatus(OperationChangeStatusModel model, Guid userId)
        {
            
            return await CallBackAsync(() => {
                try
                {
                    var operationFromDb = Entity.Find(model.Id);

                    var historyModel = new OperationHistoryModel(model.Id);

                    var history = historyModel.StatusChangeHistory(operationFromDb.Status, model.NewStatus);

                    operationFromDb.Status = model.NewStatus;
                    operationFromDb.UpdatedAt = model.UpdatedAt;

                    Insert(GetEntity<OperationHistory>(), history, userId);
                    SaveChange();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            });
            

           
        }

        public ResponseJson MakePayment(OperationPaymentModel model, Guid userId)
        {
            var operationFromDb = Entity.Find(model.OperationId);

            operationFromDb.PaidAmount += model.Amount;

            var history = new OperationPaymentHistory()
            {
                Amount = model.Amount,
                CreatedAt = DateTime.Now,
                CreatedBy = userId,
                PaymentLeft = operationFromDb.TotalPayment - operationFromDb.PaidAmount
            };

            GetEntity<OperationPaymentHistory>().Add(history);

            SaveChange();

            return new ResponseJson() { Id = 4, Data = operationFromDb, IsError = false, Msg = "Payment Succeed" };
        }
    }
    public class OperationQuery
    {
        public static string Get()
        {
            return @"[prtn].[Id]
                  ,[prtn].[Name]
                  ,[prtn].[CreatedAt]
                  ,[prtn].[CreatedBy]
                  ,[prtn].[UpdatedAt]
                  ,[prtn].[UpdatedBy]
                  ,[prtn].[IsDeleted]
                  ,[prtn].[Remarks]
                  ,[prtn].[ChangeLog]
                  ,[prtn].[ActivityId]
                  ,[prtn].[BranchId]
                  ,[prtn].[SurgeryId]
                  ,[prtn].[Status]
                  ,[prtn].[PreServiceStartedAt]
                  ,[prtn].[OperationStartedAt]
                  ,[prtn].[PostServiceStartedAt]
                  ,[prtn].[FinishedAt]
                  ,[prtn].[PaidAmount]
                  ,[prtn].[PatientId]
                  ,[prtn].[LeadDoctoryId]
                  ,[prtn].[ReferencePersonId]
                  ,[prtn].[SurgeryChargeForPatien]
                  ,[prtn].[SurgeryChargeDiscount]
                  ,[prtn].[SurgonChargeForPatien]
                  ,[prtn].[SurgonChargeDiscount]
                  ,[prtn].[TotalPayment]
               ,[crtr].Name [Creator]
				  ,[pdtr].Name [Updator]
              FROM [dbo].[Operation] [prtn]
			  LEFT JOIN [dbo].[User] [crtr] ON [crtr].Id = [prtn].[CreatedBy]
			  LEFT JOIN [dbo].[User] [pdtr] ON [pdtr].Id = [prtn].[UpdatedBy]";
        }
    }
}
