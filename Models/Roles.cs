using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class Roles
    {
        public Roles()
        {
            Admin = new HashSet<Admin>();
            AnnouncementSender = new HashSet<AnnouncementSender>();
            Parent = new HashSet<Parent>();
            Pupil = new HashSet<Pupil>();
            Teacher = new HashSet<Teacher>();
        }

        public int IdRole { get; set; }
        public string Role { get; set; }

        public virtual ICollection<Admin> Admin { get; set; }
        public virtual ICollection<AnnouncementSender> AnnouncementSender { get; set; }
        public virtual ICollection<Parent> Parent { get; set; }
        public virtual ICollection<Pupil> Pupil { get; set; }
        public virtual ICollection<Teacher> Teacher { get; set; }
    }
}
