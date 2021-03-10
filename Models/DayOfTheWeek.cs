using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class DayOfTheWeek
    {
        public DayOfTheWeek()
        {
            Curricular = new HashSet<Curricular>();
        }

        public int IdDay { get; set; }
        public string DayName { get; set; }

        public virtual ICollection<Curricular> Curricular { get; set; }
    }
}
