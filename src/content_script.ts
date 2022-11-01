// hook our custom script
// *if on strollbox
if (location.origin === "https://trollbox.suspc.cf") {
    //console.log('a')
    const targetNode = document;

    const config = {
        attributes: false,
        childList: true,
        subtree: true
    }

    const observer = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.addedNodes[0].nodeName === "SCRIPT") {
                const scriptTag = mutation.addedNodes[0] as HTMLScriptElement;
                //console.log(mutation.type, scriptCount, scriptTag.innerText, scriptTag)
                //console.log(scriptTag.src);
                if (scriptTag.src === "https://trollbox.suspc.cf/duck.js") {
                    scriptTag.innerText = "";
                    scriptTag.src = chrome.runtime.getURL("/web/strollbox.js");
                    observer.disconnect();
                    return;
                }
            }
        }
    })

    observer.observe(targetNode, config);
}
const s = document.createElement('script');
s.src = chrome.runtime.getURL("/dist/inject.js");
s.id = "modbox_script"
s.defer = true;

document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(s);
})