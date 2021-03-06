using System;
using System.Configuration;
using System.Data;
using System.Web.Security;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web.UI;
using umbraco.BusinessLogic;
using umbraco.DataLayer;
using umbraco.BasePages;
using umbraco.IO;
using umbraco.cms.businesslogic.member;

namespace umbraco
{
    public class nodetypeTasks : LegacyDialogTask
    {
       
        public override bool PerformSave()
        {
            //NOTE: TypeID is the parent id!
            //NOTE: ParentID is aparently a flag to determine if we are to create a template! Hack much ?! :P
            var parentId = TypeID != 0 ? TypeID : -1;
            var contentType = parentId == -1
                                  ? new ContentType(-1)
                                  : new ContentType(ApplicationContext.Current.Services.ContentTypeService.GetContentType(parentId));
            contentType.CreatorId = User.Id;
            contentType.Alias = Alias.Replace("'", "''");
            contentType.Name = Alias.Replace("'", "''");
            contentType.Icon = UmbracoSettings.IconPickerBehaviour == IconPickerBehaviour.HideFileDuplicates
                                   ? ".sprTreeFolder"
                                   : "folder.gif";

            // Create template?
            if (ParentID == 1)
            {
                //TODO: We are creating a legacy template first because it contains the correct logic used to save templates, the
                // new API is not yet complete. See: http://issues.umbraco.org/issue/U4-2243, http://issues.umbraco.org/issue/U4-2277, http://issues.umbraco.org/issue/U4-2276
                var legacyTemplate = cms.businesslogic.template.Template.MakeNew(Alias, User);

                var template = ApplicationContext.Current.Services.FileService.GetTemplate(legacyTemplate.Id);
                //var template = new Template(string.Empty, _alias, _alias);
                //ApplicationContext.Current.Services.FileService.SaveTemplate(template, _userID);

                contentType.AllowedTemplates = new[] {template};
                contentType.DefaultTemplateId = template.Id;
            }
            ApplicationContext.Current.Services.ContentTypeService.Save(contentType);

            _returnUrl = "settings/editNodeTypeNew.aspx?id=" + contentType.Id.ToString();


            return true;
        }

        public override bool PerformDelete()
        {
            var docType = ApplicationContext.Current.Services.ContentTypeService.GetContentType(ParentID);
            if (docType != null)
            {
                ApplicationContext.Current.Services.ContentTypeService.Delete(docType);
            }
            return false;
        }

        private string _returnUrl = "";
        public override string ReturnUrl
        {
            get { return _returnUrl; }
        }

        public override string AssignedApp
        {
            get { return DefaultApps.settings.ToString(); }
        }
    }
}
