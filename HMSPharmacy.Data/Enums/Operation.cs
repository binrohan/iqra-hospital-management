using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IqraHMS.OT.Data.Enums
{
    public enum OperationStatus
    {
        Initiated,
        PostOperationState,
        Running,
        PreOperationState,
        Cancelled,
        Failed,
        Passed
    }

    public enum OTPaymentStatus
    {
        NotPaied,
        PartiallyPaied,
        Paied,
        Refunded,
        PartiallyRefunded
    }
}
