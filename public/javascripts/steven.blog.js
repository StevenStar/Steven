$(document).ready(function () {
    function fnOnLoad() {
        var sPathName = window.location.pathname;
        var iNavIndex = 0;
        if (sPathName.indexOf('content') != -1) {
            iNavIndex = 1
        } else if (sPathName.indexOf('comment') != -1) {
            iNavIndex = 2;
        } else if (sPathName.indexOf('message') != -1) {
            iNavIndex = 3;
        } else if (sPathName.indexOf('music') != -1) {
            iNavIndex = 4;
        } else if (sPathName.indexOf('picture') != -1) {
            iNavIndex = 5;
        } else if (sPathName.indexOf('user') != -1) {
            iNavIndex = 6;
        } else if (sPathName.indexOf('setting') != -1) {
            iNavIndex = 7;
        }
        $('#admin_nav').find('li').eq(iNavIndex).addClass('active');
    }
	$("textarea").markdown({autofocus:false,
		savable:false,
		language: 'zh'})
    $.scrollUp({scrollName: "scrollUp",
        topDistance: "300",
        topSpeed: 300,
        animation: "fade",
        animationInSpeed: 10,
        animationOutSpeed: 10,
        scrollText: '<i class="glyphicon glyphicon-plane" style="color:#0055aa"></i>',
        activeOverlay: !1
    });
    $('.pinned').pin({
        containerSelector: '.container',
        minWidth: 940,
        padding: {top: 50}
    });
    $('#s_keepsite').click(function() {
        var title = 'Steven的个人网页';
        var url = window.location.href;
        try {
            window.external.addFavorite(url, title);
        } catch (e) {
            try {
                window.sidebar.addPanel(title, url, "");
            } catch (e) {
                alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加");
            }
        }
    });
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    $('div.md-preview').each(function() {$(this).html(markdown.toHTML($(this).html()))});
    $( '#vc-container' ).cassette({
        defaults: {
            songs: ['a2c5dd17c473038021142c402863b9a8',
                '71e6f9d0e308a6b9a0922bb0673415a7',
                '4deff6e13a3b857b51e08137989614fc',
                '0aabba63b8c2bc428a068eea6cf300ba']
        }
    });

    fnOnLoad();
});
