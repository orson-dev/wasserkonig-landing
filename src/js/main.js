function vcui(cui) {
  let pattern = /(RO)?([0-9]+)/i;


  let cif = cui.toUpperCase().match(pattern)[0];

  if (cif.length >= 2 && cif.length <= 10) {
    let v = 753217532;

    cif = parseInt(cif.replace('RO', ''));


    let c1 = cif % 10;
    console.log(c1);
    cif = parseInt(cif / 10);


    let t = 0;
    while (cif > 0) {
      t += (cif % 10) * (v % 10);
      cif = parseInt(cif / 10);
      v = parseInt(v / 10);
    }


    c2 = t * 10 % 11;

    if (c2 == 10) {
      c2 = 0;
    }
    return c1 === c2;
  }
  return false;
}

const clearMessage = function(which, msg) {
  console.log(which, msg);
  which.parentNode.insertBefore(msg, which.nextElementSibling);

  const timer = setTimeout(() => {
    document.querySelectorAll('.info-msg').forEach(el => {
      el.parentNode.removeChild(el);
    })
  }, 3000);
}
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[href*='#']").forEach((el, i) => {

    el.addEventListener("click", function(e) {
      e.preventDefault();
      console.log("#" + this.href.split("#").pop());
      const toHide = document.querySelector('section:not(.hidden)');
      console.log(toHide);
      document.querySelector("#" + this.href.split("#").pop()).classList.remove('hidden');
      document.querySelector("#" + this.href.split("#").pop()).classList.add('visible')
      toHide.classList.add('hidden');
    })
  });







  const server = "https://app.algoritmit.ro";


  document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault()
    console.log("fetching");
    const {
      name,
      phone,
      email,
      cui: message
    } = this.elements
    const info = {};
    [name, phone, email, message].forEach(el => {
      info[el.name] = el.value;
      el.classList.remove("invalid")
    })
    let errs = [];

    if (!validateEmail(email.value)) {
      errs.push('email')
    }
    if (name.value.length < 4) {
      errs.push('name')
    }
    if (phone.value.length < 4) {
      errs.push('phone')
    }
    if (message.value.length < 2 || !vcui(message.value)) {
      errs.push('cui')

    }
    errs.forEach((item, i) => {
      this[item].classList.add("invalid")
    });

    const msgSpan = document.createElement('span')
    msgSpan.classList.add('info-msg');
    if (errs.length) {
      msgSpan.classList.add('failed')
      // msgSpan.innerText = "Erori: " + errs.join(", ");
      clearMessage(this, msgSpan)
    } else {
      fetch(server + "/contact", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "post",
        body: JSON.stringify(info)
      }).then((res) => res.json()).then((data) => {
        document.querySelector("#multumim").classList.remove('hidden');
        document.querySelector("#multumim").classList.add('visible');
        document.querySelector("#form").classList.add('hidden');
        clearMessage(this, msgSpan)
      }).catch((err) => {
        msgSpan.classList.add('danger')
        msgSpan.innerText = "Eroare comunicatie";

        clearMessage(this, msgSpan)
        console.log(err);
      })
    }
  });


});
