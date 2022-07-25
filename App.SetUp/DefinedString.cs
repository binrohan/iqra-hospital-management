using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.SetUp
{
    public static class DefinedString
    {
        #region PatientArea
        public static class TransectionType
        {
            public static string AdvancePayment { get { return "Advance Payment"; } }
            public static string BedCharge { get { return "Bed Charge"; } }
            public static string BillClear { get { return "BillClear"; } }
            public static string Other { get { return "Other"; } }
            public static string ProductReturn { get { return "Product-Return"; } }
        }
        #endregion

        #region OT
        public static class OPERATION_STATUS
        {
            public static string INITIALTED { get { return "Initiated"; } }
            public static string POST_OPERATION_STAGE { get { return "Post Operation Stage"; } }
            public static string PRE_OPERATION_STAGE { get { return "Pre Operation Stage"; } }
            public static string RUNNING { get { return "Running"; } }
            public static string CANCELLED { get { return "Cancelled"; } }
            public static string FINISHED { get { return "Finished"; } }
        }

        public static class OPERATION_HISTORY_TYPES
        {
            public readonly static string STATUS_CHANGED = "Status Change";
            public readonly static string SURGON_ASSIGNED = "Surgon Assigned";
            public readonly static string SURGON_DISCHARGED = "Surgon Removed";
            public readonly static string SERVICE_CONSUMED = "Service Added";
            public readonly static string SERVICE_REMOVED = "Service Removed";
        }

        public static class SURGON_STATUS
        {
            public readonly static string ACTIVE = "Active";
            public readonly static string INACTIVE = "Inactive";
        }
        #endregion OT
    }
}
