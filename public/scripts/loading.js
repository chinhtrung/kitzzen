let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
        clearInterval(stateCheck);
        document.querySelector("#main-component").classList.remove("hidden");
        document.querySelector("#loading-component").classList.add("hidden");
    }
}, 500);