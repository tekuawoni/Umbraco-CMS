using Newtonsoft.Json;
using Umbraco.Core;
using Umbraco.Core.Logging;
using Umbraco.Core.PropertyEditors;

namespace Umbraco.Web.PropertyEditors
{
    /// <summary>
    /// A property editor to allow multiple selection of pre-defined items
    /// </summary>
    /// <remarks>
    /// Due to maintaining backwards compatibility this data type stores the value as a string which is a comma separated value of the 
    /// ids of the individual items so we have logic in here to deal with that.
    /// </remarks>
    [PropertyEditor(Constants.PropertyEditors.DropDownListMultiple, "Dropdown list multiple", "dropdown")]
    public class DropDownMultiplePropertyEditor : DropDownMultipleWithKeysPropertyEditor
    {
        protected override ValueEditor CreateValueEditor()
        {
            return new PublishValuesMultipleValueEditor(false, base.CreateValueEditor());
        }

    }

    

    
}