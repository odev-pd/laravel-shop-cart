$(document).ready(function () {

    var baseUrl = document.location.origin;
    var token = $('meta[name="csrf-token"]').attr('content');

    function init() {
        $('input[name^=productId]').each(function () {
            totalFunc($(this).val());
        });
        if (typeof $('#shipping-select option:selected').data('rate') !== "undefined") {
            $('button#checkout').removeAttr('disabled');
        }
        var $subtotal = subtotal();
        $('#subtotal').text($subtotal);
        $('input[name=subtotal]').val($subtotal);
    }

    $('input[id^=productQty]').on('change', function () {
        var id = $(this).prop('id').replace("productQty", "");
        totalFunc(id);
        var $subtotal = subtotal();
        $('#subtotal').text($subtotal);
        $('#nav-total').text($subtotal);
        $('input[name=subtotal]').val($subtotal);
    });

    $('button[name^=delete]').on('click', function () {
        var id = $(this).val();
        var productRow = $(this).closest('div.product-row');
        var isRelated = productRow.find('input[name^=isRelatedProduct]').val();

        productRow.remove();

        var totalAmount = subtotal();
        $.post(baseUrl + '/cart', {
            input: "removeRow",
            productId: id,
            isRelated: isRelated,
            subtotal: totalAmount,
            _token: token
        }).done(function (data) {
            if (!$('div').is('.product-row')) {
                window.location.href = baseUrl + '/cart';
            }
            $('span#nav-items').text(data.items);
            $('span#nav-total').text(data.total);
            $('#subtotal').text(data.total);
            $('input[name=subtotal]').val(data.total);
        });
    });

    function totalFunc(id) {
        var total = +$('#productQty' + id).val() * (+$('#price' + id).text());
        $('#total' + id).text(Math.round(total * 100) / 100);
    }

    function subtotal() {
        var totalAmount = 0;
        $('span[id^=total]').each(function () {
            totalAmount = Math.round(100 * (totalAmount + parseFloat($(this).text()))) / 100;
        });
        if ($('#shipping-select option:selected').data('rate') > 0) {
            totalAmount += $('#shipping-select option:selected').data('rate');
        }
        return totalAmount;
    }

    $(document).on('change', '#shipping-select', function () {
        $('option#empty-option', this).remove();
        $('button#checkout').removeAttr('disabled');
        var totalAmount = subtotal();
        var id = $('option:selected', this).val();
        $.post(baseUrl + '/cart', {
            input: "changeShipping",
            shippingMethodId: id,
            subtotal: totalAmount,
            _token: token
        }).done(function (data) {
            $('span#nav-total').text(data.total);
            $('#subtotal').text(data.total);
            $('input[name=subtotal]').val(data.total);
        });
    });

    $(document).on('click', 'button#addRelated', function () {
        $.post(baseUrl + '/cart', {
            input: "addRelated",
            related_product_id: $(this).val(),
            _token: token
        }).done(function (data) {
            window.location.href = baseUrl + '/cart';
        });
    });

    //search
    $('button#nav-search-btn').on('click', function () {

        var keyword = $('input#nav-search').val();
        $.post(baseUrl + '/search', {_token: token, keyword: keyword}, function (data) {

            $('div.modal-body').html(data.html);

            $("#searchModal").modal('toggle');
        });
    });

    init();

    var orders = {
        $actionSelector: $('select#order-status-actions'),

        init: function () {
            this.$actionSelector.on('change', function (event) {
                event.preventDefault();
                var selector = this;
                if (selector.value) {
                    var id = $('option:selected', selector).data('order-id');
                    $.ajax({
                        method: 'POST',
                        url: baseUrl + '/order/status/',
                        data: {
                            id: id,
                            status: this.value,
                            _token: token,
                            _method: 'PUT'
                        },
                        success: function (data) {
                            if (data === 'redirect_to_cart') {
                                window.location.href = baseUrl + '/cart';
                            }
                            $(selector).closest('.row').find('.order-status').text(selector.value);
                            $(selector).
                                find('option')
                                .remove()
                                .end()
                                .append(
                                    data.html
                                );
                        },
                        error: function (jqXHR, exception) {
                            alert(ajaxError (jqXHR, exception));
                        }
                    });
                }
            })
        }
    }

    orders.init();

    var ajaxError = function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        return msg;
    }

});