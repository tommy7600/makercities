/*!
 * jQuery Form Plugin
 * version: 3.32.0-2013.04.09
 * @requires jQuery v1.5 or later
 * Copyright (c) 2013 M. Alsup
 */
(function($){var feature={};feature.fileapi=$("<input type='file'/>").get(0).files!==undefined;feature.formdata=window.FormData!==undefined;var hasProp=!!$.fn.prop;$.fn.attr2=function(){if(!hasProp){return this.attr.apply(this,arguments)}var val=this.prop.apply(this,arguments);if((val&&val.jquery)||typeof val==="string"){return val}return this.attr.apply(this,arguments)};$.fn.ajaxSubmit=function(options){if(!this.length){log("ajaxSubmit: skipping submit process - no element selected");return this}var method,action,url,$form=this;if(typeof options=="function"){options={success:options}}method=this.attr2("method");action=this.attr2("action");url=(typeof action==="string")?$.trim(action):"";url=url||window.location.href||"";if(url){url=(url.match(/^([^#]+)/)||[])[1]}options=$.extend(true,{url:url,success:$.ajaxSettings.success,type:method||"GET",iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank"},options);var veto={};this.trigger("form-pre-serialize",[this,options,veto]);if(veto.veto){log("ajaxSubmit: submit vetoed via form-pre-serialize trigger");return this}if(options.beforeSerialize&&options.beforeSerialize(this,options)===false){log("ajaxSubmit: submit aborted via beforeSerialize callback");return this}var traditional=options.traditional;if(traditional===undefined){traditional=$.ajaxSettings.traditional}var elements=[];var qx,a=this.formToArray(options.semantic,elements);if(options.data){options.extraData=options.data;qx=$.param(options.data,traditional)}if(options.beforeSubmit&&options.beforeSubmit(a,this,options)===false){log("ajaxSubmit: submit aborted via beforeSubmit callback");return this}this.trigger("form-submit-validate",[a,this,options,veto]);if(veto.veto){log("ajaxSubmit: submit vetoed via form-submit-validate trigger");return this}var q=$.param(a,traditional);if(qx){q=(q?(q+"&"+qx):qx)}if(options.type.toUpperCase()=="GET"){options.url+=(options.url.indexOf("?")>=0?"&":"?")+q;options.data=null}else{options.data=q}var callbacks=[];if(options.resetForm){callbacks.push(function(){$form.resetForm()})}if(options.clearForm){callbacks.push(function(){$form.clearForm(options.includeHidden)})}if(!options.dataType&&options.target){var oldSuccess=options.success||function(){};callbacks.push(function(data){var fn=options.replaceTarget?"replaceWith":"html";$(options.target)[fn](data).each(oldSuccess,arguments)})}else{if(options.success){callbacks.push(options.success)}}options.success=function(data,status,xhr){var context=options.context||this;for(var i=0,max=callbacks.length;i<max;i++){callbacks[i].apply(context,[data,status,xhr||$form,$form])}};var fileInputs=$('input[type=file]:enabled[value!=""]',this);var hasFileInputs=fileInputs.length>0;var mp="multipart/form-data";var multipart=($form.attr("enctype")==mp||$form.attr("encoding")==mp);var fileAPI=feature.fileapi&&feature.formdata;log("fileAPI :"+fileAPI);var shouldUseFrame=(hasFileInputs||multipart)&&!fileAPI;var jqxhr;if(options.iframe!==false&&(options.iframe||shouldUseFrame)){if(options.closeKeepAlive){$.get(options.closeKeepAlive,function(){jqxhr=fileUploadIframe(a)})}else{jqxhr=fileUploadIframe(a)}}else{if((hasFileInputs||multipart)&&fileAPI){jqxhr=fileUploadXhr(a)}else{jqxhr=$.ajax(options)}}$form.removeData("jqxhr").data("jqxhr",jqxhr);for(var k=0;k<elements.length;k++){elements[k]=null}this.trigger("form-submit-notify",[this,options]);return this;function deepSerialize(extraData){var serialized=$.param(extraData).split("&");var len=serialized.length;var result=[];var i,part;for(i=0;i<len;i++){serialized[i]=serialized[i].replace(/\+/g," ");part=serialized[i].split("=");result.push([decodeURIComponent(part[0]),decodeURIComponent(part[1])])}return result}function fileUploadXhr(a){var formdata=new FormData();for(var i=0;i<a.length;i++){formdata.append(a[i].name,a[i].value)}if(options.extraData){var serializedData=deepSerialize(options.extraData);for(i=0;i<serializedData.length;i++){if(serializedData[i]){formdata.append(serializedData[i][0],serializedData[i][1])}}}options.data=null;var s=$.extend(true,{},$.ajaxSettings,options,{contentType:false,processData:false,cache:false,type:method||"POST"});if(options.uploadProgress){s.xhr=function(){var xhr=jQuery.ajaxSettings.xhr();if(xhr.upload){xhr.upload.addEventListener("progress",function(event){var percent=0;var position=event.loaded||event.position;var total=event.total;if(event.lengthComputable){percent=Math.ceil(position/total*100)}options.uploadProgress(event,position,total,percent)},false)}return xhr}}s.data=null;var beforeSend=s.beforeSend;s.beforeSend=function(xhr,o){o.data=formdata;if(beforeSend){beforeSend.call(this,xhr,o)}};return $.ajax(s)}function fileUploadIframe(a){var form=$form[0],el,i,s,g,id,$io,io,xhr,sub,n,timedOut,timeoutHandle;var deferred=$.Deferred();if(a){for(i=0;i<elements.length;i++){el=$(elements[i]);if(hasProp){el.prop("disabled",false)}else{el.removeAttr("disabled")}}}s=$.extend(true,{},$.ajaxSettings,options);s.context=s.context||s;id="jqFormIO"+(new Date().getTime());if(s.iframeTarget){$io=$(s.iframeTarget);n=$io.attr2("name");if(!n){$io.attr2("name",id)}else{id=n}}else{$io=$('<iframe name="'+id+'" src="'+s.iframeSrc+'" />');$io.css({position:"absolute",top:"-1000px",left:"-1000px"})}io=$io[0];xhr={aborted:0,responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){},getResponseHeader:function(){},setRequestHeader:function(){},abort:function(status){var e=(status==="timeout"?"timeout":"aborted");log("aborting upload... "+e);this.aborted=1;try{if(io.contentWindow.document.execCommand){io.contentWindow.document.execCommand("Stop")}}catch(ignore){}$io.attr("src",s.iframeSrc);xhr.error=e;if(s.error){s.error.call(s.context,xhr,e,status)}if(g){$.event.trigger("ajaxError",[xhr,s,e])}if(s.complete){s.complete.call(s.context,xhr,e)}}};g=s.global;if(g&&0===$.active++){$.event.trigger("ajaxStart")}if(g){$.event.trigger("ajaxSend",[xhr,s])}if(s.beforeSend&&s.beforeSend.call(s.context,xhr,s)===false){if(s.global){$.active--}deferred.reject();return deferred}if(xhr.aborted){deferred.reject();return deferred}sub=form.clk;if(sub){n=sub.name;if(n&&!sub.disabled){s.extraData=s.extraData||{};s.extraData[n]=sub.value;if(sub.type=="image"){s.extraData[n+".x"]=form.clk_x;s.extraData[n+".y"]=form.clk_y}}}var CLIENT_TIMEOUT_ABORT=1;var SERVER_ABORT=2;function getDoc(frame){var doc=null;try{if(frame.contentWindow){doc=frame.contentWindow.document}}catch(err){log("cannot get iframe.contentWindow document: "+err)}if(doc){return doc}try{doc=frame.contentDocument?frame.contentDocument:frame.document}catch(err){log("cannot get iframe.contentDocument: "+err);doc=frame.document}return doc}var csrf_token=$("meta[name=csrf-token]").attr("content");var csrf_param=$("meta[name=csrf-param]").attr("content");if(csrf_param&&csrf_token){s.extraData=s.extraData||{};s.extraData[csrf_param]=csrf_token}function doSubmit(){var t=$form.attr2("target"),a=$form.attr2("action");form.setAttribute("target",id);if(!method){form.setAttribute("method","POST")}if(a!=s.url){form.setAttribute("action",s.url)}if(!s.skipEncodingOverride&&(!method||/post/i.test(method))){$form.attr({encoding:"multipart/form-data",enctype:"multipart/form-data"})}if(s.timeout){timeoutHandle=setTimeout(function(){timedOut=true;cb(CLIENT_TIMEOUT_ABORT)},s.timeout)}function checkState(){try{var state=getDoc(io).readyState;log("state = "+state);if(state&&state.toLowerCase()=="uninitialized"){setTimeout(checkState,50)}}catch(e){log("Server abort: ",e," (",e.name,")");cb(SERVER_ABORT);if(timeoutHandle){clearTimeout(timeoutHandle)}timeoutHandle=undefined}}var extraInputs=[];try{if(s.extraData){for(var n in s.extraData){if(s.extraData.hasOwnProperty(n)){if($.isPlainObject(s.extraData[n])&&s.extraData[n].hasOwnProperty("name")&&s.extraData[n].hasOwnProperty("value")){extraInputs.push($('<input type="hidden" name="'+s.extraData[n].name+'">').val(s.extraData[n].value).appendTo(form)[0])}else{extraInputs.push($('<input type="hidden" name="'+n+'">').val(s.extraData[n]).appendTo(form)[0])}}}}if(!s.iframeTarget){$io.appendTo("body");if(io.attachEvent){io.attachEvent("onload",cb)}else{io.addEventListener("load",cb,false)}}setTimeout(checkState,15);try{form.submit()}catch(err){var submitFn=document.createElement("form").submit;submitFn.apply(form)}}finally{form.setAttribute("action",a);if(t){form.setAttribute("target",t)}else{$form.removeAttr("target")}$(extraInputs).remove()}}if(s.forceSync){doSubmit()}else{setTimeout(doSubmit,10)}var data,doc,domCheckCount=50,callbackProcessed;function cb(e){if(xhr.aborted||callbackProcessed){return}doc=getDoc(io);if(!doc){log("cannot access response document");e=SERVER_ABORT}if(e===CLIENT_TIMEOUT_ABORT&&xhr){xhr.abort("timeout");deferred.reject(xhr,"timeout");return}else{if(e==SERVER_ABORT&&xhr){xhr.abort("server abort");deferred.reject(xhr,"error","server abort");return}}if(!doc||doc.location.href==s.iframeSrc){if(!timedOut){return}}if(io.detachEvent){io.detachEvent("onload",cb)}else{io.removeEventListener("load",cb,false)}var status="success",errMsg;try{if(timedOut){throw"timeout"}var isXml=s.dataType=="xml"||doc.XMLDocument||$.isXMLDoc(doc);log("isXml="+isXml);if(!isXml&&window.opera&&(doc.body===null||!doc.body.innerHTML)){if(--domCheckCount){log("requeing onLoad callback, DOM not available");setTimeout(cb,250);return}}var docRoot=doc.body?doc.body:doc.documentElement;xhr.responseText=docRoot?docRoot.innerHTML:null;xhr.responseXML=doc.XMLDocument?doc.XMLDocument:doc;if(isXml){s.dataType="xml"}xhr.getResponseHeader=function(header){var headers={"content-type":s.dataType};return headers[header]};if(docRoot){xhr.status=Number(docRoot.getAttribute("status"))||xhr.status;xhr.statusText=docRoot.getAttribute("statusText")||xhr.statusText}var dt=(s.dataType||"").toLowerCase();var scr=/(json|script|text)/.test(dt);if(scr||s.textarea){var ta=doc.getElementsByTagName("textarea")[0];if(ta){xhr.responseText=ta.value;xhr.status=Number(ta.getAttribute("status"))||xhr.status;xhr.statusText=ta.getAttribute("statusText")||xhr.statusText}else{if(scr){var pre=doc.getElementsByTagName("pre")[0];var b=doc.getElementsByTagName("body")[0];if(pre){xhr.responseText=pre.textContent?pre.textContent:pre.innerText}else{if(b){xhr.responseText=b.textContent?b.textContent:b.innerText}}}}}else{if(dt=="xml"&&!xhr.responseXML&&xhr.responseText){xhr.responseXML=toXml(xhr.responseText)}}try{data=httpData(xhr,dt,s)}catch(err){status="parsererror";xhr.error=errMsg=(err||status)}}catch(err){log("error caught: ",err);status="error";xhr.error=errMsg=(err||status)}if(xhr.aborted){log("upload aborted");status=null}if(xhr.status){status=(xhr.status>=200&&xhr.status<300||xhr.status===304)?"success":"error"}if(status==="success"){if(s.success){s.success.call(s.context,data,"success",xhr)}deferred.resolve(xhr.responseText,"success",xhr);if(g){$.event.trigger("ajaxSuccess",[xhr,s])}}else{if(status){if(errMsg===undefined){errMsg=xhr.statusText}if(s.error){s.error.call(s.context,xhr,status,errMsg)}deferred.reject(xhr,"error",errMsg);if(g){$.event.trigger("ajaxError",[xhr,s,errMsg])}}}if(g){$.event.trigger("ajaxComplete",[xhr,s])}if(g&&!--$.active){$.event.trigger("ajaxStop")}if(s.complete){s.complete.call(s.context,xhr,status)}callbackProcessed=true;if(s.timeout){clearTimeout(timeoutHandle)}setTimeout(function(){if(!s.iframeTarget){$io.remove()}xhr.responseXML=null},100)}var toXml=$.parseXML||function(s,doc){if(window.ActiveXObject){doc=new ActiveXObject("Microsoft.XMLDOM");doc.async="false";doc.loadXML(s)}else{doc=(new DOMParser()).parseFromString(s,"text/xml")}return(doc&&doc.documentElement&&doc.documentElement.nodeName!="parsererror")?doc:null};var parseJSON=$.parseJSON||function(s){return window["eval"]("("+s+")")};var httpData=function(xhr,type,s){var ct=xhr.getResponseHeader("content-type")||"",xml=type==="xml"||!type&&ct.indexOf("xml")>=0,data=xml?xhr.responseXML:xhr.responseText;if(xml&&data.documentElement.nodeName==="parsererror"){if($.error){$.error("parsererror")}}if(s&&s.dataFilter){data=s.dataFilter(data,type)}if(typeof data==="string"){if(type==="json"||!type&&ct.indexOf("json")>=0){data=parseJSON(data)}else{if(type==="script"||!type&&ct.indexOf("javascript")>=0){$.globalEval(data)}}}return data};return deferred}};$.fn.ajaxForm=function(options){options=options||{};options.delegation=options.delegation&&$.isFunction($.fn.on);if(!options.delegation&&this.length===0){var o={s:this.selector,c:this.context};if(!$.isReady&&o.s){log("DOM not ready, queuing ajaxForm");$(function(){$(o.s,o.c).ajaxForm(options)});return this}log("terminating; zero elements found by selector"+($.isReady?"":" (DOM not ready)"));return this}if(options.delegation){$(document).off("submit.form-plugin",this.selector,doAjaxSubmit).off("click.form-plugin",this.selector,captureSubmittingElement).on("submit.form-plugin",this.selector,options,doAjaxSubmit).on("click.form-plugin",this.selector,options,captureSubmittingElement);return this}return this.ajaxFormUnbind().bind("submit.form-plugin",options,doAjaxSubmit).bind("click.form-plugin",options,captureSubmittingElement)};function doAjaxSubmit(e){var options=e.data;if(!e.isDefaultPrevented()){e.preventDefault();$(this).ajaxSubmit(options)}}function captureSubmittingElement(e){var target=e.target;var $el=$(target);if(!($el.is("[type=submit],[type=image]"))){var t=$el.closest("[type=submit]");if(t.length===0){return}target=t[0]}var form=this;form.clk=target;if(target.type=="image"){if(e.offsetX!==undefined){form.clk_x=e.offsetX;form.clk_y=e.offsetY}else{if(typeof $.fn.offset=="function"){var offset=$el.offset();form.clk_x=e.pageX-offset.left;form.clk_y=e.pageY-offset.top}else{form.clk_x=e.pageX-target.offsetLeft;form.clk_y=e.pageY-target.offsetTop}}}setTimeout(function(){form.clk=form.clk_x=form.clk_y=null},100)}$.fn.ajaxFormUnbind=function(){return this.unbind("submit.form-plugin click.form-plugin")};$.fn.formToArray=function(semantic,elements){var a=[];if(this.length===0){return a}var form=this[0];var els=semantic?form.getElementsByTagName("*"):form.elements;if(!els){return a}var i,j,n,v,el,max,jmax;for(i=0,max=els.length;i<max;i++){el=els[i];n=el.name;if(!n||el.disabled){continue}if(semantic&&form.clk&&el.type=="image"){if(form.clk==el){a.push({name:n,value:$(el).val(),type:el.type});a.push({name:n+".x",value:form.clk_x},{name:n+".y",value:form.clk_y})}continue}v=$.fieldValue(el,true);if(v&&v.constructor==Array){if(elements){elements.push(el)}for(j=0,jmax=v.length;j<jmax;j++){a.push({name:n,value:v[j]})}}else{if(feature.fileapi&&el.type=="file"){if(elements){elements.push(el)}var files=el.files;if(files.length){for(j=0;j<files.length;j++){a.push({name:n,value:files[j],type:el.type})}}else{a.push({name:n,value:"",type:el.type})}}else{if(v!==null&&typeof v!="undefined"){if(elements){elements.push(el)}a.push({name:n,value:v,type:el.type,required:el.required})}}}}if(!semantic&&form.clk){var $input=$(form.clk),input=$input[0];n=input.name;if(n&&!input.disabled&&input.type=="image"){a.push({name:n,value:$input.val()});a.push({name:n+".x",value:form.clk_x},{name:n+".y",value:form.clk_y})}}return a};$.fn.formSerialize=function(semantic){return $.param(this.formToArray(semantic))};$.fn.fieldSerialize=function(successful){var a=[];this.each(function(){var n=this.name;if(!n){return}var v=$.fieldValue(this,successful);if(v&&v.constructor==Array){for(var i=0,max=v.length;i<max;i++){a.push({name:n,value:v[i]})}}else{if(v!==null&&typeof v!="undefined"){a.push({name:this.name,value:v})}}});return $.param(a)};$.fn.fieldValue=function(successful){for(var val=[],i=0,max=this.length;i<max;i++){var el=this[i];var v=$.fieldValue(el,successful);if(v===null||typeof v=="undefined"||(v.constructor==Array&&!v.length)){continue}if(v.constructor==Array){$.merge(val,v)}else{val.push(v)}}return val};$.fieldValue=function(el,successful){var n=el.name,t=el.type,tag=el.tagName.toLowerCase();if(successful===undefined){successful=true}if(successful&&(!n||el.disabled||t=="reset"||t=="button"||(t=="checkbox"||t=="radio")&&!el.checked||(t=="submit"||t=="image")&&el.form&&el.form.clk!=el||tag=="select"&&el.selectedIndex==-1)){return null}if(tag=="select"){var index=el.selectedIndex;if(index<0){return null}var a=[],ops=el.options;var one=(t=="select-one");var max=(one?index+1:ops.length);for(var i=(one?index:0);i<max;i++){var op=ops[i];if(op.selected){var v=op.value;if(!v){v=(op.attributes&&op.attributes.value&&!(op.attributes.value.specified))?op.text:op.value}if(one){return v}a.push(v)}}return a}return $(el).val()};$.fn.clearForm=function(includeHidden){return this.each(function(){$("input,select,textarea",this).clearFields(includeHidden)})};$.fn.clearFields=$.fn.clearInputs=function(includeHidden){var re=/^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;return this.each(function(){var t=this.type,tag=this.tagName.toLowerCase();if(re.test(t)||tag=="textarea"){this.value=""}else{if(t=="checkbox"||t=="radio"){this.checked=false}else{if(tag=="select"){this.selectedIndex=-1}else{if(t=="file"){if(/MSIE/.test(navigator.userAgent)){$(this).replaceWith($(this).clone(true))}else{$(this).val("")}}else{if(includeHidden){if((includeHidden===true&&/hidden/.test(t))||(typeof includeHidden=="string"&&$(this).is(includeHidden))){this.value=""}}}}}}})};$.fn.resetForm=function(){return this.each(function(){if(typeof this.reset=="function"||(typeof this.reset=="object"&&!this.reset.nodeType)){this.reset()}})};$.fn.enable=function(b){if(b===undefined){b=true}return this.each(function(){this.disabled=!b})};$.fn.selected=function(select){if(select===undefined){select=true}return this.each(function(){var t=this.type;if(t=="checkbox"||t=="radio"){this.checked=select}else{if(this.tagName.toLowerCase()=="option"){var $sel=$(this).parent("select");if(select&&$sel[0]&&$sel[0].type=="select-one"){$sel.find("option").selected(false)}this.selected=select}}})};$.fn.ajaxSubmit.debug=false;function log(){if(!$.fn.ajaxSubmit.debug){return}var msg="[jquery.form] "+Array.prototype.join.call(arguments,"");if(window.console&&window.console.log){window.console.log(msg)}else{if(window.opera&&window.opera.postError){window.opera.postError(msg)}}}})(jQuery);

/*!
    jQuery Autosize v1.16.7
    (c) 2013 Jack Moore - jacklmoore.com
    updated: 2013-03-20
    license: http://www.opensource.org/licenses/mit-license.php
*/
(function(e){var t,o,n={className:"autosizejs",append:"",callback:!1},i="hidden",s="border-box",a="lineHeight",l='<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden;"/>',r=["fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","textTransform","wordSpacing","textIndent"],c="oninput",h="onpropertychange",p=e(l).data("autosize",!0)[0];p.style.lineHeight="99px","99px"===e(p).css(a)&&r.push(a),p.style.lineHeight="",e.fn.autosize=function(a){return a=e.extend({},n,a||{}),p.parentNode!==document.body&&(e(document.body).append(p),p.value="\n\n\n",p.scrollTop=9e4,t=p.scrollHeight===p.scrollTop+p.clientHeight),this.each(function(){function n(){o=b,p.className=a.className,e.each(r,function(e,t){p.style[t]=f.css(t)})}function l(){var e,s,l;if(o!==b&&n(),!d){d=!0,p.value=b.value+a.append,p.style.overflowY=b.style.overflowY,l=parseInt(b.style.height,10),p.style.width=Math.max(f.width(),0)+"px",t?e=p.scrollHeight:(p.scrollTop=0,p.scrollTop=9e4,e=p.scrollTop);var r=parseInt(f.css("maxHeight"),10);r=r&&r>0?r:9e4,e>r?(e=r,s="scroll"):u>e&&(e=u),e+=x,b.style.overflowY=s||i,l!==e&&(b.style.height=e+"px",w&&a.callback.call(b)),setTimeout(function(){d=!1},1)}}var u,d,g,b=this,f=e(b),x=0,w=e.isFunction(a.callback);f.data("autosize")||((f.css("box-sizing")===s||f.css("-moz-box-sizing")===s||f.css("-webkit-box-sizing")===s)&&(x=f.outerHeight()-f.height()),u=Math.max(parseInt(f.css("minHeight"),10)-x,f.height()),g="none"===f.css("resize")||"vertical"===f.css("resize")?"none":"horizontal",f.css({overflow:i,overflowY:i,wordWrap:"break-word",resize:g}).data("autosize",!0),h in b?c in b?b[c]=b.onkeyup=l:b[h]=l:b[c]=l,e(window).on("resize",function(){d=!1,l()}),f.on("autosize",function(){d=!1,l()}),l())})}})(window.jQuery||window.Zepto);

// jquery.observer.js
(function(c){c.sub||(jQuery.sub=function(){function c(f,e){return new c.fn.init(f,e)}jQuery.extend(!0,c,this);c.superclass=this;c.fn=c.prototype=this();c.fn.constructor=c;c.sub=this.sub;c.fn.init=function(f,e){e&&(e instanceof jQuery&&!(e instanceof c))&&(e=c(e));return jQuery.fn.init.call(this,f,e,h)};c.fn.init.prototype=c.fn;var h=c(document);return c});var h=c.sub();"find has not filter is closest index add addBack".split(" ").forEach(function(d){var i=h.fn[d];h.fn[d]=function(){for(var f=[],e,
d=0;d<arguments.length;d++){var g=arguments[d];if(g&&(g.nodeType||g instanceof jQuery)){var n=c(g);e=e||this.root();if(e.is(n)||e.find(n).length){f.push(g);continue}g=[];for(d=0;d<n.length;d++)var k=c(n[d]).capturePath(e.data("branch")),g=g.concat(e.yieldPath(k).get());g=c(g)}f.push(g)}f=i.apply(this,f);return f instanceof jQuery?h(f.get()):f}});c.fn.root=function(){var d=this.map(function(){for(var d=c(this),f;d.length;)f=d,d=d.parent();return f.get(0)}).get();return c(c.unique(d))};c.fn.branch=
function(c,i){return h(this.clone(void 0===c?!1:c,void 0===i?!1:i).data("branch",this).get())}})(jQuery);
(function(c){c.fn.path=function(h){var d=[],i=!!h,h=c(h||window.document);this.each(function(){for(var f=[],e=c(this),j=e.parent();j.length&&!e.is(h);j=j.parent()){var g=e.get(0).tagName.toLowerCase();f.push(g+":eq("+j.children(g).index(e)+")");e=j}(!i||j.length||e.is(h))&&d.push(f.reverse().join(" > "))});return d.join(", ")};c.fn.capturePath=function(h){var d=this,i=this.get(0)instanceof Text,f;if(i){var d=this.parent(),e=d.contents();for(f=0;f<e.length&&e[f]!==this[0];f++);}var j=d.path(h),g=d.is(h);
return function(d){d||(d=this instanceof jQuery||this.nodeType?this:document);var e=c(d).find(j);g&&(e=c(d));return!i?e:c(e.contents()[f])}};c.fn.yieldPath=function(c){return"function"===typeof c?c(this):this.find(c)}})(jQuery);
(function(c){var h=function(a,b){var c={};a.forEach(function(a){(a=b(a))&&(c[a[0]]=a[1])});return c},d=h("childList attributes characterData subtree attributeOldValue characterDataOldValue attributeFilter".split(" "),function(a){return[a.toLowerCase(),a]}),i=h(Object.keys(d),function(a){if("attributefilter"!==a)return[d[a],!0]}),f=h(["added","removed"],function(a){return[a.toLowerCase(),a]}),e=c([]),j=function(a){if("object"===typeof a)return a;var a=a.split(/\s+/),b={};a.forEach(function(a){a=a.toLowerCase();
if(!d[a]&&!f[a])throw Error("Unknown option "+a);b[d[a]||f[a]]=!0});return b},g=function(a){return"["+Object.keys(a).sort().reduce(function(b,c){var d=a[c]&&"object"===typeof a[c]?g(a[c]):a[c];return b+"["+JSON.stringify(c)+":"+d+"]"},"")+"]"},n=window.MutationObserver||window.WebKitMutationObserver,k=function(a,b,l,d){this._originalOptions=c.extend({},b);b=c.extend({},b);this.attributeFilter=b.attributeFilter;delete b.attributeFilter;l&&(b.subtree=!0);b.childList&&(b.added=!0,b.removed=!0);if(b.added||
b.removed)b.childList=!0;this.target=c(a);this.options=b;this.selector=l;this.handler=d};k.prototype.is=function(a,b,c){return g(this._originalOptions)===g(a)&&this.selector===b&&this.handler===c};k.prototype.match=function(a){var b=this.options,l=a.type;if(!this.options[l])return e;if(this.selector)switch(l){case "attributes":if(!this._matchAttributeFilter(a))break;case "characterData":return this._matchAttributesAndCharacterData(a);case "childList":if(a.addedNodes&&(a.addedNodes.length&&b.added)&&
(l=this._matchAddedNodes(a),l.length))return l;if(a.removedNodes&&a.removedNodes.length&&b.removed)return this._matchRemovedNodes(a)}else{var d=a.target instanceof Text?c(a.target).parent():c(a.target);if(!b.subtree&&d.get(0)!==this.target.get(0))return e;switch(l){case "attributes":if(!this._matchAttributeFilter(a))break;case "characterData":return this.target;case "childList":if(a.addedNodes&&a.addedNodes.length&&b.added||a.removedNodes&&a.removedNodes.length&&b.removed)return this.target}}return e};
k.prototype._matchAttributesAndCharacterData=function(a){return this._matchSelector(this.target,[a.target])};k.prototype._matchAddedNodes=function(a){return this._matchSelector(this.target,a.addedNodes)};k.prototype._matchRemovedNodes=function(a){var b=this.target.branch(),d=Array.prototype.slice.call(a.removedNodes).map(function(a){return c(a).clone(!1,!1).get(0)});a.previousSibling?b.find(a.previousSibling).after(d):a.nextSibling?b.find(a.nextSibling).before(d):(b.is(a.target)?b:b.find(a.target)).empty().append(d);
return this._matchSelector(b,d).length?c(a.target):e};k.prototype._matchSelector=function(a,b){var d=a.find(this.selector),b=c(Array.prototype.slice.call(b).map(function(a){return a instanceof Text?c(a).parent().get(0):a}));return d=d.filter(function(){return b.is(this)||b.has(this).length})};k.prototype._matchAttributeFilter=function(a){return this.attributeFilter&&this.attributeFilter.length?0<=this.attributeFilter.indexOf(a.attributeName):!0};var p=function(a){this.patterns=[];this._target=a;this._observer=
null};p.prototype.observe=function(a,b,c){var d=this;this._observer?this._observer.disconnect():this._observer=new n(function(a){a.forEach(function(a){for(var b=0;b<d.patterns.length;b++){var c=d.patterns[b],e=c.match(a);e.length&&e.each(function(){c.handler.call(this,a)})}})});this.patterns.push(new k(this._target,a,b,c));this._observer.observe(this._target,this._collapseOptions())};p.prototype.disconnect=function(a,b,c){var d=this;this._observer&&(this.patterns.filter(function(d){return d.is(a,
b,c)}).forEach(function(a){a=d.patterns.indexOf(a);d.patterns.splice(a,1)}),this.patterns.length||this._observer.disconnect())};p.prototype.disconnectAll=function(){this._observer&&(this.patterns=[],this._observer.disconnect())};p.prototype.pause=function(){this._observer&&this._observer.disconnect()};p.prototype.resume=function(){this._observer&&this._observer.observe(this._target,this._collapseOptions())};p.prototype._collapseOptions=function(){var a={};this.patterns.forEach(function(b){var d=a.attributes&&
a.attributeFilter;if((d||!a.attributes)&&b.attributeFilter){var e={},f=[];(a.attributeFilter||[]).concat(b.attributeFilter).forEach(function(a){e[a]||(f.push(a),e[a]=1)});a.attributeFilter=f}else d&&(b.options.attributes&&!b.attributeFilter)&&delete a.attributeFilter;c.extend(a,b.options)});Object.keys(f).forEach(function(b){delete a[f[b]]});return a};var m=function(a){this.patterns=[];this._paused=!1;this._target=a;this._events={};this._handler=this._handler.bind(this)};m.prototype.NS=".jQueryObserve";
m.prototype.observe=function(a,b,d){a=new k(this._target,a,b,d);c(this._target);a.options.childList&&(this._addEvent("DOMNodeInserted"),this._addEvent("DOMNodeRemoved"));a.options.attributes&&this._addEvent("DOMAttrModified");a.options.characterData&&this._addEvent("DOMCharacerDataModified");this.patterns.push(a)};m.prototype.disconnect=function(a,b,d){var e=c(this._target),f=this;this.patterns.filter(function(c){return c.is(a,b,d)}).forEach(function(a){a=f.patterns.indexOf(a);f.patterns.splice(a,
1)});var g=this.patterns.reduce(function(a,b){b.options.childList&&(a.DOMNodeInserted=!0,a.DOMNodeRemoved=!0);b.options.attributes&&(a.DOMAttrModified=!0);b.options.characterData&&(a.DOMCharacerDataModified=!0);return a},{});Object.keys(this._events).forEach(function(a){g[a]||(delete f._events[a],e.off(a+f.NS,f._handler))})};m.prototype.disconnectAll=function(){var a=c(this._target),b;for(b in this._events)a.off(b+this.NS,this._handler);this._events={};this.patterns=[]};m.prototype.pause=function(){this._paused=
!0};m.prototype.resume=function(){this._paused=!1};m.prototype._handler=function(a){if(!this._paused){var b={type:null,target:null,addedNodes:null,removedNodes:null,previousSibling:null,nextSibling:null,attributeName:null,attributeNamespace:null,oldValue:null};switch(a.type){case "DOMAttrModified":b.type="attributes";b.target=a.target;b.attributeName=a.attrName;b.oldValue=a.prevValue;break;case "DOMCharacerDataModified":b.type="characterData";b.target=c(a.target).parent().get(0);b.attributeName=a.attrName;
b.oldValue=a.prevValue;break;case "DOMNodeInserted":b.type="childList";b.target=a.relatedNode;b.addedNodes=[a.target];b.removedNodes=[];break;case "DOMNodeRemoved":b.type="childList",b.target=a.relatedNode,b.addedNodes=[],b.removedNodes=[a.target]}for(a=0;a<this.patterns.length;a++){var d=this.patterns[a],e=d.match(b);e.length&&e.each(function(){d.handler.call(this,b)})}}};m.prototype._addEvent=function(a){this._events[a]||(c(this._target).on(a+this.NS,this._handler),this._events[a]=!0)};c.fn.observe=
function(a,b,d){b?d||(d=b,b=null):(d=a,a=i);return this.each(function(){var e=c(this),f=e.data("observer");f||(f=n?new p(this):new m(this),e.data("observer",f));a=j(a);f.observe(a,b,d)})};c.fn.disconnect=function(a,b,d){a&&(b?d||(d=b,b=null):(d=a,a=i));return this.each(function(){var e=c(this),f=e.data("observer");f&&(a?(a=j(a),f.disconnect(a,b,d)):(f.disconnectAll(),e.removeData("observer")))})}})(jQuery);

/*!
* jQuery Cookie Plugin v1.3.1
* https://github.com/carhartl/jquery-cookie
*
* Copyright 2013 Klaus Hartl
* Released under the MIT license
*/
(function(factory){if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else{factory(jQuery)}}(function($){var pluses=/\+/g;function raw(s){return s}function decoded(s){return decodeURIComponent(s.replace(pluses," "))}function converted(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{return config.json?JSON.parse(s):s}catch(er){}}var config=$.cookie=function(key,value,options){if(value!==undefined){options=$.extend({},config.defaults,options);if(typeof options.expires==="number"){var days=options.expires,t=options.expires=new Date();t.setDate(t.getDate()+days)}value=config.json?JSON.stringify(value):String(value);return(document.cookie=[config.raw?key:encodeURIComponent(key),"=",config.raw?value:encodeURIComponent(value),options.expires?"; expires="+options.expires.toUTCString():"",options.path?"; path="+options.path:"",options.domain?"; domain="+options.domain:"",options.secure?"; secure":""].join(""))}var decode=config.raw?raw:decoded;var cookies=document.cookie.split("; ");var result=key?undefined:{};for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split("=");var name=decode(parts.shift());var cookie=decode(parts.join("="));if(key&&key===name){result=converted(cookie);break}if(!key){result[name]=converted(cookie)}}return result};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)!==undefined){$.cookie(key,"",$.extend({},options,{expires:-1}));return true}return false}}));

/*
	jQuery marquee from Stack Overflow
	http://stackoverflow.com/questions/10547797/very-simple-very-smooth-javascript-marquee
*/
(function($) {
        $.fn.textWidth = function(){
             var calc = '<span style="display:none">' + $(this).text() + '</span>';
             $('body').append(calc);
             var width = $('body').find('span:last').width();
             $('body').find('span:last').remove();
            return width;
        };

        $.fn.marquee = function(args) {
            var that = $(this);
            var textWidth = that.textWidth(),
                offset = that.width(),
                width = offset,
                css = {
                    'text-indent' : that.css('text-indent'),
                    'overflow' : that.css('overflow'),
                    'white-space' : that.css('white-space')
                },
                marqueeCss = {
                    'text-indent' : width,
                    'overflow' : 'hidden',
                    'white-space' : 'nowrap'
                },
                args = $.extend(true, { count: -1, speed: 1e1, leftToRight: false }, args),
                i = 0,
                stop = textWidth*-1,
                dfd = $.Deferred();

            function go() {
                if(!that.length) return dfd.reject();
                if(width == stop) {
                    i++;
                    if(i == args.count) {
                        that.css(css);
                        return dfd.resolve();
                    }
                    if(args.leftToRight) {
                        width = textWidth*-1;
                    } else {
                        width = offset;
                    }
                }
                that.css('text-indent', width + 'px');
                if(args.leftToRight) {
                    width++;
                } else {
                    width--;
                }
                setTimeout(go, args.speed);
            };
            if(args.leftToRight) {
                width = textWidth*-1;
                width++;
                stop = offset;
            } else {
                width--;            
            }
            that.css(marqueeCss);
            go();
            return dfd.promise();
        };
    })(jQuery);

    // jQuery autoGrowInput plugin by James Padolsey
(function($){$.fn.autoGrowInput=function(o){o=$.extend({maxWidth:1000,minWidth:0,comfortZone:70},o);this.filter("input:text").each(function(){var minWidth=o.minWidth||$(this).width(),val="",input=$(this),testSubject=$("<tester/>").css({position:"absolute",top:-9999,left:-9999,width:"auto",fontSize:input.css("fontSize"),fontFamily:input.css("fontFamily"),fontWeight:input.css("fontWeight"),letterSpacing:input.css("letterSpacing"),whiteSpace:"nowrap"}),check=function(){if(val===(val=input.val())){return}var escaped=val.replace(/&/g,"&amp;").replace(/\s/g,"&nbsp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");testSubject.html(escaped);var testerWidth=testSubject.width(),newWidth=(testerWidth+o.comfortZone)>=minWidth?testerWidth+o.comfortZone:minWidth,currentWidth=input.width(),isValidWidthChange=(newWidth<currentWidth&&newWidth>=minWidth)||(newWidth>minWidth&&newWidth<o.maxWidth);if(isValidWidthChange){input.width(newWidth)}};testSubject.insertAfter(input);$(this).bind("keyup keydown blur update",check)});return this}})(jQuery);

// All pages
$(document).ready(function() {

	$('*[data-tooltip]').on('mouseenter mouseleave', dataTooltip);

});

function dataTooltip(e) {
	var tooltip, pos;

	if (e.type == 'mouseleave') {
		tooltip = $(this).find('.arrow_box');
		if (tooltip) {
			tooltip.remove();
			return;
		}
	}

	pos = ($(this).attr('data-tooltip-pos')) ? $(this).attr('data-tooltip-pos') : 'top';

	tooltip = $('<div class="arrow_box ' + pos + '"/>').prependTo(this).html($(this).attr('data-tooltip')).show();
}