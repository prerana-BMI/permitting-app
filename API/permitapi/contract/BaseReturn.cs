using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace contract
{
    public class BaseReturn<T>
    {
         public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public bool Success { get; set; }
        public int Count { get; set; }
    }
}