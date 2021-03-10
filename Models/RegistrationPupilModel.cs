using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class RegistrationPupilModel
    {
        [Required]
        public string NamePupil { get; set; }
        [Required]
        public string PatronymicPupil { get; set; }
        [Required]
        public string SurnamePupil { get; set; }
        [Required]
        public string GenderPupil { get; set; }
        [Required]
        public string DateOfBirthPupil { get; set; }
        public string MotoPupil { get; set; }
        public IFormFile ImageOfPupil { get; set; }
        [Required]
        public string EmailPupil { get; set; }
        [Required]
        public string PhonePupil { get; set; }
        [Required]
        public string AdressPupil { get; set; }
        [Required]
        public string PasswordPupil { get; set; }
        public string Token { get; set; }
    }
}
