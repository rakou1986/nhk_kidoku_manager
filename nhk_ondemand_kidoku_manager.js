// ==UserScript==
// @name         NHK Ondemand Kidoku Manager
// @namespace    https://www.nhk-ondemand.jp/
// @version      1.0
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

        var kidoku = $.cookie("kidoku");
        var dst = $(".watch"); // 配信期間：～～～～ の前後にボタン等を追加する

        var set_cookie = function(array) {
            $.cookie("kidoku", JSON.stringify(array), {path: "/"});
        };

        kidoku = kidoku === undefined ? Array() : JSON.parse(kidoku);
        // noop: undefinedを捨てるwarningの回避用
        var noop = kidoku.indexOf(goods_id) != -1 ? status.text(kidoku_str) : status.text(midoku_str);

        mita.click(function(){
            if (kidoku.indexOf(goods_id) == -1) {
                kidoku.push(goods_id);
            }
            set_cookie(kidoku);
            msg.text(kidoku_msg).fadeIn(300).delay(3000).fadeOut(300);
            status.text(kidoku_str);
        });

        mitenai.click(function(){
            var idx = kidoku.indexOf(goods_id);
            if (idx != -1) {
                kidoku.splice(idx, 1);
            }
            set_cookie(kidoku);
            msg.text(midoku_msg).fadeIn(300).delay(3000).fadeOut(300);
            status.text(midoku_str);
        });

        msg.hide();
        dst.prepend(msg);
        dst.prepend(mitenai);
        dst.prepend(mita);
        dst.append(status);
    });
})();
