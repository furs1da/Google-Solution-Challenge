using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class RegistrationTeacherModel
    {
        [Required]
        public string NameTeacher { get; set; }
        [Required]
        public string PatronymicTeacher { get; set; }
        [Required]
        public string SurnameTeacher { get; set; }
        [Required]
        public string GenderTeacher { get; set; }
        [Required]
        public string DateOfBirthTeacher { get; set; }
        public IFormFile ImageOfTeacher { get; set; }
        [Required]
        public string EmailTeacher { get; set; }
        [Required]
        public string PhoneTeacher { get; set; }
        [Required]
        public string AdressTeacher { get; set; }
        [Required]
        public string PasswordTeacher { get; set; }
        public string Token { get; set; }
    }
}
