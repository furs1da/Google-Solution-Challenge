using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using shagDiplom.Models;

namespace shagDiplom.Helpers
{
    public class AppSettings
    {
        public string Secret { get; set; }
    }
    public static class ExtensionMethods
    {
        public static IEnumerable<Admin> WithoutPasswords(this IEnumerable<Admin> users)
        {
            if (users == null) return null;

            return users.Select(x => x.WithoutPassword());
        }
        public static IEnumerable<Classes> WithoutCods(this IEnumerable<Classes> classes)
        {
            if (classes == null) return null;

            return classes.Select(x => x.WithoutPassword());
        }

        public static IEnumerable<Teacher> WithoutPasswords(this IEnumerable<Teacher> users)
        {
            if (users == null) return null;

            return users.Select(x => x.WithoutPassword());
        }

        public static IEnumerable<Pupil> WithoutPasswords(this IEnumerable<Pupil> users)
        {
            if (users == null) return null;

            return  users.Select(x => x.WithoutPassword());
        }

        public static IEnumerable<Parent> WithoutPasswords(this IEnumerable<Parent> users)
        {
            if (users == null) return null;

            return users.Select(x => x.WithoutPassword());
        }

    
        public static Admin WithoutPassword(this Admin user)
        {
            if (user == null) return null;
            user.Password = null;
            return user;
        }

        public static Teacher WithoutPassword(this Teacher user)
        {
            if (user == null) return null;

            user.Password = null;
            return user;
        }

        public static Pupil WithoutPassword(this Pupil user)
        {
            if (user == null) return null;

            user.Password = null;
            return user;
        }
        public static Classes WithoutPassword(this Classes userClass)
        {
            if (userClass == null) return null;

            userClass.AccessCode = null;
            return userClass;
        }
        public static Parent WithoutPassword(this Parent user)
        {
            if (user == null) return null;

            user.Password = null;
            return user;
        }
    }
}