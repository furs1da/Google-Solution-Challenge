using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class Admin
    {
        public Admin()
        {
            AnnouncementSender = new HashSet<AnnouncementSender>();
            FeedbackSenderReceiverIdAdminNavigation = new HashSet<FeedbackSender>();
            FeedbackSenderSenderIdAdminNavigation = new HashSet<FeedbackSender>();
        }

        public int IdAdmin { get; set; }
        public string Name { get; set; }
        public string Patronymic { get; set; }
        public string Surname { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int Gender { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int RoleId { get; set; }
        public string Description { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }

        public virtual GenderTypes GenderNavigation { get; set; }
        public virtual Roles Role { get; set; }
        public virtual ICollection<AnnouncementSender> AnnouncementSender { get; set; }
        public virtual ICollection<FeedbackSender> FeedbackSenderReceiverIdAdminNavigation { get; set; }
        public virtual ICollection<FeedbackSender> FeedbackSenderSenderIdAdminNavigation { get; set; }
    }
}
