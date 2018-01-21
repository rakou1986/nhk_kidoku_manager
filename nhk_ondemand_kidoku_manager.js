// ==UserScript==
// @name         NHK Ondemand Kidoku Manager
// @namespace    https://www.nhk-ondemand.jp/
// @version      1.1
// @description  NHKオンデマンドのCookieに独自のキーkidokuを追加して既読を管理するUserScript（Chrome/Tampermonkey用）
// @author       @rakousan / rakou1986
// @match        https://www.nhk-ondemand.jp/goods/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js
// ==/UserScript==

// MIT License
//
// Copyright (c) 2018 @rakousan
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

(function() {
    'use strict';
    $(document).ready(function(){
        var goods_id = document.location.pathname.split("/")[2];
        var mita = $("<button id='mou_mita' style='margin:4px; padding:4px;'>もう見た</button>");
        var mitenai = $("<button id='mou_mita' style='margin:4px; padding:4px;'>まだ見てなかった</button>");

        var msg = $("<strong style='margin:4px;'></strong>");
        var kidoku_msg = "既読にしました";
        var midoku_msg = "未読にしました";

        var status = $("<strong style='margin:4px;'></strong>");
        var kidoku_str = "これは既読です";
        var midoku_str = "これは未読です";

        var import_button = $("<button id='import_button' style='margin:4px; padding:4px;'>インポート</button>");
        var export_button = $("<button id='export_button' style='margin:4px; padding:4px;'>エクスポート</button>");
        var cookie_textbox = $("<input id='cookie_textbox' type='text' style='margin:4px; padding:4px;' />");

        var kidoku = $.cookie("kidoku");

        var dst = $(".watch"); // 配信期間：～～～～ の前後にボタン等を追加する

        // /goods/* のスクリプトではあるが、検索結果など他のページで
        // kidoku を使いたいのでルートへ登録
        var set_cookie = function(array) {
            $.cookie("kidoku", JSON.stringify(array), {path: "/"});
        };

        var set_status = function(kidoku_) {
            if (kidoku_) {
                status.text(kidoku_str);
                status.css("color", "blue");
            } else {
                status.text(midoku_str);
                status.css("color", "lightgray");
            }
        };

        var flash_msg = function(text) {
            msg.text(text).fadeIn(300).delay(3000).fadeOut(300);
        };

        kidoku = kidoku === undefined ? Array() : JSON.parse(kidoku);
        // noop: undefinedを捨てるwarningの回避用
        var status_initializer = function() {
            var noop = kidoku.indexOf(goods_id) != -1 ? set_status(true) : set_status(false);
        };

        status_initializer();

        mita.click(function(){
            if (kidoku.indexOf(goods_id) == -1) {
                kidoku.push(goods_id);
            }
            set_cookie(kidoku);
            flash_msg(kidoku_msg);
            set_status(true);
        });

        mitenai.click(function(){
            var idx = kidoku.indexOf(goods_id);
            if (idx != -1) {
                kidoku.splice(idx, 1);
            }
            set_cookie(kidoku);
            flash_msg(midoku_msg);
            set_status(false);
        });

        export_button.click(function(){
            $.when(cookie_textbox.val($.cookie("kidoku"))).done(cookie_textbox.select());
            flash_msg("コピーでエクスポート");
        });

        import_button.click(function(){
            if( confirm("インポートを実行しますか？（既読管理データを丸ごと入れ替えます）")) {
                var array_ = undefined;
                try {
                    array_ = JSON.parse( cookie_textbox.val() );
                } catch(e) {
                    alert("インポートをキャンセルしました。データ形式が誤っています。");
                }
                if (array_ !== undefined) {
                    kidoku = array_;
                    set_cookie(kidoku);
                    status_initializer();
                    alert("インポートしました。");
                }
            } else {
                alert("インポートをキャンセルしました。");
            }
        });

        msg.hide();
        dst.prepend(import_button);
        dst.prepend( $("<strong>→</strong>") );
        dst.prepend(cookie_textbox);
        dst.prepend( $("<strong>→</strong>") );
        dst.prepend(export_button);
        dst.prepend($("<br>"));
        dst.prepend(msg);
        dst.prepend(mitenai);
        dst.prepend(mita);
        dst.append(status);
    });
})();
