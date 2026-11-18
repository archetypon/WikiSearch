/**
 *
 * @author: Andrea Pagliarani
 * @since: 19/01/2020
 *
 * Copyright © 2020 Andrea Pagliarani
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


// on copy action call function
document.addEventListener("copy", function(event) {
                          const inStr = document.getSelection().toString();
                          safari.extension.dispatchMessage(inStr);
});

// listen for the massage
safari.self.addEventListener("message", messageHandler);

// call main function
function messageHandler(event){
        var textToSend = event.name;
        fetchWiki(textToSend);
}


function fetchWiki(text){
    
    //to detect nav lang and choose wiki url
    var lang = navigator.language;
    //call wiki
    
    var url = "https://"+lang.substring(0,2)+".wikipedia.org/w/api.php";
    
    
    //param for open search
    var params = {
        action: "opensearch",
        search: text,
        limit: "1",
        namespace: "0",
        format: "json",
        prop: "extracts"
    };
    
    // see MediaWiki API doc for details
    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

    fetch(url)
        .then(function(response){return response.json();})
        .then(function(response) {
                getWikiExtr(response[1]);
              })
        .catch(function(error){console.log(error);});
    
    
    

}

function getWikiExtr(text){
    
    var lang = navigator.language;
    //call wiki
    
    var url = "https://"+lang.substring(0,2)+".wikipedia.org/w/api.php";

    var params = {
        
            action: "query",
            format: "json",
            prop: "extracts",
            indexpageids: "1",
            list: "",
            titles: text,
            formatversion: "2",
            exintro: "1",
            explaintext: "1"
        
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

    fetch(url)
        .then(function(response){return response.json();})
        .then(function(response) {
                
                // get the selection range and put text on its right side
                var sel, range, node;
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    range = window.getSelection().getRangeAt(0);
                    range.collapse(false);

                    // create a div to contain
                    var el = document.createElement("div");
                    // put text inside div and highlight
                    el.innerHTML = '<div style="background-color:yellow">'+response.query.pages[0].extract+'</div>';
                    var frag = document.createDocumentFragment(), node, lastNode;
                    while ( (node = el.firstChild) ) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);
                }

              })
        .catch(function(error){console.log(error);});
    
}
