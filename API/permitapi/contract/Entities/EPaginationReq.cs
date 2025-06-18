using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace contract.Entities
{
    public class EPaginationReq
    {
        public int pageIndex { get; set; }
        public int pageSize { get; set; }
    }
}