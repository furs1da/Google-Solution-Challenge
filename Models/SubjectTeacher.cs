using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class SubjectTeacher
    {
        public int Id { get; set; }
        public int TeacherId { get; set; }
        public int SubjectId { get; set; }

        public virtual Subject Subject { get; set; }
        public virtual Teacher Teacher { get; set; }
    }
}
