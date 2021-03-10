using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class RegistrationParentModel
    {
        [Required]
        public string NameParent { get; set; }
        [Required]
        public string PatronymicParent { get; set; }
        [Required]
        public string SurnameParent { get; set; }
        [Required]
        public string GenderParent { get; set; }
        [Required]
        public string DateOfBirthParent { get; set; }
        [Required]
        public string WorkPlace { get; set; }
        [Required]
        public string EmailParent { get; set; }
        [Required]
        public string PhoneParent { get; set; }
        [Required]
        public string AdressParent { get; set; }
        [Required]
        public string PasswordParent { get; set; }
        public string Token { get; set; }
    }
}
