/*global define */

define([
    'backbone',
    'tmpl!pages/templates/items'
], function (
    Backbone,
    itemsTmpl
) {
    return Backbone.View.extend({

        initialize: function () {
        },

        events: {
        },

        render: function () {
            this.$el.html(itemsTmpl());
            return this;
        }
    });
});
