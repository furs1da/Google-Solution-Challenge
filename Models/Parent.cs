using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class Parent
    {
        public Parent()
        {
            FeedbackSenderReceiverIdParentNavigation = new HashSet<FeedbackSender>();
            FeedbackSenderSenderIdParentNavigation = new HashSet<FeedbackSender>();
            ParentStudent = new HashSet<ParentStudent>();
        }

        public int IdParent { get; set; }
        public string Name { get; set; }
        public string Patronymic { get; set; }
        public string Surname { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int Gender { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Adress { get; set; }
        public string WorkPlace { get; set; }
        public int RoleId { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }

        public virtual GenderTypes GenderNavigation { get; set; }
        public virtual Roles Role { get; set; }
        public virtual ICollection<FeedbackSender> FeedbackSenderReceiverIdParentNavigation { get; set; }
        public virtual ICollection<FeedbackSender> FeedbackSenderSenderIdParentNavigation { get; set; }
        public virtual ICollection<ParentStudent> ParentStudent { get; set; }
    }
}
