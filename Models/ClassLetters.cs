using System;
using System.Collections.Generic;

namespace shagDiplom.Models
{
    public partial class ClassLetters
    {
        public ClassLetters()
        {
            Classes = new HashSet<Classes>();
        }

        public int IdLetter { get; set; }
        public string ClassLetter { get; set; }

        public virtual ICollection<Classes> Classes { get; set; }
    }
}
