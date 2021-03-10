using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class WriteThematicalModel
    {
        [Required]
        public string zeroSelect { get; set; }
        [Required]
        public string firstSelect { get; set; }
        [Required]
        public string secondSelect { get; set; }

        public string startDate { get; set; }

        public string endDate { get; set; }

    }
}
