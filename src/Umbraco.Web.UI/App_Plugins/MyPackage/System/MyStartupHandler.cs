﻿using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Umbraco.Core;
using Umbraco.Web.UI.JavaScript;

namespace Umbraco.Web.UI.App_Plugins.MyPackage.System
{
    public class MyStartupHandler : ApplicationEventHandler
    {
        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            base.ApplicationStarted(umbracoApplication, applicationContext);

            //create a custom server variable to be exposed in JS
            ServerVariablesParser.Parsing += (sender, dictionary) =>
                {

                    var httpContext = HttpContext.Current;
                    if (httpContext == null) return;

                    var urlHelper = new UrlHelper(new RequestContext(new HttpContextWrapper(httpContext), new RouteData()));
                    
                    dictionary.Add("MyPackage", new Dictionary<string, object>()
                        {
                            {"serverEnvironmentView", urlHelper.Action("ServerEnvironment", "ServerSidePropertyEditors", new {area = "MyPackage"})}
                        });
                };

            //For testing for now we'll route to /Belle/Main
            var route = RouteTable.Routes.MapRoute(
                "umbraco-server-side-property-editors",
                "Belle/PropertyEditors/{controller}/{action}/{id}",
                new { controller = "ServerSidePropertyEditors", action = "Index", id = UrlParameter.Optional });
            //assign it to an area so that the plugin view engine looks for us
            route.DataTokens.Add("area", "MyPackage");
        }

    }
}