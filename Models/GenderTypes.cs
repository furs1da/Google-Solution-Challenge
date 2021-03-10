using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class GenderTypes
    {
        public GenderTypes()
        {
            Admin = new HashSet<Admin>();
            Parent = new HashSet<Parent>();
            Pupil = new HashSet<Pupil>();
            Teacher = new HashSet<Teacher>();
        }

        public int IdGender { get; set; }
        public string GenderType { get; set; }

        public virtual ICollection<Admin> Admin { get; set; }
        public virtual ICollection<Parent> Parent { get; set; }
        public virtual ICollection<Pupil> Pupil { get; set; }
        public virtual ICollection<Teacher> Teacher { get; set; }
    }
}
