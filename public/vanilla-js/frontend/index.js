(async () => {

    if(window.innerWidth >= 1024){
        setTimeout(() => document.querySelector("#logo-text").style.width = "40%", 100);
        for(let i = 0; i<15; i++) await new Promise((res) => setTimeout(() => { 
            const rolledOutNumber = Math.round(Math.random() * 6);
            const diceDots = document.querySelectorAll(".d");
            switch(rolledOutNumber){
                case 1: for(const dd of diceDots) if(dd.classList.contains("one")) dd.style.display = "block"; else dd.style.display = "none"; break;
                case 2: for(const dd of diceDots) if(dd.classList.contains("two")) dd.style.display = "block"; else dd.style.display = "none"; break;
                case 3: for(const dd of diceDots) if(dd.classList.contains("three")) dd.style.display = "block"; else dd.style.display = "none"; break;
                case 4: for(const dd of diceDots) if(dd.classList.contains("four")) dd.style.display = "block"; else dd.style.display = "none"; break;
                case 5: for(const dd of diceDots) if(dd.classList.contains("five")) dd.style.display = "block"; else dd.style.display = "none"; break;
                case 6: for(const dd of diceDots) if(dd.classList.contains("six")) dd.style.display = "block"; else dd.style.display = "none"; break;
            }
            res();
        }, 100));
        document.querySelector(".subtitle").style.transform = "scale(1, 0.8)";
        setTimeout(() => {
            document.querySelector("#logo").style.transform = "scale(0.1)";
            document.querySelector("#logo").style.top = "-46.5%";
        }, 2000);
        setTimeout(() => {
            document.querySelector("#dice").classList.add("shake");
            document.querySelector("#logo-text div").classList.add("modded");
        }, 3000);
    }else{
        document.querySelector("#logo").style.display = "none"
    }
    
    setTimeout(() => document.querySelector("#banner .caption").style.transform = "scale(1)", 1000 + (window.innerWidth >= 1024 ? 3000 : 0))
    setTimeout(() => document.body.style.overflowY = "auto", 2500 + (window.innerWidth >= 1024 ? 3000 : 0))
    setTimeout(() => window.location.replace("#about-me"), 3000 + (window.innerWidth >= 1024 ? 3000 : 0))
})()