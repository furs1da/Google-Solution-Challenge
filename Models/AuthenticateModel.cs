using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace shagDiplom.Models
{
    public class AuthenticateModel
    {
        [Required]
        public string Username { get; set; } //e-mail

        [Required]
        public string Password { get; set; }
    }

}
