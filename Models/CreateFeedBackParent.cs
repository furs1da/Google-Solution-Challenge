using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class CreateFeedBackParent
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Content { get; set; }
        public string ZeroSelect { get; set; }
        public string FirstSelect { get; set; }
        public string SecondSelect { get; set; }
        public string ThirdSelect { get; set; }
        public IFormFile Attachement { get; set; }
    }
}
