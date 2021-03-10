using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class RegistrationAdminModel
    {

        [Required]
        public string NameAdmin { get; set; }
        [Required]
        public string PatronymicAdmin { get; set; }
        [Required]
        public string SurnameAdmin { get; set; }
        [Required]
        public string GenderAdmin { get; set; }
        [Required]
        public string DateOfBirthAdmin { get; set; }

        [Required]
        public string EmailAdmin { get; set; }
        [Required]
        public string PhoneAdmin { get; set; }
        [Required]
        public string DescriptionAdmin { get; set; }
        [Required]
        public string PasswordAdmin { get; set; }
        public string Token { get; set; }
    }
}
