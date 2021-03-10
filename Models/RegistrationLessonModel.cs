using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace shagDiplom.Models
{
    public class RegistrationLessonModel
    {
        [Required]
        public string flow { get; set; }
        [Required]
        public string letter { get; set; }
        [Required]
        public string dayId { get; set; }
        [Required]
        public string subjectId { get; set; }
        [Required]
        public string teacherId { get; set; }
        [Required]
        public string lessonOrder { get; set; }
    }
}
