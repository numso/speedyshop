/*global define */

define([
    'backbone',
    'tmpl!pages/employee/templates/shipping'
], function (
    Backbone,
    shippingTmpl
) {
    return Backbone.View.extend({
        pickedOrder: undefined,
        curInventory: undefined,

        initialize: function () {
        },

        events: {
            'click .completed-btn': 'updateOrders',
            'click .print-shipping-label': 'printLabel'
        },

        render: function () {
            this.$el.html(shippingTmpl({
                msg: "Click on an order to load it."
            }));

            var that = this;
            $.get('/giveMeTheItems', function (data) {
                that.curInventory = data;
            });
            return this;
        },

        printLabel: function (e) {
            window.print();
        },

        showLabel: function () {
            var data = {
                name: 'bubba',
                address: '575n 590w, Logan, UT, 84321',
                'order#': this.pickedOrder.orderNum,
                weight: this.pickedOrder.estimatedWeight
            };

            this.$('.ship-lbl-name').find('span').html(data.name);
            this.$('.ship-lbl-addr').find('span').html(data.address);
            this.$('.ship-lbl-order-num').find('span').html(data['order#']);
            this.$('.ship-lbl-weight').find('span').html(data.weight);

            var newData = '';
            for (var i in data) {
                newData += i + ":" + data[i] + '\n'
            }
            this.drawQRCode('shipping-qr', newData);
        },

        gotOrder: function (data) {
            this.pickedOrder = data;
            this.$el.html(shippingTmpl(data));
            this.showLabel();
        },

        updateOrders: function(){
            console.log(this.curInventory);
            if(this.isValid())
                {
                    this.pickedOrder.orderStatus = "Completed";

                    console.log(this.pickedOrder);

                    for(var x = 0; x < this.pickedOrder.items.length; ++x)
                        for(var n = 0; n < this.curInventory.length; ++n)
                            if(this.pickedOrder.items[x].itemID == this.curInventory[n].id)
                            { 
                                console.log(this.curInventory[n].available);
                                this.curInventory[n].available -= this.pickedOrder.items[x].quantity
                                console.log(this.curInventory[n].available);
                            }
                    $.post('/updateItemsAfterOrder', JSON.stringify(this.curInventory), function (resp) {
                        console.log("Response: " + JSON.stringify(resp));
                    });

                    $.post('/updateThisOrder', JSON.stringify(this.pickedOrder), function (resp) {
                        console.log("Response: " + JSON.stringify(resp));
                    });
                    
                    $('.error-msg').css('display', 'none');
                    $('.submitted-msg').css('display', 'inline');
                }
            else
            {
                console.log("im in here!");
                $('.error-msg').css('display', 'inline');
                $('.submitted-msg').css('display', 'none');
            }


        },

        isValid: function(){
            flag = true;
            $('.item-check').each(function (index){
                var thisValue = $(this).is(':checked');
                if(!thisValue)
                    flag = false;
           });
            return flag;
        },

        drawQRCode: function (id, data) {
            var qrcodedraw = new QRCodeLib.QRCodeDraw();
            qrcodedraw.draw(document.getElementById(id), data, function (error, canvas) {
                if (error) {
                    return console.log('ERROR: ' + error);
                }
            });
        }
    });
});
