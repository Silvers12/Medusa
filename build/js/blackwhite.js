!function o(e,t,n){function l(r,i){if(!t[r]){if(!e[r]){var c="function"==typeof require&&require;if(!i&&c)return c(r,!0);if(a)return a(r,!0);var p=new Error("Cannot find module '"+r+"'");throw p.code="MODULE_NOT_FOUND",p}var d=t[r]={exports:{}};e[r][0].call(d.exports,function(o){var t=e[r][1][o];return l(t||o)},d,d.exports,o,e,t,n)}return t[r].exports}for(var a="function"==typeof require&&require,r=0;r<n.length;r++)l(n[r]);return l}({1:[function(o,e,t){$("#removeW").on("click",()=>{$("#white option:selected").remove().appendTo("#pool")}),$("#addW").on("click",()=>{$("#pool option:selected").remove().appendTo("#white")}),$("#addB").on("click",()=>{$("#pool option:selected").remove().appendTo("#black")}),$("#removeP").on("click",()=>{$("#pool option:selected").remove()}),$("#removeB").on("click",()=>{$("#black option:selected").remove().appendTo("#pool")}),$("#addToWhite").on("click",()=>{const o=$("#addToPoolText").val();if(""!==o){const e=$("<option>");e.prop("value",o),e.html(o),e.appendTo("#white"),$("#addToPoolText").val("")}}),$("#addToBlack").on("click",()=>{const o=$("#addToPoolText").val();if(""!==o){const e=$("<option>");e.prop("value",o),e.html(o),e.appendTo("#black"),$("#addToPoolText").val("")}}),e.exports={generateBlackWhiteList:()=>{let o=[];$("#white option").each((e,t)=>{o[e]=$(t).val()}),$("#whitelist").val(o.join(",")),o=[],$("#black option").each((e,t)=>{o[e]=$(t).val()}),$("#blacklist").val(o.join(","))},updateBlackWhiteList:o=>{$("#pool").children().remove(),$("#blackwhitelist").show(),o&&$.getJSON("home/fetch_releasegroups",{show_name:o},o=>{"success"===o.result&&$.each(o.groups,(o,e)=>{const t=$("<option>");t.prop("value",e.name),t.html(e.name+" | "+e.rating+" | "+e.range),t.appendTo("#pool")})})}}},{}]},{},[1]);
//# sourceMappingURL=blackwhite.js.map
