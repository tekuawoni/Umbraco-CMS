/**
  * @ngdoc service
  * @name umbraco.resources.contentResource
  * @description Handles all transactions of content data
  * from the angular application to the Umbraco database, using the Content WebApi controller
  *
  * all methods returns a resource promise async, so all operations won't complete untill .then() is completed.
  *
  * @requires $q
  * @requires $http
  * @requires umbDataFormatter
  * @requires umbRequestHelper
  *
  * ##usage
  * To use, simply inject the contentResource into any controller or service that needs it, and make
  * sure the umbraco.resources module is accesible - which it should be by default.
  *
  * <pre>
  *    contentResource.getById(1234)
  *          .then(function(data) {
  *              $scope.content = data;
  *          });    
  * </pre> 
  **/

function contentResource($q, $http, umbDataFormatter, umbRequestHelper) {

    /** internal method process the saving of data and post processing the result */
    function saveContentItem(content, action, files) {
        return umbRequestHelper.postSaveContent(
            umbRequestHelper.getApiUrl(
                "contentApiBaseUrl",
                "PostSave"),
            content, action, files);
    }

    return {
        
        /**
         * @ngdoc method
         * @name umbraco.resources.contentResource#sort
         * @methodOf umbraco.resources.contentResource
         *
         * @description
         * Sorts all children below a given parent node id, based on a collection of node-ids
         *
         * ##usage
         * <pre>
         * var ids = [123,34533,2334,23434];
         * contentResource.sort({ parentId: 1244, sortedIds: ids })
         *    .then(function() {
         *        $scope.complete = true;
         *    });
         * </pre> 
         * @param {Object} args arguments object
         * @param {Int} args.parentId the ID of the parent node
         * @param {Array} options.sortedIds array of node IDs as they should be sorted
         * @returns {Promise} resourcePromise object.
         *
         */
        sort: function (args) {
            if (!args) {
                throw "args cannot be null";
            }
            if (!args.parentId) {
                throw "args.parentId cannot be null";
            }
            if (!args.sortedIds) {
                throw "args.sortedIds cannot be null";
            }

            return umbRequestHelper.resourcePromise(
                $http.post(umbRequestHelper.getApiUrl("contentApiBaseUrl", "PostSort"),
                    {
                        parentId: args.parentId,
                        idSortOrder: args.sortedIds
                    }),
                'Failed to sort content');
        },

        /**
         * @ngdoc method
         * @name umbraco.resources.contentResource#emptyRecycleBin
         * @methodOf umbraco.resources.contentResource
         *
         * @description
         * Empties the content recycle bin
         *
         * ##usage
         * <pre>
         * contentResource.emptyRecycleBin()
         *    .then(function() {
         *        alert('its empty!');
         *    });
         * </pre> 
         *         
         * @returns {Promise} resourcePromise object.
         *
         */
        emptyRecycleBin: function() {
            return umbRequestHelper.resourcePromise(
                $http.delete(
                    umbRequestHelper.getApiUrl(
                        "contentApiBaseUrl",
                        "EmptyRecycleBin")),
                'Failed to empty the recycle bin');
        },

        /**
         * @ngdoc method
         * @name umbraco.resources.contentResource#deleteById
         * @methodOf umbraco.resources.contentResource
         *
         * @description
         * Deletes a content item with a given id
         *
         * ##usage
         * <pre>
         * contentResource.deleteById(1234)
         *    .then(function() {
         *        alert('its gone!');
         *    });
         * </pre> 
         * 
         * @param {Int} id id of content item to delete        
         * @returns {Promise} resourcePromise object.
         *
         */
        deleteById: function(id) {
            return umbRequestHelper.resourcePromise(
                $http.delete(
                    umbRequestHelper.getApiUrl(
                        "contentApiBaseUrl",
                        "DeleteById",
                        [{ id: id }])),
                'Failed to delete item ' + id);
        },

        /**
         * @ngdoc method
         * @name umbraco.resources.contentResource#getById
         * @methodOf umbraco.resources.contentResource
         *
         * @description
         * Gets a content item with a given id
         *
         * ##usage
         * <pre>
         * contentResource.getById(1234)
         *    .then(function(content) {
         *        var myDoc = content; 
         *        alert('its here!');
         *    });
         * </pre> 
         * 
         * @param {Int} id id of content item to return        
         * @returns {Promise} resourcePromise object containing the content item.
         *
         */
        getById: function (id) {            
            return umbRequestHelper.resourcePromise(
               $http.get(
                   umbRequestHelper.getApiUrl(
                       "contentApiBaseUrl",
                       "GetById",
                       [{ id: id }])),
               'Failed to retreive data for content id ' + id);
        },
        
        /**
         * @ngdoc method
         * @name umbraco.resources.contentResource#getByIds
         * @methodOf umbraco.resources.contentResource
         *
         * @description
         * Gets an array of content items, given a collection of ids
         *
         * ##usage
         * <pre>
         * contentResource.getByIds( [1234,2526,28262])
         *    .then(function(contentArray) {
         *        var myDoc = contentArray; 
         *        alert('they are here!');
         *    });
         * </pre> 
         * 
         * @param {Array} ids ids of content items to return as an array        
         * @returns {Promise} resourcePromise object containing the content items array.
         *
         */
        getByIds: function (ids) {
            
            var idQuery = "";
            _.each(ids, function(item) {
                idQuery += "ids=" + item + "&";
            });

            return umbRequestHelper.resourcePromise(
               $http.get(
                   umbRequestHelper.getApiUrl(
                       "contentApiBaseUrl",
                       "GetByIds",
                       idQuery)),
               'Failed to retreive data for content id ' + id);
        },

        
        /**
         * @ngdoc method
         * @name umbraco.resources.contentResource#getScaffold
         * @methodOf umbraco.resources.contentResource
         *
         * @description
         * Returns a scaffold of an empty content item, given the id of the content item to place it underneath and the content type alias.
         * 
         * - Parent Id must be provided so umbraco knows where to store the content
         * - Content Type alias must be provided so umbraco knows which properties to put on the content scaffold 
         * 
         * The scaffold is used to build editors for content that has not yet been populated with data.
         * 
         * ##usage
         * <pre>
         * contentResource.getScaffold(1234, 'homepage')
         *    .then(function(scaffold) {
         *        var myDoc = scaffold;
         *        myDoc.name = "My new document"; 
         *
         *        contentResource.publish(myDoc, true)
         *            .then(function(content){
         *                alert("Retrieved, updated and published again");
         *            });
         *    });
         * </pre> 
         * 
         * @param {Int} parentId id of content item to return
         * @param {String} alias contenttype alias to base the scaffold on        
         * @returns {Promise} resourcePromise object containing the content scaffold.
         *
         */
        getScaffold: function (parentId, alias) {
            
            return umbRequestHelper.resourcePromise(
               $http.get(
                   umbRequestHelper.getApiUrl(
                       "contentApiBaseUrl",
                       "GetEmpty",
                       [{ contentTypeAlias: alias }, { parentId: parentId }])),
               'Failed to retreive data for empty content item type ' + alias);
        },

        /**
         * @ngdoc method
         * @name umbraco.resources.contentResource#getChildren
         * @methodOf umbraco.resources.contentResource
         *
         * @description
         * Gets children of a content item with a given id
         *
         * ##usage
         * <pre>
         * contentResource.getChildren(1234, {pageSize: 10, pageNumber: 2})
         *    .then(function(contentArray) {
         *        var children = contentArray; 
         *        alert('they are here!');
         *    });
         * </pre> 
         * 
         * @param {Int} parentid id of content item to return children of
         * @param {Object} options optional options object
         * @param {Int} options.pageSize if paging data, number of nodes per page, default = 0
         * @param {Int} options.pageNumber if paging data, current page index, default = 0
         * @param {String} options.filter if provided, query will only return those with names matching the filter
         * @param {String} options.orderDirection can be `Ascending` or `Descending` - Default: `Ascending`
         * @param {String} options.orderBy property to order items by, default: `SortOrder`
         * @returns {Promise} resourcePromise object containing an array of content items.
         *
         */
        getChildren: function (parentId, options) {

            var defaults = {
                pageSize: 0,
                pageNumber: 0,
                filter: '',
                orderDirection: "Ascending",
                orderBy: "SortOrder"
            };
            if (options === undefined) {
                options = {}; 
            }
            //overwrite the defaults if there are any specified
            angular.extend(defaults, options);
            //now copy back to the options we will use
            options = defaults;
            //change asc/desct
            if (options.orderDirection === "asc") {
                options.orderDirection = "Ascending";
            }
            else if (options.orderDirection === "desc") {
                options.orderDirection = "Descending";
            }

            return umbRequestHelper.resourcePromise(
               $http.get(
                   umbRequestHelper.getApiUrl(
                       "contentApiBaseUrl",
                       "GetChildren",
                       [
                           { id: parentId },
                           { pageNumber: options.pageNumber },
                           { pageSize: options.pageSize },
                           { orderBy: options.orderBy },
                           { orderDirection: options.orderDirection },
                           { filter: options.filter }
                       ])),
               'Failed to retreive children for content item ' + parentId);
        },

        /**
         * @ngdoc method
         * @name umbraco.resources.contentResource#save
         * @methodOf umbraco.resources.contentResource
         *
         * @description
         * Saves changes made to a content item to its current version, if the content item is new, the isNew paramater must be passed to force creation
         * if the content item needs to have files attached, they must be provided as the files param and passed seperately 
         * 
         * 
         * ##usage
         * <pre>
         * contentResource.getById(1234)
         *    .then(function(content) {
         *          content.name = "I want a new name!";
         *          contentResource.save(content, false)
         *            .then(function(content){
         *                alert("Retrieved, updated and saved again");
         *            });
         *    });
         * </pre> 
         * 
         * @param {Object} content The content item object with changes applied
         * @param {Bool} isNew set to true to create a new item or to update an existing 
         * @param {Array} files collection of files for the document      
         * @returns {Promise} resourcePromise object containing the saved content item.
         *
         */
        save: function (content, isNew, files) {
            return saveContentItem(content, "save" + (isNew ? "New" : ""), files);
        },


        /**
         * @ngdoc method
         * @name umbraco.resources.contentResource#publish
         * @methodOf umbraco.resources.contentResource
         *
         * @description
         * Saves and publishes changes made to a content item to a new version, if the content item is new, the isNew paramater must be passed to force creation
         * if the content item needs to have files attached, they must be provided as the files param and passed seperately 
         * 
         * 
         * ##usage
         * <pre>
         * contentResource.getById(1234)
         *    .then(function(content) {
         *          content.name = "I want a new name, and be published!";
         *          contentResource.publish(content, false)
         *            .then(function(content){
         *                alert("Retrieved, updated and published again");
         *            });
         *    });
         * </pre> 
         * 
         * @param {Object} content The content item object with changes applied
         * @param {Bool} isNew set to true to create a new item or to update an existing 
         * @param {Array} files collection of files for the document      
         * @returns {Promise} resourcePromise object containing the saved content item.
         *
         */
        publish: function (content, isNew, files) {
            return saveContentItem(content, "publish" + (isNew ? "New" : ""), files);
        }

    };
}

angular.module('umbraco.resources').factory('contentResource', contentResource);
