﻿using NUnit.Framework;
using Rhino.Mocks;
using Umbraco.Core.Models;
using Umbraco.Core.Models.Membership;

namespace Umbraco.Tests.Models
{
    [TestFixture]
    public class UserExtensionsTests
    {
        [TestCase(2, "-1,1,2,3,4,5", true)]
        [TestCase(6, "-1,1,2,3,4,5", false)]
        [TestCase(-1, "-1,1,2,3,4,5", true)]
        [TestCase(5, "-1,1,2,3,4,5", true)]
        [TestCase(-1, "-1,-20,1,2,3,4,5", true)]
        [TestCase(1, "-1,-20,1,2,3,4,5", false)]
        public void Determines_Path_Based_Access_To_Content(int userId, string contentPath, bool outcome)
        {
            var user = MockRepository.GenerateStub<IUser>();
            user.StartContentId = userId;
            var content = MockRepository.GenerateStub<IContent>();
            content.Path = contentPath;

            Assert.AreEqual(outcome, user.HasPathAccess(content));
        }
    }
}