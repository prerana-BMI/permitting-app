using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace contract.Entities
{
    public class EMatrixWisePermit
    {
        public EPermitMatrix MatrixDetails { get; set; }
        public List<EPermitMasterDetail> PermitList{ get; set; }
        
    }
}