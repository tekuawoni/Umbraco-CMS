﻿using System;
using NUnit.Framework;
using Umbraco.Core;
using Umbraco.Core.PropertyEditors;

namespace Umbraco.Tests.PropertyEditors
{
    [TestFixture]
    public class PropertyEditorValueEditorTests
    {
        [TestCase("STRING", "hello", "hello")]
        [TestCase("TEXT", "hello", "hello")]
        [TestCase("INT", "123", 123)]
        [TestCase("INTEGER", "123", 123)]
        [TestCase("INTEGER", "", null)] //test empty string for int  
        [TestCase("DATETIME", "", null)] //test empty string for date
        public void Value_Editor_Can_Convert_To_Clr_Type(string valueType, string val, object expected)
        {
            var valueEditor = new ValueEditor
                {
                    ValueType = valueType
                };

            var result = valueEditor.TryConvertValueToCrlType(val);
            Assert.IsTrue(result.Success);
            Assert.AreEqual(expected, result.Result);
        }

        [Test]
        public void Value_Editor_Can_Convert_To_Date_Clr_Type()
        {
            var valueEditor = new ValueEditor
                {
                    ValueType = "DATE"
                };

            var result = valueEditor.TryConvertValueToCrlType("2010-02-05");
            Assert.IsTrue(result.Success);
            Assert.AreEqual(new DateTime(2010, 2, 5), result.Result);
        }

        [TestCase("STRING", "hello", "hello")]
        [TestCase("TEXT", "hello", "hello")]
        [TestCase("INT", 123, "123")]
        [TestCase("INTEGER", 123, "123")]
        [TestCase("INTEGER", "", "")] //test empty string for int        
        [TestCase("DATETIME", "", "")] //test empty string for date
        public void Value_Editor_Can_Serialize_Value(string valueType, object val, string expected)
        {
            var valueEditor = new ValueEditor
                {
                    ValueType = valueType
                };

            var result = valueEditor.FormatDataForEditor(val);
            Assert.AreEqual(expected, result);
        }

        [Test]
        public void Value_Editor_Can_Serialize_Date_Value()
        {
            var now = DateTime.Now;
            var valueEditor = new ValueEditor
                {
                    ValueType = "DATE"
                };

            var result = valueEditor.FormatDataForEditor(now);
            Assert.AreEqual(now.ToXmlString<DateTime>(), result);
        }
    }
}