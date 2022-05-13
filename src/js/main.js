import {english,arabic} from "./animations";
import lottie from "lottie-web";
import SmoothScroll,{easeInOutBack} from "smooth-scroll"

const clearMessage = function (which,msg) {
    console.log(which,msg);
    which.parentNode.insertBefore(msg, which.nextElementSibling);

    const timer = setTimeout( () => {
        document.querySelectorAll('.info-msg').forEach(el => {
            el.parentNode.removeChild(el);
        })
    },3000);
}
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

document.addEventListener("DOMContentLoaded",()=>{
    const server = "https://node.huryti.com";
    document.querySelector("#hero form").addEventListener("submit",function (event){
        event.preventDefault()
        const msgSpan = document.createElement('span')
        msgSpan.classList.add('info-msg');
        if(validateEmail(this.subscribe.value)) {
            fetch(server + "/register", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "post",
                body: JSON.stringify({email: this.subscribe.value})
            }).then((res) => res.json()).then((data) => {
                msgSpan.classList.add('done');
                msgSpan.innerText = 'Success';
                this.subscribe.value = '';
                clearMessage(this,msgSpan);
            }).catch((err) => {
                msgSpan.classList.add('failed');
                msgSpan.innerText = 'communication error';
                clearMessage(this,msgSpan);
            })
        } else {
            msgSpan.classList.add('failed');
            console.log(msgSpan);
            msgSpan.innerText = 'Invalid email';
            clearMessage(this, msgSpan);
        }

    });

    document.querySelector("#contact form").addEventListener("submit",function (event){
        event.preventDefault()
        console.log("fetching");
        const {name,phone,email,message} = this.elements
        const info = {};
        [name,phone,email,message].forEach(el=>{
                info[el.name] = el.value
        })
        let errs = [];

        if(!validateEmail(email.value)) {
            errs.push('email')
        }
        if(name.value.length < 4) {
            errs.push('name')
        }
        if(phone.value.length < 4) {
            errs.push('phone')
        }
        if(message.value.length < 4) {
            errs.push('message')
        }
        console.log(errs);
        const msgSpan = document.createElement('span')
        msgSpan.classList.add('info-msg');
        if(errs.length) {
            msgSpan.classList.add('failed')
            msgSpan.innerText = "Errors: " + errs.join(", ");
            clearMessage(this,msgSpan)
        } else {
            fetch(server + "/contact", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "post",
                body: JSON.stringify(info)
            }).then((res) => res.json()).then((data) => {
                msgSpan.classList.add('done')
                msgSpan.innerText = "Success";
                clearMessage(this,msgSpan)
            }).catch((err) => {
                msgSpan.classList.add('danger')
                msgSpan.innerText = "Communication error";
                clearMessage(this,msgSpan)
                console.log(err);
            })
        }
    });

    let mac = /(Mac|iPhone|iPod|iPad|Linux)/i.test(navigator.platform);
    if(mac){
        let style = document.createElement('style');
        style.innerHTML = "button.btn, a.btn{ padding-top: .7em !important; padding-bottom: .4em !important} #options a.btn:after { padding-bottom: .25em !important}";
        document.head.appendChild(style);
    }

    const scrollToSmoothSettings = {
        // Selectors
        container: document,
        targetAttribute: 'href',
        topOnEmptyHash: true,
        offset: null,
        // Speed and duration
        duration: 800,
        durationRelative: true,
        durationMin: 300,
        durationMax: 5000,
        easing: easeInOutBack,
        // Callbacks
        onScrollStart: null,
        onScrollUpdate: null,
        onScrollEnd: null
    };
    document.querySelector('#options a').addEventListener('clicks',(event)=>{
        event.preventDefault();
        const smoothScroll = new SmoothScroll();

        smoothScroll.animateScroll(document.getElementById('contact'),event.target,{ speed: 800, easing: 'easeOutCubic' });
    })


    console.log(scroll)

    const animationData = document.body.dataset.lang === "english" ? english : arabic;

    const params = [{
        container: document.querySelectorAll('.image')[0],
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: animationData[0]
    },{
        container: document.querySelectorAll('.image')[1],
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: animationData[1]
    }];


    const elementInView = (el) => {
        const elementTop = el.getBoundingClientRect().top;

        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight)
        );
    };
    var started = [0,1];

    const anims = Array.from(document.querySelectorAll('.info')).map((el,index) => {

        console.log("loading");
        return  lottie.loadAnimation(params[index]);



    });
    window.onscroll = function (e){

        document.querySelectorAll('.image').forEach((el,index) => {
            if (elementInView(el, 200)) {
                if(started.includes(index)) {
                    params[index].container = el.previousElementSibling;



                    console.log(anims[0]);
                    //anims[0].goToAndPlay(0,true);
                    anims[index].goToAndPlay(0,true);
                    console.log(params[index]);
                    started = started.filter(el => el !== index);
                }
            }
        })
    }

    document.querySelectorAll('.tab').forEach((el)=>{

        el.addEventListener("click",function (event){
            event.preventDefault();
            document.querySelectorAll('.tab').forEach((el)=>{
                el.classList.remove('active');
            })
            el.classList.add('active');
            let href = this.href.split("#");
            href = "#" + href[href.length - 1];
            console.log(href)
            document.querySelectorAll('.tabs ul').forEach((el) => {
                console.log(el);
                el.style.display = "none"
            });
            console.log(href);
           document.querySelector(href).style.display = "block"
        })
    })
});