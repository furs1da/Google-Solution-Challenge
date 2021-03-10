using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class SubmitHomeworkModel
    {
        public string homeworkId { get; set; }
        public string comment { get; set; }
        public IFormFile attachement { get; set; }
    }
}
