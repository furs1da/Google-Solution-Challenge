using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class RegistrationClassModel
    {
        [Required]
        public string flow { get; set; }
        [Required]
        public string letter { get; set; }
        [Required]
        public string idClassroomTeacher { get; set; }
        [Required]
        public string accessCode { get; set; }     
    }
}
